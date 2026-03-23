import mongoose, {Document, Schema} from "mongoose";

/**
 * AuditLog - Журнал аудита для 152-ФЗ
 * Логирует все действия с персональными данными
 * Срок хранения: минимум 3 года (TTL индекс)
 */
export interface IAuditLog extends Document {
    userId?: mongoose.Types.ObjectId;
    action:
        | "consent_given"
        | "consent_withdrawn"
        | "data_access"
        | "data_update"
        | "data_delete"
        | "login"
        | "logout"
        | "payment_created"
        | "receipt_generated";
    entityType: "user" | "order" | "payment" | "receipt" | "consent";
    entityId: mongoose.Types.ObjectId;
    details: Record<string, unknown>;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    expiresAt?: Date; // Для TTL удаления через 3 года
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                "consent_given",
                "consent_withdrawn",
                "data_access",
                "data_update",
                "data_delete",
                "login",
                "logout",
                "payment_created",
                "receipt_generated",
            ],
            index: true,
        },
        entityType: {
            type: String,
            required: true,
            enum: ["user", "order", "payment", "receipt", "consent"],
            index: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        details: {
            type: Schema.Types.Mixed,
            default: {},
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            default: () => {
                // 3 года от текущей даты (требование 152-ФЗ)
                const date = new Date();
                date.setFullYear(date.getFullYear() + 3);
                return date;
            },
            index: {expireAfterSeconds: 0}, // TTL индекс для автоудаления
        },
    },
    {
        timestamps: true,
    }
);

// Индексы для быстрого поиска
AuditLogSchema.index({createdAt: -1});
AuditLogSchema.index({userId: 1, createdAt: -1});
AuditLogSchema.index({action: 1, createdAt: -1});

export const AuditLog =
    mongoose.models.AuditLog ||
    mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
