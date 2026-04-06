import {connectDB} from "../connect";
import {Service, IService} from "../models/Service";

export class ServiceRepository {
    async findById(id: string): Promise<IService | null> {
        await connectDB();
        return Service.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<IService | null> {
        await connectDB();
        return Service.findOne({slug, available: true}).exec();
    }

    async findAll(limit: number = 10): Promise<IService[]> {
        await connectDB();
        return Service.find({available: true})
            .sort({order: 1, createdAt: -1})
            .limit(limit)
            .exec();
    }

    async findFeatured(limit: number = 3): Promise<IService[]> {
        await connectDB();
        return Service.find({available: true, featured: true})
            .sort({order: 1, createdAt: -1})
            .limit(limit)
            .exec();
    }

    async findByCategory(
        category: string,
        limit: number = 10
    ): Promise<IService[]> {
        await connectDB();
        return Service.find({available: true, category})
            .sort({order: 1, createdAt: -1})
            .limit(limit)
            .exec();
    }

    async create(data: Partial<IService>): Promise<IService> {
        await connectDB();
        return Service.create(data);
    }

    async update(
        slug: string,
        data: Partial<IService>
    ): Promise<IService | null> {
        await connectDB();
        return Service.findOneAndUpdate({slug}, data, {new: true}).exec();
    }

    async delete(slug: string): Promise<void> {
        await connectDB();
        await Service.deleteOne({slug});
    }

    async getServicesCount(): Promise<number> {
        await connectDB();
        return Service.countDocuments({available: true});
    }
}

export const serviceRepository = new ServiceRepository();
