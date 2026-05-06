import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {sendEmail, sendAdminEmail} from "@/lib/email/resend";
import {AdminNewOrderTemplate, AdminNewOrderTemplateProps} from "@/lib/email/templates/admin-new-order";
import {ClientWelcomeTemplate, ClientWelcomeTemplateProps} from "@/lib/email/templates/client-welcome";
import {ClientOrderConfirmTemplate, ClientOrderConfirmTemplateProps} from "@/lib/email/templates/client-order-confirm";
import {ClientReceiptTemplate, ClientReceiptTemplateProps} from "@/lib/email/templates/client-receipt";
import {TestEmailTemplate} from "@/lib/email/templates/test-email";

/**
 * Схема валидации
 */
const emailSchema = z.object({
    type: z.enum([
        "admin-new-order",
        "client-welcome",
        "client-order-confirm",
        "client-receipt",
        "test",
    ]),
    to: z.string().email().optional(),
    data: z.object({}).passthrough().optional().default({}),
});

/**
 * POST /api/email/send
 * Отправка email
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = emailSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Некорректные данные",
                    details: result.error.issues,
                },
                {status: 400}
            );
        }

        const {type, to, data} = result.data;

        // Выбор шаблона
        let template: React.ReactNode;
        let subject: string;
        let recipient: string;

        switch (type) {
            case "admin-new-order":
                template = AdminNewOrderTemplate(data as unknown as AdminNewOrderTemplateProps);
                subject = `🛒 Новый заказ #${(data.orderId as string)?.slice(-6).toUpperCase()}`;
                recipient = process.env.EMAIL_TO || "admin@localhost";
                break;

            case "client-welcome":
                template = ClientWelcomeTemplate(data as unknown as ClientWelcomeTemplateProps);
                subject = "🎉 Добро пожаловать! Оплата подтверждена";
                recipient = to || (data.clientEmail as string);
                break;

            case "client-order-confirm":
                template = ClientOrderConfirmTemplate(data as unknown as ClientOrderConfirmTemplateProps);
                subject = "📦 Подтверждение заказа";
                recipient = to || (data.clientEmail as string);
                break;

            case "client-receipt":
                template = ClientReceiptTemplate(data as unknown as ClientReceiptTemplateProps);
                subject = "🧾 Чек об оплате";
                recipient = to || (data.clientEmail as string);
                break;

            case "test":
                template = TestEmailTemplate({timestamp: new Date().toLocaleString("ru-RU")});
                subject = "🧪 Тестовое письмо";
                recipient = to || process.env.EMAIL_TO || "test@localhost";
                break;

            default:
                throw new Error("Unknown email type");
        }

        // Отправка
        const emailResult = await sendEmail({
            to: recipient,
            subject,
            template,
            tags: [
                {name: "type", value: type},
                {name: "environment", value: process.env.NODE_ENV || "development"},
            ],
        });

        if (!emailResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: emailResult.error,
                },
                {status: 500}
            );
        }

        return NextResponse.json({
            success: true,
            message: "Email отправлен",
            emailId: emailResult.id,
            recipient,
        });
    } catch (error) {
        console.error("❌ Email send error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal error",
            },
            {status: 500}
        );
    }
}

/**
 * GET /api/email/send
 * Тестовый запрос
 */
export async function GET() {
    return NextResponse.json({
        success: true,
        message: "Email service is running",
        templates: [
            "admin-new-order",
            "client-welcome",
            "client-order-confirm",
            "client-receipt",
            "test",
        ],
    });
}
