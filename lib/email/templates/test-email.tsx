/**
 * Test Email Template
 */

interface TestEmailTemplateProps {
    timestamp: string;
}

export function TestEmailTemplate({timestamp}: TestEmailTemplateProps) {
    return (
        <div style={{padding: "20px", fontFamily: "sans-serif"}}>
            <h1>🧪 Тестовое письмо</h1>
            <p>Если вы видите это письмо, значит email сервис работает!</p>
            <p><strong>Время отправки:</strong> {timestamp}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV || "development"}</p>
        </div>
    );
}
