import mongoose, {Document, Schema} from "mongoose";

/**
 * Consent - Согласия на обработку персональных данных (152-ФЗ)
 * Отдельная коллекция для хранения всех согласий с возможностью отзыва
 */
export interface IConsent extends Document {
    user: mongoose.Types.ObjectId;
    type: "personal_data" | "marketing" | "contract" | "cookies";
    given: boolean;
    givenAt: Date;
    withdrawn?: boolean;
    withdrawnAt?: Date;
    version: string; // Версия документа согласия
    ipAddress: string;
    userAgent: string;
    marketingChannels?: ("email" | "sms" | "telegram" | "whatsapp")[];
    documentUrl?: string; // Ссылка на версию документа
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const ConsentSchema = new Schema<IConsent>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["personal_data", "marketing", "contract", "cookies"],
            required: true,
            index: true,
        },
        given: {
            type: Boolean,
            required: true,
            default: false,
            index: true,
        },
        givenAt: {
            type: Date,
            required: true,
        },
        withdrawn: {
            type: Boolean,
            default: false,
            index: true,
        },
        withdrawnAt: Date,
        version: {
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        marketingChannels: [
            {
                type: String,
                enum: ["email", "sms", "telegram", "whatsapp"],
            },
        ],
        documentUrl: String,
        metadata: Schema.Types.Mixed,
    },
    {
        timestamps: true,
    }
);

// Индексы для быстрого поиска
ConsentSchema.index({user: 1, type: 1});
ConsentSchema.index({given: 1, withdrawn: 1});
ConsentSchema.index({createdAt: -1});

// Метод для отзыва согласия
ConsentSchema.methods.withdraw = function (ipAddress: string, userAgent: string) {
    this.withdrawn = true;
    this.withdrawnAt = new Date();
    this.metadata = {
        ...this.metadata,
        withdrawalIpAddress: ipAddress,
        withdrawalUserAgent: userAgent,
    };
    return this.save();
};

export const Consent =
    mongoose.models.Consent || mongoose.model<IConsent>("Consent", ConsentSchema);
