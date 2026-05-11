import {render} from "@react-email/render";

const API_URL = (process.env.UNISENDER_GO_API_URL || "https://go1.unisender.ru/ru/transactional/api/v1").trimEnd();
const API_KEY = process.env.UNISENDER_GO_API_KEY || "";

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    template: React.ReactNode;
    replyTo?: string;
    tags?: Array<{name: string; value: string}>;
}

function parseFrom(from: string): {email: string; name: string} {
    const match = from.match(/^(.+)\s<([^>]+)>$/);
    if (match) return {name: match[1].trim(), email: match[2].trim()};
    return {name: "NutriHealthy", email: from};
}

export async function sendEmail({to, subject, template, replyTo, tags}: SendEmailOptions) {
    try {
        console.log(`📧 Sending email to ${Array.isArray(to) ? to.join(", ") : to}...`);
        console.log(`   Subject: ${subject}`);

        const html = await render(template);
        console.log(`   HTML length: ${html.length} bytes`);

        const fromRaw = process.env.EMAIL_FROM || "NutriHealthy <noreply@yoursite.ru>";
        const {name: fromName, email: fromEmail} = parseFrom(fromRaw);

        const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({email}));

        const payload: Record<string, unknown> = {
            message: {
                recipients,
                from_email: fromEmail,
                from_name: fromName,
                subject,
                body: {html},
                headers: {"X-Ref-ID": Date.now().toString()},
                ...(tags?.length && {tags: tags.map((t) => `${t.name}:${t.value}`)}),
                ...(replyTo && {reply_to: replyTo}),
            },
        };

        const response = await fetch(`${API_URL}/email/send.json`, {
            method: "POST",
            headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json() as {status: string; job_id?: string; code?: number; message?: string};

        if (result.status === "error") {
            throw new Error(`Unisender Go ${result.code}: ${result.message}`);
        }

        console.log(`✅ Email sent successfully: ${result.job_id}`);
        return {success: true, id: result.job_id};
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Failed to send email:", errorMessage);
        return {success: false, error: errorMessage};
    }
}

export async function sendAdminEmail(options: Omit<SendEmailOptions, "to">) {
    const adminEmail = process.env.EMAIL_TO || "admin@localhost";
    return sendEmail({
        ...options,
        to: adminEmail,
        tags: [...(options.tags || []), {name: "type", value: "admin"}],
    });
}

export const emailService = {
    send: sendEmail,
    sendAdmin: sendAdminEmail,
};
