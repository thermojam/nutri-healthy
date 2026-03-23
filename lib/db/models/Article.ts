import mongoose, {Document, Schema} from "mongoose";

export interface IArticle extends Document {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: { url: string; alt: string };
    author: { name: string; photo?: string };
    category: "nutrition" | "psychology" | "wellness" | "lifestyle";
    tags: string[];
    published: boolean;
    publishedAt?: Date;
    seo: { metaTitle: string; metaDescription: string; keywords: string[] };
    readingTime: number;
    views: number;
    relatedArticles: mongoose.Types.ObjectId[];
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
    {
        slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
        title: {type: String, required: true},
        excerpt: {type: String, required: true, maxlength: 200},
        content: {type: String, required: true},
        coverImage: {url: {type: String, required: true}, alt: String},
        author: {name: {type: String, required: true}, photo: String},
        category: {
            type: String,
            enum: ["nutrition", "psychology", "wellness", "lifestyle"],
            required: true,
        },
        tags: [String],
        published: {type: Boolean, default: false},
        publishedAt: Date,
        seo: {metaTitle: String, metaDescription: String, keywords: [String]},
        readingTime: {type: Number, default: 5},
        views: {type: Number, default: 0},
        relatedArticles: [{type: Schema.Types.ObjectId, ref: "Article"}],
        featured: {type: Boolean, default: false},
        order: {type: Number, default: 0},
    },
    {timestamps: true}
);

ArticleSchema.index({slug: 1}, {unique: true});
ArticleSchema.index({published: 1, publishedAt: -1});
ArticleSchema.index({category: 1});
ArticleSchema.index({featured: 1});

export const Article =
    mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);
