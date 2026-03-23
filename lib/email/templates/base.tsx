/**
 * Base Email Template
 * 
 * Лучшие практики:
 * - rendering-hoist-jsx: Статические стили вынесены
 * - server-serialization: Минимум данных в props
 */

interface EmailTemplateProps {
    children: React.ReactNode;
    title?: string;
    footer?: React.ReactNode;
}

// Стили вынесены для производительности
const CONTAINER_STYLES = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: "#f9fafb",
    padding: "40px 20px",
} as const;

const CONTENT_STYLES = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
} as const;

const HEADER_STYLES = {
    backgroundColor: "#16a34a", // primary green
    padding: "32px 24px",
    textAlign: "center" as const,
    color: "#ffffff",
} as const;

const BODY_STYLES = {
    padding: "32px 24px",
    color: "#1f2937",
    lineHeight: 1.6 as const,
} as const;

const FOOTER_STYLES = {
    backgroundColor: "#f3f4f6",
    padding: "24px",
    textAlign: "center" as const,
    fontSize: "14px",
    color: "#6b7280",
} as const;

const LOGO_STYLES = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "12px",
} as const;

/**
 * Базовый шаблон для всех email
 */
export function EmailTemplate({
    children,
    title,
    footer,
}: EmailTemplateProps) {
    return (
        <div style={CONTAINER_STYLES}>
            <div style={CONTENT_STYLES}>
                {/* Header с логотипом */}
                <div style={HEADER_STYLES}>
                    <div style={LOGO_STYLES}>🌿</div>
                    {title && (
                        <h1 style={{
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: "bold",
                        }}>
                            {title}
                        </h1>
                    )}
                </div>

                {/* Основной контент */}
                <div style={BODY_STYLES}>
                    {children}
                </div>

                {/* Footer */}
                <div style={FOOTER_STYLES}>
                    {footer || (
                        <div>
                            <p style={{margin: "0 0 8px 0"}}>
                                <strong>NutriHealthy</strong>
                            </p>
                            <p style={{margin: 0, fontSize: "12px"}}>
                                Индивидуальные консультации по нутрициологии и health-коучингу
                            </p>
                            <p style={{margin: "8px 0 0 0", fontSize: "12px"}}>
                                <a href="mailto:info@yoursite.ru" style={{color: "#16a34a", textDecoration: "none"}}>
                                    info@yoursite.ru
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Кнопка для email
 */
export function EmailButton({
    href,
    children,
    primary = true,
}: {
    href: string;
    children: React.ReactNode;
    primary?: boolean;
}) {
    return (
        <a
            href={href}
            style={{
                display: "inline-block",
                backgroundColor: primary ? "#16a34a" : "#ffffff",
                color: primary ? "#ffffff" : "#16a34a",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                margin: "16px 0",
                border: primary ? "none" : "2px solid #16a34a",
            }}
        >
            {children}
        </a>
    );
}

/**
 * Divider для email
 */
export function EmailDivider() {
    return (
        <div style={{
            height: "1px",
            backgroundColor: "#e5e7eb",
            margin: "24px 0",
        }} />
    );
}

/**
 * Секция с иконкой
 */
export function EmailSection({
    icon,
    title,
    children,
}: {
    icon?: string;
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            margin: "16px 0",
        }}>
            {icon && (
                <div style={{fontSize: "24px", marginBottom: "8px"}}>{icon}</div>
            )}
            {title && (
                <h3 style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                }}>
                    {title}
                </h3>
            )}
            <div style={{fontSize: "14px", lineHeight: 1.5}}>
                {children}
            </div>
        </div>
    );
}
