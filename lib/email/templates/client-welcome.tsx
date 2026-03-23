/**
 * Client: Приветственное письмо
 * 
 * Отправляется клиенту после успешной оплаты
 */

import {EmailTemplate, EmailButton, EmailDivider} from "./base";

interface ClientWelcomeTemplateProps {
    clientName: string;
    serviceName: string;
    tariff: "base" | "premium" | "vip";
    orderDate: string;
    nextStep?: string;
}

export function ClientWelcomeTemplate({
    clientName,
    serviceName,
    tariff,
    orderDate,
    nextStep,
}: ClientWelcomeTemplateProps) {
    const tariffLabels = {
        base: "Базовый",
        premium: "Оптимальный",
        vip: "VIP",
    };

    return (
        <EmailTemplate title="🎉 Добро пожаловать!">
            {/* Приветствие */}
            <div style={{textAlign: "center", marginBottom: "24px"}}>
                <div style={{fontSize: "48px", marginBottom: "16px"}}>👋</div>
                <h2 style={{fontSize: "24px", fontWeight: "bold", marginBottom: "8px"}}>
                    Здравствуйте, {clientName}!
                </h2>
                <p style={{fontSize: "16px", color: "#6b7280"}}>
                    Спасибо за заказ! Мы рады начать работу с вами.
                </p>
            </div>

            {/* Подтверждение заказа */}
            <div style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #16a34a",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "24px",
            }}>
                <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px"}}>
                    <div style={{fontSize: "24px"}}>✅</div>
                    <div>
                        <p style={{margin: 0, fontWeight: "600", color: "#16a34a"}}>
                            Оплата подтверждена
                        </p>
                        <p style={{margin: 0, fontSize: "14px", color: "#6b7280"}}>
                            {orderDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Информация об услуге */}
            <div>
                <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                    📦 Ваша услуга
                </h3>
                <div style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px",
                }}>
                    <p style={{margin: "0 0 8px 0", fontWeight: "600"}}>{serviceName}</p>
                    <p style={{margin: 0, fontSize: "14px", color: "#6b7280"}}>
                        Тариф: <strong>{tariffLabels[tariff]}</strong>
                    </p>
                </div>
            </div>

            <EmailDivider />

            {/* Что дальше */}
            <div>
                <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "12px"}}>
                    📋 Что дальше?
                </h3>
                <ol style={{fontSize: "14px", lineHeight: 1.8, paddingLeft: "20px"}}>
                    <li style={{marginBottom: "8px"}}>
                        <strong>В течение 24 часов</strong> я свяжусь с вами для уточнения деталей
                    </li>
                    <li style={{marginBottom: "8px"}}>
                        <strong>Перед консультацией</strong> нужно будет заполнить небольшую анкету
                    </li>
                    <li style={{marginBottom: "8px"}}>
                        <strong>В день консультации</strong> вы получите ссылку на видеозвонок
                    </li>
                </ol>
            </div>

            {/* Следующий шаг */}
            {nextStep && (
                <div style={{textAlign: "center", marginTop: "24px"}}>
                    <EmailButton href={nextStep}>
                        Заполнить анкету
                    </EmailButton>
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
                <p style={{margin: "0 0 8px 0", fontWeight: "600"}}>📞 Контакты</p>
                <p style={{margin: "4px 0"}}>
                    Если у вас возникнут вопросы, напишите мне:
                </p>
                <p style={{margin: "4px 0"}}>
                    📧 <a href="mailto:info@yoursite.ru" style={{color: "#16a34a"}}>info@yoursite.ru</a>
                </p>
                <p style={{margin: "4px 0"}}>
                    💬 <a href="https://t.me/username" style={{color: "#16a34a"}}>Telegram</a>
                </p>
            </div>

            {/* Пожелание */}
            <div style={{
                textAlign: "center",
                marginTop: "24px",
                padding: "16px",
                backgroundColor: "#fef3c7",
                borderRadius: "8px",
            }}>
                <p style={{margin: 0, fontSize: "14px"}}>
                    <strong>🌟 Желаю вам успехов на пути к здоровью!</strong>
                </p>
            </div>
        </EmailTemplate>
    );
}
