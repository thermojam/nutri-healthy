/**
 * Admin: Новый заказ
 * 
 * Отправляется администратору при создании нового заказа
 */

import {EmailTemplate, EmailButton, EmailDivider} from "./base";

export interface AdminNewOrderTemplateProps {
    orderId: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    serviceName: string;
    tariff: "base" | "premium" | "vip";
    price: number;
    paymentMethod?: string;
    orderDate: string;
}

export function AdminNewOrderTemplate({
    orderId,
    clientName,
    clientEmail,
    clientPhone,
    serviceName,
    tariff,
    price,
    paymentMethod,
    orderDate,
}: AdminNewOrderTemplateProps) {
    const tariffLabels = {
        base: "Базовый",
        premium: "Оптимальный",
        vip: "VIP",
    };

    return (
        <EmailTemplate title="🛒 Новый заказ">
            {/* Основная информация */}
            <div>
                <p style={{fontSize: "16px", marginBottom: "16px"}}>
                    Поступил новый заказ на консультацию!
                </p>

                <div style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #16a34a",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "24px",
                }}>
                    <p style={{margin: "0 0 8px 0", fontWeight: "600", color: "#16a34a"}}>
                        ✅ Заказ #{orderId.slice(-6).toUpperCase()}
                    </p>
                    <p style={{margin: 0, fontSize: "14px", color: "#6b7280"}}>
                        {orderDate}
                    </p>
                </div>
            </div>

            {/* Информация о клиенте */}
            <div>
                <h2 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                    👤 Информация о клиенте
                </h2>
                <div style={{fontSize: "14px", lineHeight: 1.8}}>
                    <p style={{margin: "4px 0"}}><strong>ФИО:</strong> {clientName}</p>
                    <p style={{margin: "4px 0"}}><strong>Email:</strong> <a href={`mailto:${clientEmail}`} style={{color: "#16a34a"}}>{clientEmail}</a></p>
                    {clientPhone && (
                        <p style={{margin: "4px 0"}}><strong>Телефон:</strong> {clientPhone}</p>
                    )}
                </div>
            </div>

            <EmailDivider />

            {/* Информация о заказе */}
            <div>
                <h2 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                    📦 Информация о заказе
                </h2>
                <div style={{fontSize: "14px", lineHeight: 1.8}}>
                    <p style={{margin: "4px 0"}}><strong>Услуга:</strong> {serviceName}</p>
                    <p style={{margin: "4px 0"}}><strong>Тариф:</strong> {tariffLabels[tariff]}</p>
                    <p style={{margin: "4px 0"}}><strong>Сумма:</strong> <strong style={{color: "#16a34a"}}>{price.toLocaleString("ru-RU")} ₽</strong></p>
                    {paymentMethod && (
                        <p style={{margin: "4px 0"}}><strong>Способ оплаты:</strong> {paymentMethod}</p>
                    )}
                </div>
            </div>

            {/* Действия */}
            <div style={{textAlign: "center", marginTop: "24px"}}>
                <EmailButton href={`${process.env.NEXT_PUBLIC_URL}/dashboard/orders/${orderId}`}>
                    Перейти к заказу
                </EmailButton>
            </div>

            {/* Примечание */}
            <div style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "24px",
                fontSize: "14px",
            }}>
                <p style={{margin: 0}}>
                    <strong>⚠️ Важно:</strong> Свяжитесь с клиентом в течение 24 часов для подтверждения заказа.
                </p>
            </div>
        </EmailTemplate>
    );
}
