import {connectDB} from "../connect";
import {Video, IVideo} from "../models/Video";

export class VideoRepository {
    async findById(id: string): Promise<IVideo | null> {
        await connectDB();
        return Video.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<IVideo | null> {
        await connectDB();
        return Video.findOne({slug, published: true}).exec();
    }

    async findPublished(limit: number = 10): Promise<IVideo[]> {
        await connectDB();
        return Video.find({published: true})
            .sort({publishedAt: -1, order: 1})
            .limit(limit)
            .exec();
    }

    async findFeatured(limit: number = 3): Promise<IVideo[]> {
        await connectDB();
        return Video.find({published: true, featured: true})
            .sort({order: 1, publishedAt: -1})
            .limit(limit)
            .exec();
    }

    async findByCategory(category: string, limit: number = 10): Promise<IVideo[]> {
        await connectDB();
        return Video.find({published: true, category})
            .sort({publishedAt: -1})
            .limit(limit)
            .exec();
    }

    async findNutritionPsychoVideos(limit: number = 3): Promise<IVideo[]> {
        await connectDB();
        return Video.find({
            published: true,
            category: {$in: ["nutrition", "psychology", "wellness"]},
            duration: {$gte: 600, $lte: 1200}, // 10-20 минут
        })
            .sort({order: 1, publishedAt: -1})
            .limit(limit)
            .exec();
    }

    async create(data: Partial<IVideo>): Promise<IVideo> {
        await connectDB();
        return Video.create(data);
    }

    async update(slug: string, data: Partial<IVideo>): Promise<IVideo | null> {
        await connectDB();
        return Video.findOneAndUpdate({slug}, data, {new: true}).exec();
    }

    async delete(slug: string): Promise<void> {
        await connectDB();
        await Video.deleteOne({slug});
    }

    async updateViews(slug: string): Promise<void> {
        await connectDB();
        await Video.updateOne({slug}, {$inc: {views: 1}});
    }
}

export const videoRepository = new VideoRepository();
