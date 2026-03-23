import mongoose, {Document, Schema, HydratedDocument} from "mongoose";

export interface IUser extends Document {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
    role: "client" | "admin";
    consents: {
        personalData: {
            given: boolean;
            givenAt?: Date;
            withdrawn?: boolean;
            withdrawnAt?: Date;
            ipAddress?: string;
            userAgent?: string;
        };
        marketing: {
            given: boolean;
            givenAt?: Date;
            withdrawn?: boolean;
            withdrawnAt?: Date;
            channels: ("email" | "sms" | "telegram" | "whatsapp")[];
        };
        contract: {
            given: boolean;
            givenAt?: Date;
            version: string;
            ipAddress?: string;
        };
    };
    preferences: {
        theme: "light" | "dark" | "system";
        language: "ru" | "en";
        notifications: {
            email: boolean;
            sms: boolean;
            telegram: boolean;
        };
    };
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "Email обязателен"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: [true, "Имя обязательно"],
            trim: true,
            minlength: 2,
        },
        lastName: {
            type: String,
            required: [true, "Фамилия обязательна"],
            trim: true,
            minlength: 2,
        },
        patronymic: String,
        role: {
            type: String,
            enum: ["client", "admin"],
            default: "client",
        },
        consents: {
            personalData: {
                given: {type: Boolean, default: false},
                givenAt: Date,
                withdrawn: {type: Boolean, default: false},
                withdrawnAt: Date,
                ipAddress: String,
                userAgent: String,
            },
            marketing: {
                given: {type: Boolean, default: false},
                givenAt: Date,
                withdrawn: {type: Boolean, default: false},
                withdrawnAt: Date,
                channels: [
                    {
                        type: String,
                        enum: ["email", "sms", "telegram", "whatsapp"],
                    },
                ],
            },
            contract: {
                given: {type: Boolean, default: false},
                givenAt: Date,
                version: String,
                ipAddress: String,
            },
        },
        preferences: {
            theme: {
                type: String,
                enum: ["light", "dark", "system"],
                default: "system",
            },
            language: {
                type: String,
                enum: ["ru", "en"],
                default: "ru",
            },
            notifications: {
                email: {type: Boolean, default: true},
                sms: {type: Boolean, default: false},
                telegram: {type: Boolean, default: false},
            },
        },
        lastLoginAt: Date,
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

// Индексы для производительности и 152-ФЗ (email и phone уже имеют unique в определении поля)
UserSchema.index({createdAt: -1});
UserSchema.index({"consents.personalData.given": 1});
UserSchema.index({"consents.marketing.given": 1});

// Виртуальное поле для полного имени
UserSchema.virtual("fullName").get(function () {
    return `${this.lastName} ${this.firstName}${
        this.patronymic ? " " + this.patronymic : ""
    }`;
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
