import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {connectDB} from "@/lib/db/connect";
import {Order} from "@/lib/db/models/Order";
import {User} from "@/lib/db/models/User";
import {Consent} from "@/lib/db/models/Consent";
import {Service} from "@/lib/db/models/Service";
import {createAuditLog, getClientIP, getUserAgent} from "@/lib/db/audit";
import {orderFormSchema, LEGAL_VERSIONS} from "@/lib/validations";
import {yookassaService} from "@/lib/payments/yookassa";

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
        } = validationResult.data;

        // Получение IP и User-Agent (152-ФЗ)
        const ipAddress = await getClientIP();
        const userAgent = await getUserAgent();
        const timestamp = new Date();

        await connectDB();

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

        // Поиск или создание пользователя
        let user = await User.findOne({email});

        if (user) {
            // Обновление существующего
            user.firstName = firstName;
            user.lastName = lastName;
            user.patronymic = patronymic || user.patronymic;
            if (phone) user.phone = phone;
            await user.save();
        } else {
            user = await User.create({
                email,
                phone,
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

        // Инициализация платежа через ЮKassa
        try {
            const paymentData = await yookassaService.createPayment({
                orderId: order._id.toString(),
                amount: price,
                currency: "RUB",
                description: `Оплата услуги: ${service.title} (${tariff})`,
                email,
            });

            // Сохранение ID платежа в заказ
            order.paymentMethod = "yookassa";
            order.metadata = {
                yookassaPaymentId: paymentData.id,
                confirmationUrl: paymentData.confirmation.confirmation_url,
            };
            await order.save();

            return NextResponse.json({
                success: true,
                message: "Заказ создан успешно",
                order: {
                    id: order._id,
                    price,
                    tariff,
                },
                payment_url: paymentData.confirmation.confirmation_url,
            });
        } catch (paymentError) {
            console.error("❌ Payment initialization error:", paymentError);

            // Возвращаем данные заказа даже если платеж не инициирован
            return NextResponse.json({
                success: true,
                message: "Заказ создан, но платеж не инициирован",
                order: {
                    id: order._id,
                    price,
                    tariff,
                },
                error: "Не удалось инициализировать платеж",
            });
        }
    } catch (error) {
        console.error("❌ Order creation error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Внутренняя ошибка сервера"
            },
            {status: 500}
        );
    }
}
