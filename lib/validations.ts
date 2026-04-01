import {z} from "zod";

/**
 * Версии юридических документов (из env)
 */
export const LEGAL_VERSIONS = {
    privacyPolicy: process.env.PRIVACY_POLICY_VERSION || "1.0",
    contract: process.env.CONTRACT_VERSION || "1.0",
    personalDataConsent: process.env.PERSONAL_DATA_CONSENT_VERSION || "1.0",
    marketingConsent: process.env.MARKETING_CONSENT_VERSION || "1.0",
};

/**
 * Схема контактной формы (лид-магнит)
 */
export const contactFormSchema = z.object({
    firstName: z
        .string()
        .min(2, "Имя должно содержать не менее 2 символов")
        .max(50, "Имя не должно превышать 50 символов")
        .regex(
            /^[а-яА-ЯёЁa-zA-Z-]+$/,
            "Имя должно содержать только буквы и дефис"
        ),
    lastName: z
        .string()
        .min(2, "Фамилия должна содержать не менее 2 символов")
        .max(50, "Фамилия не должна превышать 50 символов")
        .regex(
            /^[а-яА-ЯёЁa-zA-Z-]+$/,
            "Фамилия должна содержать только буквы и дефис"
        ),
    patronymic: z
        .string()
        .max(50, "Отчество не должно превышать 50 символов")
        .regex(
            /^[а-яА-ЯёЁa-zA-Z-]*$/,
            "Отчество должно содержать только буквы и дефис"
        )
        .optional()
        .or(z.literal("")),
    email: z.string().email("Некорректный email адрес"),
    phone: z
        .string()
        .min(10, "Введите корректный номер телефона")
        .regex(
            /^[\d\s()+-]+$/,
            "Номер телефона должен содержать только цифры, пробелы и символы +()-"
        )
        .optional()
        .or(z.literal("")),
    // Согласия (152-ФЗ требование)
    personalDataConsent: z.boolean().refine((val) => val === true, {
        message: "Необходимо согласие на обработку персональных данных",
    }),
    marketingConsent: z.boolean().optional(),
    contractAcceptance: z.boolean().refine((val) => val === true, {
        message: "Необходимо принять условия договора оферты",
    }),
});

export type ContactFormData = z.infer<typeof contactFormSchema> & {
    marketingChannels?: ("email" | "sms" | "telegram" | "whatsapp")[];
};

/**
 * Схема для заказа услуги
 */
export const orderFormSchema = z.object({
    firstName: z
        .string()
        .min(2, "Имя должно содержать не менее 2 символов")
        .max(50),
    lastName: z
        .string()
        .min(2, "Фамилия должна содержать не менее 2 символов")
        .max(50),
    patronymic: z.string().max(50).optional().or(z.literal("")),
    email: z.string().email("Некорректный email адрес"),
    phone: z
        .string()
        .min(10, "Введите корректный номер телефона")
        .optional()
        .or(z.literal("")),
    serviceId: z.string().min(1, "ID услуги обязателен"),
    tariff: z.enum(["base", "premium", "vip"]),
    paymentMethod: z.enum(["card", "yookassa", "yandex_split", "dolemi", "paykeeper"]).optional(),
    installments: z.number().optional(),
    // Согласия
    personalDataConsent: z.boolean().refine((val) => val === true, {
        message: "Необходимо согласие на обработку персональных данных",
    }),
    contractAcceptance: z.boolean().refine((val) => val === true, {
        message: "Необходимо принять условия договора оферты",
    }),
    marketingConsent: z.boolean().optional(),
    marketingChannels: z
        .array(z.enum(["email", "sms", "telegram", "whatsapp"]))
        .optional(),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

/**
 * Схема для отзыва согласия
 */
export const withdrawConsentSchema = z.object({
    consentType: z.enum(["personal_data", "marketing", "contract", "cookies"]),
    email: z.string().email("Некорректный email адрес"),
});

export type WithdrawConsentData = z.infer<typeof withdrawConsentSchema>;

/**
 * Схема для подписки на рассылку
 */
export const subscribeSchema = z.object({
    email: z.string().email("Некорректный email адрес"),
    marketingConsent: z.boolean().refine((val) => val === true, {
        message: "Необходимо согласие на рассылку",
    }),
    marketingChannels: z
        .array(z.enum(["email", "sms", "telegram", "whatsapp"]))
        .min(1, "Выберите хотя бы один канал связи"),
});

export type SubscribeData = z.infer<typeof subscribeSchema>;

/**
 * Схема для обратной связи
 */
export const feedbackSchema = z.object({
    name: z
        .string()
        .min(2, "Имя должно содержать не менее 2 символов")
        .max(100),
    email: z.string().email("Некорректный email адрес"),
    phone: z.string().optional().or(z.literal("")),
    message: z
        .string()
        .min(10, "Сообщение должно содержать не менее 10 символов")
        .max(2000, "Сообщение не должно превышать 2000 символов"),
    personalDataConsent: z.boolean().refine((val) => val === true, {
        message: "Необходимо согласие на обработку персональных данных",
    }),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;
