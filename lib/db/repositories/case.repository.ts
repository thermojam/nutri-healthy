import {connectDB} from "../connect";
import {Case, ICase} from "../models/Case";

export class CaseRepository {
    async findById(id: string): Promise<ICase | null> {
        await connectDB();
        return Case.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<ICase | null> {
        await connectDB();
        return Case.findOne({slug, published: true}).exec();
    }

    async findPublished(limit: number = 10): Promise<ICase[]> {
        await connectDB();
        return Case.find({published: true})
            .sort({publishedAt: -1, order: 1})
            .limit(limit)
            .exec();
    }

    async findFeatured(limit: number = 5): Promise<ICase[]> {
        await connectDB();
        return Case.find({published: true, featured: true})
            .sort({order: 1, publishedAt: -1})
            .limit(limit)
            .exec();
    }

    async findByService(serviceId: string): Promise<ICase[]> {
        await connectDB();
        return Case.find({published: true, serviceId})
            .sort({publishedAt: -1})
            .exec();
    }

    async create(data: Partial<ICase>): Promise<ICase> {
        await connectDB();
        return Case.create(data);
    }

    async update(slug: string, data: Partial<ICase>): Promise<ICase | null> {
        await connectDB();
        return Case.findOneAndUpdate({slug}, data, {new: true}).exec();
    }

    async delete(slug: string): Promise<void> {
        await connectDB();
        await Case.deleteOne({slug});
    }

    async getCasesCount(): Promise<number> {
        await connectDB();
        return Case.countDocuments({published: true});
    }
}

export const caseRepository = new CaseRepository();
