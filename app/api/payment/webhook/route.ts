import {NextRequest, NextResponse} from "next/server";
import {connectDB} from "@/lib/db/connect";
import {Order, IOrder} from "@/lib/db/models/Order";
import {Receipt} from "@/lib/db/models/Receipt";
import {User} from "@/lib/db/models/User";
import {createAuditLog} from "@/lib/db/audit";
import {paymentService} from "@/lib/payments/payment-service";
import {yookassaService} from "@/lib/payments/yookassa";
import {receiptService} from "@/lib/payments/receipts";
import {sendEmail, sendAdminEmail} from "@/lib/email";
import {ClientWelcomeTemplate} from "@/lib/email/templates/client-welcome";
import {ClientReceiptTemplate} from "@/lib/email/templates/client-receipt";
import {AdminNewOrderTemplate} from "@/lib/email/templates/admin-new-order";

/**
 * Фоновая отправка email — не блокирует ответ webhook
 * На Vercel работает асинхронно, локально — синхронно
 */
function runAfter(callback: () => Promise<void>) {
    // Выполняем без await — webhook отвечает сразу
    callback().catch((err) => {
        console.error("❌ Background email task failed:", err);
    });
}

/**
 * POST /api/payment/webhook
 * Обработка webhook от платежных систем (ЮKassa, PayKeeper)
 * 
 * Особенности:
 * - Проверка подписи вебхука (для YooKassa)
 * - Идемпотентность: обработка дублирующихся вебхуков
 * - Логирование cancellation_details для аналитики
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const signature = request.headers.get("x-signature") || undefined;
        const eventType = request.headers.get("x-event-type") || body.type || body.Event;

        // Извлекаем paymentId для идемпотентности
        const paymentIdFromBody = (body.object as { id?: string })?.id;
        
        console.log(`💳 Payment webhook received: ${eventType}`, {
            paymentId: paymentIdFromBody,
            eventId: (body.object as { id?: string })?.id,
        });

        await connectDB();

        let orderId: string;
        let status: string;
        let paymentId: string;

        // Определение провайдера и обработка
        if (eventType?.includes("yookassa") || body.object?.metadata?.order_id) {
            // ЮKassa
            const result = await yookassaService.handleWebhook(body, signature);
            orderId = result.orderId;
            status = result.status;
            paymentId = result.paymentId;
        } else {
            // PayKeeper или другой провайдер через универсальный сервис
            const result = await paymentService.handleWebhook(body, signature);
            if (!result.success) {
                return NextResponse.json(
                    {success: false, error: result.error},
                    {status: 400}
                );
            }
            orderId = result.orderId;
            status = result.status;
            paymentId = result.paymentId;
        }

        // Обновление статуса заказа
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                {success: false, error: "Order not found"},
                {status: 404}
            );
        }

        // ✅ ПРОВЕРКА НА ДУБЛИРУЮЩИЙСЯ ВЕБХУК (Idempotency)
        // Если заказ уже оплачен, а пришел повторный вебхук с тем же статусом - игнорируем
        if (order.status === "paid" && (status === "succeeded" || status === "waiting_for_capture")) {
            console.log(`⚠️ Duplicate webhook for already paid order ${orderId}, ignoring`);
            return NextResponse.json({
                success: true,
                orderId,
                status: order.status,
                message: "Order already paid, webhook ignored (idempotency)",
            });
        }

        // Если заказ уже отменен, а пришел вебхук - игнорируем
        if (order.status === "cancelled" && status === "canceled") {
            console.log(`⚠️ Duplicate webhook for already cancelled order ${orderId}, ignoring`);
            return NextResponse.json({
                success: true,
                orderId,
                status: order.status,
                message: "Order already cancelled, webhook ignored (idempotency)",
            });
        }

        // Маппинг статусов
        const statusMap: Record<string, IOrder["status"]> = {
            // ЮKassa
            pending: "pending",
            waiting_for_capture: "pending",
            succeeded: "paid",
            canceled: "cancelled",
            refunded: "refunded",
        };

        const newStatus = statusMap[status] || "pending";

        // Обновляем статус только если он изменился
        if (order.status !== newStatus) {
            order.status = newStatus;
            order.metadata = {
                ...order.metadata,
                lastWebhookReceived: new Date().toISOString(),
                lastWebhookStatus: status,
            };
            await order.save();
            console.log(`✅ Order ${orderId} status updated: ${order.status} → ${newStatus}`);
        } else {
            console.log(`ℹ️ Order ${orderId} status unchanged: ${newStatus}`);
        }

        // Если оплата успешна - создаем чек и отправляем письма (фоновая задача)
        if (newStatus === "paid") {
            console.log(`💰 Payment succeeded for order ${orderId}. Scheduling emails...`);

            const orderData = order.toObject ? order.toObject() : {...order};

            runAfter(async () => {
                try {
                    // СОЗДАНИЕ ЧЕКА (54-ФЗ)
                    console.log("   📝 Creating receipt record...");

                    const receipt = await Receipt.create({
                        order: orderData._id,
                        user: orderData.user,
                        type: "payment",
                        status: "sent",
                        provider: "manual",
                        fiscalData: {
                            fiscalNumber: `CHK-${Date.now()}`,
                            fiscalSign: "TEMP",
                            fiscalDate: new Date(),
                            registrationNumber: "TEMP",
                            factoryNumber: "TEMP",
                        },
                        items: [{
                            name: orderData.serviceName,
                            quantity: 1,
                            price: orderData.price,
                            amount: orderData.price,
                            taxRate: "none",
                            paymentMethod: "full_payment",
                            paymentObject: "service",
                        }],
                        payment: [{
                            form: "electronic",
                            amount: orderData.price,
                        }],
                        total: orderData.price,
                        vatTotal: 0,
                        customer: {
                            email: orderData.client?.email,
                            phone: orderData.client?.phone,
                        },
                        sno: "npd",
                        sentAt: new Date(),
                    });

                    console.log(`   ✅ Receipt created: ${receipt._id}`);

                    // Обновляем заказ с receipt info
                    await Order.findByIdAndUpdate(orderData._id, {
                        "receipt.id": receipt._id.toString(),
                        "receipt.status": "sent",
                        "receipt.sentAt": new Date(),
                    });

                    // 1. Письмо админу
                    console.log("   📧 Sending admin notification...");
                    const adminResult = await sendAdminEmail({
                        subject: `✅ Заказ оплачен #${orderData._id.toString().slice(-6).toUpperCase()}`,
                        template: AdminNewOrderTemplate({
                            orderId: orderData._id.toString(),
                            clientName: `${orderData.client?.firstName || ''} ${orderData.client?.lastName || ''}`,
                            clientEmail: orderData.client?.email || '',
                            clientPhone: orderData.client?.phone || '',
                            serviceName: orderData.serviceName,
                            tariff: orderData.tariff,
                            price: orderData.price,
                            paymentMethod: orderData.paymentMethod || "yookassa",
                            orderDate: new Date().toISOString(),
                        }),
                        tags: [{name: "order_id", value: orderData._id.toString()}],
                    });
                    console.log(`   Admin email: ${adminResult.success ? '✅' : '❌'}`);

                    // 2. Чек клиенту
                    console.log("   📧 Sending receipt to client...");
                    const receiptResult = await sendEmail({
                        to: orderData.client?.email || '',
                        subject: "🧾 Чек об оплате — подтверждение",
                        template: ClientReceiptTemplate({
                            clientName: orderData.client?.firstName || 'Клиент',
                            orderId: orderData._id.toString(),
                            serviceName: orderData.serviceName,
                            tariff: orderData.tariff,
                            price: orderData.price,
                            paymentDate: new Date().toISOString(),
                            paymentMethod: orderData.paymentMethod || "yookassa",
                            fiscalNumber: receipt.fiscalData?.fiscalNumber,
                            fiscalSign: receipt.fiscalData?.fiscalSign,
                        }),
                        tags: [{name: "order_id", value: orderData._id.toString()}],
                    });
                    console.log(`   Client receipt: ${receiptResult.success ? '✅' : '❌'}`);

                    // 3. Welcome письмо
                    console.log("   📧 Sending welcome email...");
                    const welcomeResult = await sendEmail({
                        to: orderData.client?.email || '',
                        subject: "🎉 Добро пожаловать! Оплата подтверждена",
                        template: ClientWelcomeTemplate({
                            clientName: orderData.client?.firstName || 'Клиент',
                            serviceName: orderData.serviceName,
                            tariff: orderData.tariff,
                            orderDate: new Date().toISOString(),
                            nextStep: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard/orders/${orderData._id}`,
                        }),
                        tags: [{name: "order_id", value: orderData._id.toString()}],
                    });
                    console.log(`   Client welcome: ${welcomeResult.success ? '✅' : '❌'}`);

                } catch (error) {
                    console.error("❌ Failed to process payment emails:", error);
                }
            });
        }

        // Аудит изменения статуса заказа
        await createAuditLog({
            userId: order.user.toString(),
            action: "payment_created",
            entityType: "order",
            entityId: order._id.toString(),
            details: {
                previousStatus: order.status,
                newStatus,
                paymentProvider: eventType?.includes("yookassa") ? "yookassa" : "paykeeper",
            },
        });

        console.log(`✅ Order ${orderId} status updated to ${newStatus}`);

        return NextResponse.json({
            success: true,
            orderId,
            status: newStatus,
        });
    } catch (error) {
        console.error("❌ Payment webhook error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Webhook processing failed"
            },
            {status: 500}
        );
    }
}
