import {NextRequest, NextResponse} from "next/server";
import {connectDB} from "@/lib/db/connect";
import {Order} from "@/lib/db/models/Order";
import {Receipt} from "@/lib/db/models/Receipt";
import {createAuditLog} from "@/lib/db/audit";
import {yookassaService} from "@/lib/payments/yookassa";
import {cloudpaymentsService} from "@/lib/payments/cloudpayments";
import {receiptService} from "@/lib/payments/receipts";

/**
 * POST /api/payment/webhook
 * Обработка webhook от платежных систем (ЮKassa, CloudPayments)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const eventType = request.headers.get("x-event-type") || body.type || body.Event;

        console.log(`💳 Payment webhook received: ${eventType}`);

        await connectDB();

        let orderId: string;
        let status: string;

        // Определение провайдера и обработка
        if (eventType?.includes("yookassa") || body.object?.metadata?.order_id) {
            // ЮKassa
            const result = await yookassaService.handleWebhook(body);
            orderId = result.orderId;
            status = result.status;
        } else if (eventType?.includes("cloudpayments") || body.Type) {
            // CloudPayments
            const result = await cloudpaymentsService.handleWebhook(body);
            orderId = result.orderId;
            status = result.status;
        } else {
            return NextResponse.json(
                {success: false, error: "Unknown webhook type"},
                {status: 400}
            );
        }

        // Обновление статуса заказа
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                {success: false, error: "Order not found"},
                {status: 404}
            );
        }

        // Маппинг статусов
        const statusMap: Record<string, string> = {
            // ЮKassa
            pending: "pending",
            waiting_for_capture: "pending",
            succeeded: "paid",
            canceled: "cancelled",
            refunded: "refunded",
            // CloudPayments
            Completed: "paid",
            Rejected: "cancelled",
            Refunded: "refunded",
        };

        const newStatus = statusMap[status] || "pending";

        order.status = newStatus as any;
        await order.save();

        // Если оплата успешна - создаем чек
        if (newStatus === "paid") {
            try {
                // Создание чека (54-ФЗ)
                const receiptData = {
                    orderId: order._id.toString(),
                    userId: order.user.toString(),
                    type: "payment" as const,
                    items: [{
                        name: order.serviceName,
                        quantity: 1,
                        price: order.price,
                        amount: order.price,
                        taxRate: "none" as const,
                        paymentMethod: "full_payment" as const,
                        paymentObject: "service" as const,
                    }],
                    total: order.price,
                    customer: {
                        email: order.client.email,
                        phone: order.client.phone,
                    },
                };

                const receiptResponse = await receiptService.createReceipt(receiptData);

                // Сохранение информации о чеке
                const receipt = await Receipt.create({
                    order: order._id,
                    user: order.user,
                    type: "payment",
                    status: "pending",
                    provider: "atol",
                    fiscalData: {},
                    items: receiptData.items,
                    payment: [{
                        form: "electronic",
                        amount: order.price,
                    }],
                    total: order.price,
                    vatTotal: 0,
                    customer: receiptData.customer,
                    sno: "npd",
                });

                order.receipt = {
                    id: receiptResponse.uuid,
                    status: "pending",
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
                        receiptId: receiptResponse.uuid,
                    },
                });
            } catch (error) {
                console.error("❌ Failed to create receipt:", error);
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
                paymentProvider: eventType?.includes("yookassa") ? "yookassa" : "cloudpayments",
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
