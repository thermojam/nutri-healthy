/**
 * Resend Email Provider
 * 
 * Документация: https://resend.com/docs
 * 
 * Лучшие практики:
 * - server-after-nonblocking: after() для неотложных операций
 * - bundle-conditional: Ленивая загрузка тяжелых шаблонов
 */

import {Resend} from "resend";
import {render} from "@react-email/render";

// Инициализация Resend
const resend = new Resend(process.env.RESEND_API_KEY || "");

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    template: React.ReactNode;
    replyTo?: string;
    tags?: Array<{name: string; value: string}>;
}

/**
 * Отправить email через Resend
 */
export async function sendEmail({
    to,
    subject,
    template,
    replyTo,
    tags,
}: SendEmailOptions) {
    try {
        console.log(`📧 Sending email to ${Array.isArray(to) ? to.join(', ') : to}...`);
        console.log(`   Subject: ${subject}`);
        
        // Рендеринг React компонента в HTML
        const html = await render(template);
        
        console.log(`   HTML length: ${html.length} bytes`);

        const {data, error} = await resend.emails.send({
            from: process.env.EMAIL_FROM || "NutriHealthy <onboarding@resend.dev>",
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            replyTo,
            tags,
            headers: {
                "X-Entity-Ref-ID": new Date().getTime().toString(),
            },
        });

        if (error) {
            console.error("❌ Resend error:", error);
            throw new Error(error.message || "Resend API error");
        }

        console.log(`✅ Email sent successfully: ${data?.id}`);
        return {success: true, id: data?.id};
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Failed to send email:", errorMessage);
        console.error("   Stack:", error instanceof Error ? error.stack : "No stack");
        return {success: false, error: errorMessage};
    }
}

/**
 * Отправить email администратору
 */
export async function sendAdminEmail(options: Omit<SendEmailOptions, "to">) {
    const adminEmail = process.env.EMAIL_TO || "admin@localhost";
    
    // Отправляем письмо админу
    return await sendEmail({
        ...options,
        to: adminEmail,
        tags: [...(options.tags || []), {name: "type", value: "admin"}],
    });
}

// Экспорт для удобного использования
export const emailService = {
    send: sendEmail,
    sendAdmin: sendAdminEmail,
};
