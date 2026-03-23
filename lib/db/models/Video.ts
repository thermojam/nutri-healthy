import mongoose, {Document, Schema} from "mongoose";

export interface IVideo extends Document {
    title: string;
    slug: string;
    description: string;
    videoUrl: string;
    thumbnail: {
        url: string;
        alt: string;
    };
    duration: number;
    category: "nutrition" | "psychology" | "wellness" | "gymnastics";
    tags: string[];
    published: boolean;
    publishedAt?: Date;
    views: number;
    featured: boolean;
    order: number;
    transcript?: string;
    seo: {
        metaTitle: string;
        metaDescription: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
    {
        title: {type: String, required: true},
        slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
        description: {type: String, required: true},
        videoUrl: {type: String, required: true},
        thumbnail: {url: {type: String, required: true}, alt: String},
        duration: {type: Number, required: true, min: 0},
        category: {
            type: String,
            enum: ["nutrition", "psychology", "wellness", "gymnastics"],
            required: true,
        },
        tags: [String],
        published: {type: Boolean, default: false},
        publishedAt: Date,
        views: {type: Number, default: 0},
        featured: {type: Boolean, default: false},
        order: {type: Number, default: 0},
        transcript: String,
        seo: {metaTitle: String, metaDescription: String},
    },
    {timestamps: true}
);

VideoSchema.index({slug: 1}, {unique: true});
VideoSchema.index({published: 1, publishedAt: -1});
VideoSchema.index({category: 1});
VideoSchema.index({featured: 1});

export const Video =
    mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
