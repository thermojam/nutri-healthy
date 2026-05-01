import {connectDB} from "../connect";
import {Education, IEducation} from "@/lib/db/models";

export class EducationRepository {
    async findById(id: string): Promise<IEducation | null> {
        await connectDB();
        return Education.findById(id).exec();
    }

    async findAll(): Promise<IEducation[]> {
        await connectDB();
        return Education.find().sort({order: 1, startDate: -1}).exec();
    }

    async findFeatured(): Promise<IEducation[]> {
        await connectDB();
        return Education.find({featured: true})
            .sort({order: 1, startDate: -1})
            .exec();
    }

    async findByType(
        type: "diploma" | "certificate" | "course"
    ): Promise<IEducation[]> {
        await connectDB();
        return Education.find({"documents.type": type})
            .sort({order: 1, startDate: -1})
            .exec();
    }

    async create(data: Partial<IEducation>): Promise<IEducation> {
        await connectDB();
        return Education.create(data);
    }

    async update(
        id: string,
        data: Partial<IEducation>
    ): Promise<IEducation | null> {
        await connectDB();
        return Education.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    async delete(id: string): Promise<void> {
        await connectDB();
        await Education.deleteOne({_id: id});
    }

    async updateOrder(id: string, order: number): Promise<IEducation | null> {
        await connectDB();
        return Education.findByIdAndUpdate(id, {order}, {new: true}).exec();
    }
}

export const educationRepository = new EducationRepository();
