import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {connectDB} from "@/lib/db/connect";
import {Order} from "@/lib/db/models/Order";
import {User} from "@/lib/db/models/User";
import {Consent} from "@/lib/db/models/Consent";
import {createAuditLog, getClientIP, getUserAgent} from "@/lib/db/audit";
import {orderFormSchema, LEGAL_VERSIONS} from "@/lib/validations";

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

        // TODO: Получить данные об услуге из БД для проверки цены
        // const service = await Service.findById(serviceId);
        // if (!service || !service.available) {
        //   return NextResponse.json(
        //     { success: false, error: "Услуга недоступна" },
        //     { status: 404 }
        //   );
        // }

        // Моковые данные для цены (заменить на реальные из БД)
        const prices = {
            base: 5000,
            premium: 10000,
            vip: 20000,
        };
        const price = prices[tariff];

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
            service: serviceId,
            serviceName: "Консультация нутрициолога", // TODO: из БД
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
                serviceId,
            },
        });

        // TODO: Инициализация платежа (ЮKassa/CloudPayments)
        // const paymentData = await createYooKassaPayment({
        //   order_id: order._id.toString(),
        //   amount: price,
        //   email,
        // });

        return NextResponse.json({
            success: true,
            message: "Заказ создан успешно",
            order: {
                id: order._id,
                price,
                tariff,
            },
            // payment_url: paymentData.confirmation.confirmation_url,
        });
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
