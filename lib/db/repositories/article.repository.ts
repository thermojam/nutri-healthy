import {connectDB} from "../connect";
import {Article, IArticle} from "../models/Article";

export class ArticleRepository {
    async findById(id: string): Promise<IArticle | null> {
        await connectDB();
        return Article.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<IArticle | null> {
        await connectDB();
        return Article.findOne({slug, published: true}).exec();
    }

    async findPublished(limit: number = 10): Promise<IArticle[]> {
        await connectDB();
        return Article.find({published: true})
            .sort({publishedAt: -1, order: 1})
            .limit(limit)
            .exec();
    }

    async findFeatured(limit: number = 3): Promise<IArticle[]> {
        await connectDB();
        return Article.find({published: true, featured: true})
            .sort({order: 1, publishedAt: -1})
            .limit(limit)
            .exec();
    }

    async findByCategory(
        category: string,
        limit: number = 10
    ): Promise<IArticle[]> {
        await connectDB();
        return Article.find({published: true, category})
            .sort({publishedAt: -1})
            .limit(limit)
            .exec();
    }

    async create(data: Partial<IArticle>): Promise<IArticle> {
        await connectDB();
        return Article.create(data);
    }

    async update(slug: string, data: Partial<IArticle>): Promise<IArticle | null> {
        await connectDB();
        return Article.findOneAndUpdate({slug}, data, {new: true}).exec();
    }

    async delete(slug: string): Promise<void> {
        await connectDB();
        await Article.deleteOne({slug});
    }

    async updateViews(slug: string): Promise<void> {
        await connectDB();
        await Article.updateOne({slug}, {$inc: {views: 1}});
    }

    async getArticlesCount(): Promise<number> {
        await connectDB();
        return Article.countDocuments({published: true});
    }
}

export const articleRepository = new ArticleRepository();
