import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {connectDB} from "@/lib/db/connect";
import {User} from "@/lib/db/models/User";
import {Consent} from "@/lib/db/models/Consent";
import {createAuditLog, getClientIP, getUserAgent} from "@/lib/db/audit";
import {contactFormSchema, LEGAL_VERSIONS} from "@/lib/validations";

/**
 * Нормализация номера телефона
 */
function normalizePhone(phone?: string): string | undefined {
    if (!phone) return undefined;
    const trimmed = phone.trim();
    if (!trimmed || /^[\s()\-_]+$/.test(trimmed)) return undefined;
    const cleaned = trimmed.replace(/[^\d+]/g, "");
    const normalized = cleaned.replace(/^8/, "+7");
    if (normalized.startsWith("7") && !normalized.startsWith("+")) {
        return "+" + normalized;
    }
    return normalized;
}

/**
 * POST /api/send-form
 * Обработка формы обратной связи (лид-магнит)
 *
 * Требования 152-ФЗ:
 * - Логирование IP адреса
 * - Логирование User-Agent
 * - Фиксация времени согласия
 * - Сохранение версии документов
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Валидация данных формы
        const validationResult = contactFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Некорректные данные формы",
                    details: validationResult.error.issues
                },
                {status: 400}
            );
        }

        const {
            firstName,
            lastName,
            patronymic,
            email,
            phone,
            personalDataConsent,
            contractAcceptance,
            marketingConsent,
        } = validationResult.data;

        // marketingChannels может приходить отдельно, т.к. не в схеме валидации
        const marketingChannels = body.marketingChannels || [];

        // Нормализация телефона
        const normalizedPhone = normalizePhone(phone);

        // Получение IP и User-Agent для логирования (152-ФЗ)
        const ipAddress = await getClientIP();
        const userAgent = await getUserAgent();
        const timestamp = new Date();

        // Подключение к MongoDB
        await connectDB();

        // Миграция: удаляем старый индекс phone_1 если он существует
        try {
            const indexes = await User.collection.indexes();
            const phoneIndex = indexes.find(
                (idx: any) => idx.key && idx.key.phone && !idx.unique
            );
            if (phoneIndex) {
                await User.collection.dropIndex("phone_1");
                console.log("✅ send-form: Удалён старый индекс phone_1");
            }
        } catch (e) {
            // Индекс может уже не существовать — игнорируем
        }

        // Проверка существующего пользователя
        let user = await User.findOne({email});

        if (user) {
            // Обновление существующего пользователя
            user.firstName = firstName;
            user.lastName = lastName;
            user.patronymic = patronymic || user.patronymic;
            if (normalizedPhone) {
                user.phone = normalizedPhone;
            }
            await user.save();
        } else {
            // Создание нового пользователя — телефон только если заполнен
            user = await User.create({
                email,
                phone: normalizedPhone || undefined,
                firstName,
                lastName,
                patronymic,
                consents: {
                    personalData: {
                        given: personalDataConsent,
                        givenAt: timestamp,
                        ipAddress,
                        userAgent,
                    },
                    marketing: {
                        given: marketingConsent || false,
                        givenAt: marketingConsent ? timestamp : undefined,
                        channels: marketingConsent ? (marketingChannels.length > 0 ? marketingChannels : ["email"]) : [],
                    },
                    contract: {
                        given: contractAcceptance,
                        givenAt: timestamp,
                        version: LEGAL_VERSIONS.contract,
                        ipAddress,
                    },
                },
            });
        }

        // Создание записей согласий (отдельная коллекция для аудита)
        if (personalDataConsent) {
            await Consent.create({
                user: user._id,
                type: "personal_data",
                given: true,
                givenAt: timestamp,
                version: LEGAL_VERSIONS.personalDataConsent,
                ipAddress,
                userAgent,
                documentUrl: "/legal/personal-data-consent",
            });

            // Аудит-лог (152-ФЗ требование)
            await createAuditLog({
                userId: user._id.toString(),
                action: "consent_given",
                entityType: "consent",
                entityId: user._id.toString(),
                details: {
                    consentType: "personal_data",
                    version: LEGAL_VERSIONS.personalDataConsent,
                    ipAddress,
                    userAgent,
                },
            });
        }

        if (contractAcceptance) {
            await Consent.create({
                user: user._id,
                type: "contract",
                given: true,
                givenAt: timestamp,
                version: LEGAL_VERSIONS.contract,
                ipAddress,
                userAgent,
                documentUrl: "/legal/contract",
            });

            await createAuditLog({
                userId: user._id.toString(),
                action: "consent_given",
                entityType: "consent",
                entityId: user._id.toString(),
                details: {
                    consentType: "contract",
                    version: LEGAL_VERSIONS.contract,
                    ipAddress,
                },
            });
        }

        // Маркетинговое согласие - опционально
        if (marketingConsent) {
            // Если каналы не выбраны, используем email по умолчанию
            const channels = marketingChannels.length > 0 ? marketingChannels : ["email"];
            
            await Consent.create({
                user: user._id,
                type: "marketing",
                given: true,
                givenAt: timestamp,
                version: LEGAL_VERSIONS.marketingConsent,
                ipAddress,
                userAgent,
                marketingChannels: channels,
                documentUrl: "/legal/marketing-consent",
            });

            await createAuditLog({
                userId: user._id.toString(),
                action: "consent_given",
                entityType: "consent",
                entityId: user._id.toString(),
                details: {
                    consentType: "marketing",
                    channels: channels,
                    ipAddress,
                    userAgent,
                },
            });
        }

        // TODO: Отправка email уведомления администратору
        // await sendEmail({
        //   to: process.env.EMAIL_TO,
        //   subject: "Новая заявка с сайта",
        //   body: `Новая заявка от ${firstName} ${lastName} (${email})`,
        // });

        // TODO: Отправка приветственного письма клиенту
        // await sendEmail({
        //   to: email,
        //   subject: "Добро пожаловать!",
        //   body: "Спасибо за подписку...",
        // });

        return NextResponse.json({
            success: true,
            message: "Заявка успешно отправлена",
            userId: user._id,
        });
    } catch (error) {
        console.error("❌ Form submission error:", error);
        
        // Более подробное сообщение об ошибке для отладки
        const errorMessage = error instanceof Error ? error.message : "Внутренняя ошибка сервера";
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error("Error details:", {
            message: errorMessage,
            stack: errorStack,
        });

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
            },
            {status: 500}
        );
    }
}
