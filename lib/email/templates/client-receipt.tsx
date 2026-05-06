/**
 * Client: Чек об оплате (54-ФЗ)
 * 
 * Отправляется клиенту после успешной оплаты
 */

import {EmailTemplate, EmailDivider} from "./base";

export interface ClientReceiptTemplateProps {
    clientName: string;
    orderId: string;
    serviceName: string;
    tariff: "base" | "premium" | "vip";
    price: number;
    paymentDate: string;
    paymentMethod: string;
    fiscalNumber?: string;
    fiscalSign?: string;
    receiptUrl?: string;
}

export function ClientReceiptTemplate({
    clientName,
    orderId,
    serviceName,
    tariff,
    price,
    paymentDate,
    paymentMethod,
    fiscalNumber,
    fiscalSign,
    receiptUrl,
}: ClientReceiptTemplateProps) {
    const tariffLabels = {
        base: "Базовый",
        premium: "Оптимальный",
        vip: "VIP",
    };

    return (
        <EmailTemplate title="🧾 Чек об оплате">
            {/* Подтверждение */}
            <div style={{textAlign: "center", marginBottom: "24px"}}>
                <div style={{fontSize: "48px", marginBottom: "16px"}}>✅</div>
                <h2 style={{fontSize: "24px", fontWeight: "bold", marginBottom: "8px"}}>
                    Оплата подтверждена
                </h2>
                <p style={{fontSize: "16px", color: "#6b7280"}}>
                    Ваш чек об оплате
                </p>
            </div>

            {/* Информация о платеже */}
            <div>
                <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                    💳 Детали платежа
                </h3>
                <div style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #16a34a",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px",
                }}>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                        <div>
                            <p style={{margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280"}}>
                                Сумма
                            </p>
                            <p style={{margin: 0, fontSize: "20px", fontWeight: "bold", color: "#16a34a"}}>
                                {price.toLocaleString("ru-RU")} ₽
                            </p>
                        </div>
                        <div>
                            <p style={{margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280"}}>
                                Дата оплаты
                            </p>
                            <p style={{margin: 0, fontSize: "14px"}}>
                                {new Date(paymentDate).toLocaleDateString("ru-RU")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Информация об услуге */}
            <div>
                <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                    📦 Услуга
                </h3>
                <div style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px",
                }}>
                    <p style={{margin: "0 0 8px 0", fontWeight: "600"}}>{serviceName}</p>
                    <p style={{margin: 0, fontSize: "14px", color: "#6b7280"}}>
                        Тариф: {tariffLabels[tariff]}
                    </p>
                </div>
            </div>

            <EmailDivider />

            {/* Фискальные данные (54-ФЗ) */}
            {(fiscalNumber || fiscalSign) && (
                <div>
                    <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                        📋 Фискальные данные
                    </h3>
                    <div style={{fontSize: "12px", color: "#6b7280", lineHeight: 1.8}}>
                        {fiscalNumber && (
                            <p style={{margin: "4px 0"}}>
                                <strong>Фискальный номер:</strong> {fiscalNumber}
                            </p>
                        )}
                        {fiscalSign && (
                            <p style={{margin: "4px 0"}}>
                                <strong>Фискальный признак:</strong> {fiscalSign}
                            </p>
                        )}
                        <p style={{margin: "4px 0"}}>
                            <strong>Дата фискализации:</strong> {new Date(paymentDate).toLocaleString("ru-RU")}
                        </p>
                    </div>
                </div>
            )}

            {/* Ссылка на чек */}
            {receiptUrl && (
                <div style={{textAlign: "center", marginTop: "24px"}}>
                    <a
                        href={receiptUrl}
                        style={{
                            display: "inline-block",
                            color: "#16a34a",
                            textDecoration: "underline",
                            fontSize: "14px",
                        }}
                    >
                        📄 Скачать чек в формате PDF
                    </a>
                </div>
            )}

            {/* Примечание */}
            <div style={{
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "24px",
                fontSize: "12px",
                color: "#6b7280",
            }}>
                <p style={{margin: 0}}>
                    <strong>ℹ️ Информация:</strong> Этот чек является официальным документом, 
                    подтверждающим оплату. Сохраните его для своих записей.
                </p>
                <p style={{margin: "8px 0 0 0"}}>
                    Чек сформирован автоматически в соответствии с 54-ФЗ.
                </p>
            </div>
        </EmailTemplate>
    );
}
