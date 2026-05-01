import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
    slug: string;
    title: string;
    description: string;
    fullDescription: string;
    category: "nutrition" | "health_coaching" | "slavic_gymnastics" | "other";
    pricing: {
        base: number;
        premium: number;
        vip: number;
        currency: "RUB";
    };
    features: {
        base: string[];
        premium: string[];
        vip: string[];
    };
    duration: {
        base: number;
        premium: number;
        vip: number;
    };
    format: ("online" | "offline" | "both")[];
    available: boolean;
    popular: boolean;
    installmentsAvailable: boolean;
    minInstallmentAmount: number;
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
    image: {
        url: string;
        alt: string;
    };
    icon?: string;
    order: number;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            maxlength: 200,
        },
        fullDescription: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["nutrition", "health_coaching", "slavic_gymnastics", "other"],
            required: true,
        },
        pricing: {
            base: {type: Number, required: true, min: 0},
            premium: {type: Number, required: true, min: 0},
            vip: {type: Number, required: true, min: 0},
            currency: {type: String, enum: ["RUB"], default: "RUB"},
        },
        features: {
            base: [String],
            premium: [String],
            vip: [String],
        },
        duration: {
            base: {type: Number, default: 60},
            premium: {type: Number, default: 90},
            vip: {type: Number, default: 120},
        },
        format: [
            {
                type: String,
                enum: ["online", "offline", "both"],
            },
        ],
        available: {
            type: Boolean,
            default: true,
        },
        popular: {
            type: Boolean,
            default: false,
        },
        installmentsAvailable: {
            type: Boolean,
            default: true,
        },
        minInstallmentAmount: {
            type: Number,
            default: 1500,
        },
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },
        image: {
            url: {type: String, required: true},
            alt: String,
        },
        icon: String,
        order: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Индексы для производительности (убраны дубли — slug уже имеет unique: true)
ServiceSchema.index({category: 1});
ServiceSchema.index({available: 1});
ServiceSchema.index({order: 1});
ServiceSchema.index({featured: 1});

// Виртуальное поле для _id (чтобы возвращалось как строка)
ServiceSchema.virtual("id").get(function() {
    return this._id.toHexString();
});

ServiceSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function(_doc, ret: any) {
        ret._id = ret.id;
        delete ret.id;
    },
});

export const Service =
    mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
