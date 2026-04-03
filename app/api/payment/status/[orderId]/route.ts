import {NextRequest, NextResponse} from "next/server";
import {connectDB} from "@/lib/db/connect";
import {Order} from "@/lib/db/models/Order";
import {yookassaService} from "@/lib/payments/yookassa";

/**
 * GET /api/payment/status/[orderId]
 * Проверка актуального статуса заказа
 * 
 * Логика:
 * 1. Получаем заказ из БД
 * 2. Если статус pending и есть paymentId — проверяем напрямую в YooKassa
 * 3. Если YooKassa подтвердила оплату — обновляем БД
 * 4. Возвращаем актуальный статус
 */
export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{orderId: string}>}
) {
    try {
        const {orderId} = await params;

        if (!orderId) {
            return NextResponse.json(
                {success: false, error: "orderId обязателен"},
                {status: 400}
            );
        }

        await connectDB();

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                {success: false, error: "Заказ не найден"},
                {status: 404}
            );
        }

        // Если заказ уже оплачен — сразу возвращаем
        if (order.status === "paid") {
            return NextResponse.json({
                success: true,
                order: {
                    id: order._id.toString(),
                    status: order.status,
                    serviceName: order.serviceName,
                    tariff: order.tariff,
                    price: order.price,
                    client: {
                        firstName: order.client.firstName,
                        lastName: order.client.lastName,
                        email: order.client.email,
                    },
                },
            });
        }

        // Если pending и есть paymentId — проверяем в YooKassa
        if (order.status === "pending" && order.paymentId) {
            try {
                const paymentInfo = await yookassaService.getPayment(order.paymentId);

                // Если YooKassa подтвердила оплату — обновляем БД
                if (paymentInfo.status === "succeeded" || paymentInfo.status === "waiting_for_capture") {
                    order.status = "paid";
                    order.metadata = {
                        ...order.metadata,
                        lastCheckedAt: new Date().toISOString(),
                        paymentStatusFromYookassa: paymentInfo.status,
                    };
                    await order.save();

                    console.log(`✅ Order ${orderId} status updated to paid via polling`);

                    return NextResponse.json({
                        success: true,
                        order: {
                            id: order._id.toString(),
                            status: "paid",
                            serviceName: order.serviceName,
                            tariff: order.tariff,
                            price: order.price,
                            client: {
                                firstName: order.client.firstName,
                                lastName: order.client.lastName,
                                email: order.client.email,
                            },
                            paymentInfo: {
                                status: paymentInfo.status,
                                amount: paymentInfo.amount,
                                createdAt: paymentInfo.created_at,
                            },
                        },
                    });
                }

                // Если YooKassa отменила — обновляем
                if (paymentInfo.status === "canceled") {
                    order.status = "cancelled";
                    order.metadata = {
                        ...order.metadata,
                        lastCheckedAt: new Date().toISOString(),
                        paymentStatusFromYookassa: paymentInfo.status,
                    };
                    await order.save();

                    return NextResponse.json({
                        success: true,
                        order: {
                            id: order._id.toString(),
                            status: "cancelled",
                            serviceName: order.serviceName,
                            tariff: order.tariff,
                            price: order.price,
                        },
                    });
                }
            } catch (yooError) {
                console.warn(`⚠️ Could not check payment ${order.paymentId} with YooKassa:`, yooError);
                // Не прерываем — возвращаем текущий статус из БД
            }
        }

        // Возвращаем текущий статус из БД
        return NextResponse.json({
            success: true,
            order: {
                id: order._id.toString(),
                status: order.status,
                serviceName: order.serviceName,
                tariff: order.tariff,
                price: order.price,
                paymentMethod: order.paymentMethod,
                paymentId: order.paymentId,
            },
        });
    } catch (error) {
        console.error("❌ Payment status check error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось проверить статус оплаты"
            },
            {status: 500}
        );
    }
}
