import mongoose, {Document, Schema} from "mongoose";

export interface IWebinar extends Document {
    title: string;
    slug: string;
    description: string;
    recordingUrl: string;
    thumbnail: { url: string; alt: string };
    duration: number;
    originalDate: Date;
    speaker: { name: string; photo?: string };
    published: boolean;
    featured: boolean;
    accessType: "free" | "paid" | "registration";
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
        speaker: {name: {type: String, required: true}, photo: String},
        published: {type: Boolean, default: false},
        featured: {type: Boolean, default: false},
        accessType: {type: String, enum: ["free", "paid", "registration"], default: "free"},
    },
    {timestamps: true}
);

WebinarSchema.index({published: 1, createdAt: -1});
WebinarSchema.index({featured: 1});

export const Webinar =
    mongoose.models.Webinar || mongoose.model<IWebinar>("Webinar", WebinarSchema);
