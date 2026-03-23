import mongoose, {Document, Schema} from "mongoose";

// Temp placeholder Document, Schema } from "mongoose";

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    service: mongoose.Types.ObjectId;
    serviceName: string;
    tariff: "base" | "premium" | "vip";
    status:
        | "pending"
        | "paid"
        | "cancelled"
        | "refunded"
        | "completed"
        | "in_progress";
    price: number;
    currency: "RUB";
    paymentMethod?: "yookassa" | "cloudpayments" | "yandex_split" | "dolemi" | "tinkoff";
    installmentPlan?: {
        provider: "yandex" | "dolemi" | "tinkoff";
        installments: number;
        amountPerInstallment: number;
        status: "pending" | "approved" | "rejected" | "active" | "closed";
    };
    client: {
        firstName: string;
        lastName: string;
        patronymic?: string;
        email: string;
        phone?: string;
    };
    consents: {
        personalData: {
            given: boolean;
            givenAt: Date;
            ipAddress: string;
            userAgent: string;
            version: string;
        };
        contract: {
            given: boolean;
            givenAt: Date;
            ipAddress: string;
            version: string;
        };
    };
    receipt?: {
        id: string;
        status: "pending" | "sent" | "failed";
        sentAt?: Date;
    };
    notes?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
            index: true,
        },
        serviceName: {
            type: String,
            required: true,
        },
        tariff: {
            type: String,
            enum: ["base", "premium", "vip"],
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "cancelled",
                "refunded",
                "completed",
                "in_progress",
            ],
            default: "pending",
            index: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            enum: ["RUB"],
            default: "RUB",
        },
        paymentMethod: {
            type: String,
            enum: ["yookassa", "cloudpayments", "yandex_split", "dolemi", "tinkoff"],
        },
        installmentPlan: {
            provider: {
                type: String,
                enum: ["yandex", "dolemi", "tinkoff"],
            },
            installments: Number,
            amountPerInstallment: Number,
            status: {
                type: String,
                enum: ["pending", "approved", "rejected", "active", "closed"],
            },
        },
        client: {
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            patronymic: String,
            email: {type: String, required: true},
            phone: String,
        },
        consents: {
            personalData: {
                given: {type: Boolean, required: true},
                givenAt: {type: Date, required: true},
                ipAddress: {type: String, required: true},
                userAgent: {type: String, required: true},
                version: {type: String, required: true},
            },
            contract: {
                given: {type: Boolean, required: true},
                givenAt: {type: Date, required: true},
                ipAddress: {type: String, required: true},
                version: {type: String, required: true},
            },
        },
        receipt: {
            id: String,
            status: {
                type: String,
                enum: ["pending", "sent", "failed"],
            },
            sentAt: Date,
        },
        notes: String,
        metadata: Schema.Types.Mixed,
    },
    {
        timestamps: true,
    }
);

// Индексы для производительности
OrderSchema.index({user: 1, createdAt: -1});
OrderSchema.index({status: 1, createdAt: -1});
OrderSchema.index({"consents.personalData.given": 1});
OrderSchema.index({"receipt.status": 1});

export const Order =
    mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
