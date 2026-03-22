import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Consent } from "@/lib/db/models/Consent";
import { createAuditLog, getClientIP, getUserAgent } from "@/lib/db/audit";
import { contactFormSchema, LEGAL_VERSIONS } from "@/lib/validations";

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
        { status: 400 }
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

    // Получение IP и User-Agent для логирования (152-ФЗ)
    const ipAddress = await getClientIP();
    const userAgent = await getUserAgent();
    const timestamp = new Date();

    // Подключение к MongoDB
    await connectDB();

    // Проверка существующего пользователя
    let user = await User.findOne({ email });

    if (user) {
      // Обновление существующего пользователя
      user.firstName = firstName;
      user.lastName = lastName;
      user.patronymic = patronymic || user.patronymic;
      if (phone) user.phone = phone;
      
      await user.save();
    } else {
      // Создание нового пользователя
      user = await User.create({
        email,
        phone,
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
            channels: marketingConsent ? ["email"] : [],
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

    if (marketingConsent) {
      await Consent.create({
        user: user._id,
        type: "marketing",
        given: true,
        givenAt: timestamp,
        version: LEGAL_VERSIONS.marketingConsent,
        ipAddress,
        userAgent,
        marketingChannels: ["email"],
        documentUrl: "/legal/marketing-consent",
      });

      await createAuditLog({
        userId: user._id.toString(),
        action: "consent_given",
        entityType: "consent",
        entityId: user._id.toString(),
        details: {
          consentType: "marketing",
          channels: ["email"],
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
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Внутренняя ошибка сервера" 
      },
      { status: 500 }
    );
  }
}
