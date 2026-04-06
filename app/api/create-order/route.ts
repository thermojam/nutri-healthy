import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {connectDB} from "@/lib/db/connect";
import {Order} from "@/lib/db/models/Order";
import {User} from "@/lib/db/models/User";
import {Consent} from "@/lib/db/models/Consent";
import {Service} from "@/lib/db/models/Service";
import {createAuditLog, getClientIP, getUserAgent} from "@/lib/db/audit";
import {orderFormSchema, LEGAL_VERSIONS} from "@/lib/validations";
import {paymentService} from "@/lib/payments/payment-service";
import {sendAdminEmail, sendEmail} from "@/lib/email";
import {AdminNewOrderTemplate} from "@/lib/email/templates/admin-new-order";
import {ClientOrderConfirmTemplate} from "@/lib/email/templates/client-order-confirm";

/**
 * Нормализация номера телефона — приведение к единому формату
 * +7 (999) 123-45-67 → +79991234567
 * Пустая строка или маска → undefined
 */
function normalizePhone(phone?: string): string | undefined {
    if (!phone) return undefined;
    const trimmed = phone.trim();
    // Если пустая строка или только спецсимволы маски
    if (!trimmed || /^[\s()\-_]+$/.test(trimmed)) return undefined;
    // Удаляем все кроме цифр и плюса
    const cleaned = trimmed.replace(/[^\d+]/g, "");
    // Если начинается с 8, заменяем на +7
    const normalized = cleaned.replace(/^8/, "+7");
    // Если начинается с 7, добавляем +
    if (normalized.startsWith("7") && !normalized.startsWith("+")) {
        return "+" + normalized;
    }
    return normalized;
}

/**
 * POST /api/create-order
 * Создание заказа на услугу
 *
 * Требования:
 * - 152-ФЗ: логирование согласий с IP и User-Agent
 * - 54-ФЗ: подготовка данных для чека
 * - Сохранение версии документов
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Валидация данных заказа
        const validationResult = orderFormSchema.safeParse(body);

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
            serviceId,
            tariff,
            personalDataConsent,
            contractAcceptance,
            marketingConsent,
            marketingChannels,
            paymentMethod,
        } = validationResult.data;

        // Получение IP и User-Agent (152-ФЗ)
        const ipAddress = await getClientIP();
        const userAgent = await getUserAgent();
        const timestamp = new Date();

        await connectDB();

        // Миграция: удаляем старый индекс phone_1 если он существует
        try {
            const indexes = await User.collection.indexes();
            const phoneIndex = indexes.find(
                (idx: any) => idx.key && idx.key.phone && !idx.unique
            );
            if (phoneIndex) {
                await User.collection.dropIndex("phone_1");
                console.log("✅ Удалён старый индекс phone_1");
            }
        } catch (e) {
            // Индекс может уже не существовать — игнорируем
        }

        // Получение услуги из БД для проверки цены и доступности
        const service = await Service.findById(serviceId);

        if (!service) {
            return NextResponse.json(
                {success: false, error: "Услуга не найдена"},
                {status: 404}
            );
        }

        if (!service.available) {
            return NextResponse.json(
                {success: false, error: "Услуга временно недоступна"},
                {status: 400}
            );
        }

        // Получение цены из тарифа услуги
        const price = service.pricing[tariff];

        if (!price) {
            return NextResponse.json(
                {success: false, error: "Некорректный тариф"},
                {status: 400}
            );
        }

        // Нормализация телефона
        const normalizedPhone = normalizePhone(phone);

        // Поиск или создание пользователя
        let user = await User.findOne({email});

        if (user) {
            // Обновление существующего
            user.firstName = firstName;
            user.lastName = lastName;
            user.patronymic = patronymic || user.patronymic;
            if (normalizedPhone) {
                user.phone = normalizedPhone;
            } else if (normalizedPhone === undefined && phone) {
                // Если телефон был пустой — очищаем
                user.phone = undefined;
            }
            await user.save();
        } else {
            // Создание нового — телефон только если не пустой
            user = await User.create({
                email,
                phone: normalizedPhone || undefined,
                firstName,
                lastName,
                patronymic,
            });
        }

        // Создание заказа
        const order = await Order.create({
            user: user._id,
            service: service._id,
            serviceName: service.title,
            tariff,
            price,
            client: {
                firstName,
                lastName,
                patronymic,
                email,
                phone,
            },
            consents: {
                personalData: {
                    given: personalDataConsent,
                    givenAt: timestamp,
                    ipAddress,
                    userAgent,
                    version: LEGAL_VERSIONS.personalDataConsent,
                },
                contract: {
                    given: contractAcceptance,
                    givenAt: timestamp,
                    ipAddress,
                    version: LEGAL_VERSIONS.contract,
                },
            },
            receipt: {
                status: "pending",
            },
        });

        // Создание записей согласий
        if (personalDataConsent) {
            await Consent.create({
                user: user._id,
                type: "personal_data",
                given: true,
                givenAt: timestamp,
                version: LEGAL_VERSIONS.personalDataConsent,
                ipAddress,
                userAgent,
                metadata: {orderId: order._id.toString()},
            });

            await createAuditLog({
                userId: user._id.toString(),
                action: "consent_given",
                entityType: "consent",
                entityId: user._id.toString(),
                details: {
                    consentType: "personal_data",
                    orderId: order._id.toString(),
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
                metadata: {orderId: order._id.toString()},
            });

            await createAuditLog({
                userId: user._id.toString(),
                action: "consent_given",
                entityType: "consent",
                entityId: user._id.toString(),
                details: {
                    consentType: "contract",
                    orderId: order._id.toString(),
                    ipAddress,
                },
            });
        }

        if (marketingConsent && marketingChannels) {
            await Consent.create({
                user: user._id,
                type: "marketing",
                given: true,
                givenAt: timestamp,
                version: LEGAL_VERSIONS.marketingConsent,
                ipAddress,
                userAgent,
                marketingChannels,
                metadata: {orderId: order._id.toString()},
            });

            await createAuditLog({
                userId: user._id.toString(),
                action: "consent_given",
                entityType: "consent",
                entityId: user._id.toString(),
                details: {
                    consentType: "marketing",
                    channels: marketingChannels,
                    orderId: order._id.toString(),
                    ipAddress,
                    userAgent,
                },
            });
        }

        // Аудит создания заказа
        await createAuditLog({
            userId: user._id.toString(),
            action: "payment_created",
            entityType: "order",
            entityId: order._id.toString(),
            details: {
                tariff,
                price,
                serviceId: service._id.toString(),
            },
        });

        // Инициализация платежа через активный платежный сервис
        let paymentUrl: string | undefined;
        let paymentData: any;

        try {
            // Определяем провайдер на основе выбранного метода оплаты
            const provider = paymentMethod === "paykeeper" ? "paykeeper" : "yookassa";

            paymentData = await paymentService.createPayment({
                orderId: order._id.toString(),
                amount: price,
                currency: "RUB",
                description: `Оплата услуги: ${service.title} (${tariff})`,
                email,
            });

            // Проверяем успешность создания платежа
            if (!paymentData.success || !paymentData.paymentUrl) {
                console.error("❌ Payment creation failed:", paymentData.error);
                
                // Помечаем заказ как ожидающий оплаты
                order.status = "pending";
                order.paymentMethod = paymentMethod as any;
                order.metadata = {
                    paymentProvider: provider,
                    paymentMethod: paymentMethod,
                    paymentError: paymentData.error,
                };
                await order.save();
                
                return NextResponse.json({
                    success: false,
                    error: "Не удалось инициировать платеж. Попробуйте другой способ оплаты.",
                    order: {
                        id: order._id,
                        price,
                        tariff,
                    },
                }, { status: 400 });
            }

            paymentUrl = paymentData.paymentUrl;

            // Сохранение информации о платеже в заказ
            order.paymentMethod = paymentMethod as any;
            order.paymentId = paymentData.paymentId;
            order.paymentProvider = provider as any;
            order.status = "pending";
            order.metadata = {
                paymentUrl,
                paymentProvider: provider,
                paymentMethod: paymentMethod,
            };
            await order.save();
        } catch (paymentError) {
            console.error("❌ Payment initialization error:", paymentError);
            
            // Помечаем заказ как ожидающий оплаты
            order.status = "pending";
            order.paymentMethod = paymentMethod as any;
            order.metadata = {
                paymentMethod: paymentMethod,
                paymentError: paymentError instanceof Error ? paymentError.message : "Unknown error",
            };
            await order.save();
            
            return NextResponse.json({
                success: false,
                error: "Ошибка при создании платежа. Попробуйте позже или выберите другой способ оплаты.",
                order: {
                    id: order._id,
                    price,
                    tariff,
                },
            }, { status: 400 });
        }

        // Письма отправляются ТОЛЬКО после успешной оплаты (webhook)
        // Сейчас только возвращаем данные для оплаты

        // Возврат ответа
        if (paymentUrl) {
            return NextResponse.json({
                success: true,
                message: "Заказ создан успешно",
                order: {
                    id: order._id,
                    price,
                    tariff,
                },
                payment_url: paymentUrl,
            });
        } else {
            return NextResponse.json({
                success: true,
                message: "Заказ создан, но платеж не инициирован",
                order: {
                    id: order._id,
                    price,
                    tariff,
                },
            });
        }
    } catch (error) {
        console.error("❌ Order creation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            {
                success: false,
                error: `Внутренняя ошибка сервера: ${errorMessage}`
            },
            {status: 500}
        );
    }
}
