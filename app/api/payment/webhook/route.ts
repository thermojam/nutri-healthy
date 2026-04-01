import {NextRequest, NextResponse} from "next/server";
import {connectDB} from "@/lib/db/connect";
import {Order} from "@/lib/db/models/Order";
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
        const statusMap: Record<string, string> = {
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
            order.status = newStatus as any;
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

        // Если оплата успешна - создаем чек и отправляем письма
        if (newStatus === "paid") {
            console.log(`💰 Payment succeeded for order ${orderId}. Sending emails...`);
            
            try {
                // СОЗДАНИЕ ЧЕКА (54-ФЗ)
                // Примечание: Для реальной фискализации нужна интеграция с ОФД (Атол/Мой Налог)
                // Сейчас создаем запись в БД для учета
                
                console.log("   📝 Creating receipt record in database...");
                
                const receipt = await Receipt.create({
                    order: order._id,
                    user: order.user,
                    type: "payment",
                    status: "sent", // Сразу помечаем как отправленный
                    provider: "manual", // Временно без реальной фискализации
                    fiscalData: {
                        fiscalNumber: `CHK-${Date.now()}`, // Временный номер
                        fiscalSign: "TEMP", // Временно
                        fiscalDate: new Date(),
                        registrationNumber: "TEMP",
                        factoryNumber: "TEMP",
                    },
                    items: [{
                        name: order.serviceName,
                        quantity: 1,
                        price: order.price,
                        amount: order.price,
                        taxRate: "none",
                        paymentMethod: "full_payment",
                        paymentObject: "service",
                    }],
                    payment: [{
                        form: "electronic",
                        amount: order.price,
                    }],
                    total: order.price,
                    vatTotal: 0,
                    customer: {
                        email: order.client.email,
                        phone: order.client.phone,
                    },
                    sno: "npd",
                    sentAt: new Date(),
                });
                
                console.log(`   ✅ Receipt created: ${receipt._id}`);

                order.receipt = {
                    id: receipt._id.toString(),
                    status: "sent",
                    sentAt: new Date(),
                };
                await order.save();

                // Аудит
                await createAuditLog({
                    userId: order.user.toString(),
                    action: "receipt_generated",
                    entityType: "receipt",
                    entityId: receipt._id.toString(),
                    details: {
                        orderId: order._id.toString(),
                        receiptId: receipt._id.toString(),
                    },
                });

                // ОТПРАВКА ПИСЕМ ПОСЛЕ УСПЕШНОЙ ОПЛАТЫ
                
                // 1. Письмо админу об ОПЛАЧЕННОМ заказе
                console.log("   📧 Sending email to admin...");
                const adminResult = await sendAdminEmail({
                    subject: `✅ Заказ оплачен #${order._id.toString().slice(-6).toUpperCase()}`,
                    template: AdminNewOrderTemplate({
                        orderId: order._id.toString(),
                        clientName: `${order.client.firstName} ${order.client.lastName}`,
                        clientEmail: order.client.email,
                        clientPhone: order.client.phone,
                        serviceName: order.serviceName,
                        tariff: order.tariff,
                        price: order.price,
                        paymentMethod: order.paymentMethod || "yookassa",
                        orderDate: new Date().toISOString(),
                    }),
                    tags: [{name: "order_id", value: order._id.toString()}],
                });
                console.log(`   Admin email result: ${adminResult.success ? '✅' : '❌'} ${adminResult.id || adminResult.error}`);

                // 2. Письмо клиенту - чек об оплате (54-ФЗ)
                console.log("   📧 Sending receipt to client...");
                const receiptResult = await sendEmail({
                    to: order.client.email,
                    subject: "🧾 Чек об оплате",
                    template: ClientReceiptTemplate({
                        clientName: `${order.client.firstName} ${order.client.lastName}`,
                        orderId: order._id.toString(),
                        serviceName: order.serviceName,
                        tariff: order.tariff,
                        price: order.price,
                        paymentDate: new Date().toISOString(),
                        paymentMethod: order.paymentMethod || "yookassa",
                        fiscalNumber: receipt.fiscalData.fiscalNumber,
                        fiscalSign: receipt.fiscalData.fiscalSign,
                    }),
                    tags: [{name: "order_id", value: order._id.toString()}],
                });
                console.log(`   Client receipt result: ${receiptResult.success ? '✅' : '❌'} ${receiptResult.id || receiptResult.error}`);

                // 3. Письмо клиенту - Welcome с инструкциями
                console.log("   📧 Sending welcome to client...");
                const welcomeResult = await sendEmail({
                    to: order.client.email,
                    subject: "🎉 Добро пожаловать! Оплата подтверждена",
                    template: ClientWelcomeTemplate({
                        clientName: order.client.firstName,
                        serviceName: order.serviceName,
                        tariff: order.tariff,
                        orderDate: new Date().toISOString(),
                        nextStep: `${process.env.NEXT_PUBLIC_URL}/dashboard/orders/${order._id}`,
                    }),
                    tags: [{name: "order_id", value: order._id.toString()}],
                });
                console.log(`   Client welcome result: ${welcomeResult.success ? '✅' : '❌'} ${welcomeResult.id || welcomeResult.error}`);
            } catch (error) {
                console.error("❌ Failed to create receipt or send emails:", error);
                // Не прерываем процесс, если чек не создался
            }
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
