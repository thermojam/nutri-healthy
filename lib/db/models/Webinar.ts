import mongoose, {Document, Schema} from "mongoose";

export interface IWebinar extends Document {
    title: string;
    slug: string;
    description: string;
    recordingUrl: string;
    thumbnail: { url: string; alt: string };
    duration: number;
    originalDate: Date;
    speaker: { name: string; photo?: string; bio?: string };
    topics: string[];
    materials?: { name: string; url: string; type: "pdf" | "doc" | "xlsx" }[];
    published: boolean;
    publishedAt?: Date;
    views: number;
    featured: boolean;
    accessType: "free" | "paid" | "registration";
    price?: number;
    seo: { metaTitle: string; metaDescription: string };
    createdAt: Date;
    updatedAt: Date;
}

const WebinarSchema = new Schema<IWebinar>(
    {
        title: {type: String, required: true},
        slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
        description: {type: String, required: true},
        recordingUrl: {type: String, required: true},
        thumbnail: {url: {type: String, required: true}, alt: String},
        duration: {type: Number, required: true, min: 0},
        originalDate: {type: Date, required: true},
        speaker: {name: {type: String, required: true}, photo: String, bio: String},
        topics: [String],
        materials: [{name: String, url: String, type: {type: String, enum: ["pdf", "doc", "xlsx"]}}],
        published: {type: Boolean, default: false, index: true},
        publishedAt: Date,
        views: {type: Number, default: 0},
        featured: {type: Boolean, default: false, index: true},
        accessType: {type: String, enum: ["free", "paid", "registration"], default: "free"},
        price: Number,
        seo: {metaTitle: String, metaDescription: String},
    },
    {timestamps: true}
);

WebinarSchema.index({slug: 1}, {unique: true});
WebinarSchema.index({published: 1, publishedAt: -1});
WebinarSchema.index({featured: 1});

export const Webinar =
    mongoose.models.Webinar || mongoose.model<IWebinar>("Webinar", WebinarSchema);
