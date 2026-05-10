import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {connectDB} from "@/lib/db/connect";
import {Consent} from "@/lib/db/models/Consent";
import {User} from "@/lib/db/models/User";
import {createAuditLog, getClientIP, getUserAgent} from "@/lib/db/audit";
import {withdrawConsentSchema} from "@/lib/validations";
import {metricsCollector} from "@/lib/metrics";

/**
 * POST /api/withdraw-consent
 * Отзыв согласия на обработку персональных данных (152-ФЗ ст. 9)
 *
 * Требования 152-ФЗ:
 * - Логирование отзыва с IP и User-Agent
 * - Обновление статуса согласия
 * - Аудит действия
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    try {
        const body = await request.json();

        // Валидация
        const validationResult = withdrawConsentSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Некорректные данные",
                    details: validationResult.error.issues
                },
                {status: 400}
            );
        }

        const {consentType, email} = validationResult.data;

        // Получение IP и User-Agent (152-ФЗ)
        const ipAddress = await getClientIP();
        const userAgent = await getUserAgent();
        const timestamp = new Date();

        await connectDB();

        // Поиск пользователя по email
        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Пользователь с таким email не найден"
                },
                {status: 404}
            );
        }

        // Обновление согласия в модели User
        if (consentType === "personal_data") {
            user.consents.personalData.withdrawn = true;
            user.consents.personalData.withdrawnAt = timestamp;
            await user.save();
        } else if (consentType === "marketing") {
            user.consents.marketing.withdrawn = true;
            user.consents.marketing.withdrawnAt = timestamp;
            await user.save();
        }

        // Создание записи об отзыве в Consent
        await Consent.create({
            user: user._id,
            type: consentType,
            given: false,
            givenAt: user.consents[consentType]?.givenAt || timestamp,
            withdrawn: true,
            withdrawnAt: timestamp,
            version: LEGAL_VERSIONS[consentType === "personal_data" ? "personalDataConsent" : "marketingConsent"],
            ipAddress,
            userAgent,
            metadata: {
                reason: "user_request",
                withdrawalIpAddress: ipAddress,
                withdrawalUserAgent: userAgent,
            },
        });

        // Аудит-лог (152-ФЗ требование)
        await createAuditLog({
            userId: user._id.toString(),
            action: "consent_withdrawn",
            entityType: "consent",
            entityId: user._id.toString(),
            details: {
                consentType,
                ipAddress,
                userAgent,
            },
        });

        // TODO: Отправка уведомления администратору об отзыве согласия
        // await sendEmail({
        //   to: process.env.EMAIL_TO,
        //   subject: "Отзыв согласия на обработку ПДн",
        //   body: `Пользователь ${email} отозвал согласие на ${consentType}`,
        // });

        const duration = Date.now() - startTime;
        metricsCollector.recordRequest('/api/withdraw-consent', 'POST', 200, duration);

        return NextResponse.json({
            success: true,
            message: "Согласие успешно отозвано",
            consentType,
            withdrawnAt: timestamp,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ Consent withdrawal error:", error);
        metricsCollector.recordRequest('/api/withdraw-consent', 'POST', 500, duration, 'Consent withdrawal error');

        return NextResponse.json(
            {
                success: false,
                error: "Внутренняя ошибка сервера"
            },
            {status: 500}
        );
    }
}

// LEGAL_VERSIONS helper
const LEGAL_VERSIONS = {
    personalDataConsent: process.env.PERSONAL_DATA_CONSENT_VERSION || "1.0",
    marketingConsent: process.env.MARKETING_CONSENT_VERSION || "1.0",
};
