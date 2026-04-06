import mongoose, {Document, Schema} from "mongoose";

export interface ICase extends Document {
    title: string;
    slug: string;
    client: { name: string; photo?: string; anonymized: boolean; age?: number; gender?: "female" | "male" };
    problem: string;
    challenge: string;
    solution: string;
    results: { title: string; value: string; metric?: string }[];
    beforeAfter?: { before: string; after: string };
    testimonial?: string;
    serviceId?: mongoose.Types.ObjectId;
    serviceName: string;
    duration: string;
    image?: { url: string; alt: string };
    published: boolean;
    publishedAt?: Date;
    consentGiven: boolean;
    consentDate?: Date;
    order: number;
    featured: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
    {
        title: {type: String, required: true},
        slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
        client: {
            name: {type: String, required: true},
            photo: String,
            anonymized: {type: Boolean, default: false},
            age: Number,
            gender: {type: String, enum: ["female", "male"]},
        },
        problem: {type: String, required: true},
        challenge: {type: String, required: true},
        solution: {type: String, required: true},
        results: [{title: String, value: {type: String, required: true}, metric: String}],
        beforeAfter: {before: String, after: String},
        testimonial: String,
        serviceId: {type: Schema.Types.ObjectId, ref: "Service"},
        serviceName: {type: String, required: true},
        duration: String,
        image: {url: String, alt: String},
        published: {type: Boolean, default: false},
        publishedAt: Date,
        consentGiven: {type: Boolean, required: true, default: false},
        consentDate: Date,
        order: {type: Number, default: 0},
        featured: {type: Boolean, default: false},
        tags: [String],
    },
    {timestamps: true}
);

// Индексы (slug уже имеет unique: true в определении поля)
CaseSchema.index({published: 1, publishedAt: -1});
CaseSchema.index({featured: 1});
CaseSchema.index({order: 1});

export const Case =
    mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);
