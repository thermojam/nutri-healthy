/**
 * Client: Подтверждение заказа
 * 
 * Отправляется клиенту сразу после создания заказа (до оплаты)
 */

import {EmailTemplate, EmailButton, EmailDivider} from "./base";

interface ClientOrderConfirmTemplateProps {
    clientName: string;
    orderId: string;
    serviceName: string;
    tariff: "base" | "premium" | "vip";
    price: number;
    paymentUrl?: string;
    orderDate: string;
}

export function ClientOrderConfirmTemplate({
    clientName,
    orderId,
    serviceName,
    tariff,
    price,
    paymentUrl,
    orderDate,
}: ClientOrderConfirmTemplateProps) {
    const tariffLabels = {
        base: "Базовый",
        premium: "Оптимальный",
        vip: "VIP",
    };

    return (
        <EmailTemplate title="📦 Подтверждение заказа">
            {/* Приветствие */}
            <div style={{textAlign: "center", marginBottom: "24px"}}>
                <div style={{fontSize: "48px", marginBottom: "16px"}}>👋</div>
                <h2 style={{fontSize: "24px", fontWeight: "bold", marginBottom: "8px"}}>
                    Здравствуйте, {clientName}!
                </h2>
                <p style={{fontSize: "16px", color: "#6b7280"}}>
                    Ваш заказ создан и ожидает оплаты
                </p>
            </div>

            {/* Информация о заказе */}
            <div>
                <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                    📋 Детали заказа
                </h3>
                <div style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px",
                }}>
                    <p style={{margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280"}}>
                        Заказ #{orderId.slice(-6).toUpperCase()}
                    </p>
                    <p style={{margin: "0 0 8px 0", fontWeight: "600"}}>{serviceName}</p>
                    <p style={{margin: "0 0 8px 0", fontSize: "14px"}}>
                        Тариф: <strong>{tariffLabels[tariff]}</strong>
                    </p>
                    <p style={{margin: 0, fontSize: "14px"}}>
                        Сумма: <strong style={{color: "#16a34a"}}>{price.toLocaleString("ru-RU")} ₽</strong>
                    </p>
                </div>
            </div>

            <EmailDivider />

            {/* Оплата */}
            {paymentUrl ? (
                <>
                    <div style={{textAlign: "center", marginBottom: "24px"}}>
                        <p style={{fontSize: "16px", marginBottom: "16px"}}>
                            Для подтверждения заказа необходимо произвести оплату
                        </p>
                        <EmailButton href={paymentUrl}>
                            💳 Оплатить заказ
                        </EmailButton>
                    </div>

                    <div style={{
                        backgroundColor: "#fef3c7",
                        border: "1px solid #f59e0b",
                        borderRadius: "8px",
                        padding: "16px",
                        fontSize: "14px",
                    }}>
                        <p style={{margin: 0}}>
                            <strong>⏰ Важно:</strong> Заказ будет зарезервирован в течение 24 часов. 
                            После этого срок действия заказа истечет.
                        </p>
                    </div>
                </>
            ) : (
                <div style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #16a34a",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center",
                }}>
                    <p style={{margin: 0, color: "#16a34a"}}>
                        <strong>✅ Оплата не требуется</strong>
                    </p>
                    <p style={{margin: "8px 0 0 0", fontSize: "14px"}}>
                        Я свяжусь с вами в ближайшее время для уточнения деталей
                    </p>
                </div>
            )}

            {/* Контакты */}
            <div style={{
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "24px",
                fontSize: "14px",
            }}>
                <p style={{margin: "0 0 8px 0", fontWeight: "600"}}>❓ Вопросы?</p>
                <p style={{margin: "4px 0"}}>
                    Если у вас возникли вопросы или проблемы с оплатой, напишите мне:
                </p>
                <p style={{margin: "4px 0"}}>
                    📧 <a href="mailto:info@yoursite.ru" style={{color: "#16a34a"}}>info@yoursite.ru</a>
                </p>
                <p style={{margin: "4px 0"}}>
                    💬 <a href="https://t.me/username" style={{color: "#16a34a"}}>Telegram</a>
                </p>
            </div>
        </EmailTemplate>
    );
}
