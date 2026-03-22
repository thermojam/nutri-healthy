import {connectDB} from "../connect";
import {Testimonial, ITestimonial} from "../models/Testimonial";

export class TestimonialRepository {
    async findById(id: string): Promise<ITestimonial | null> {
        await connectDB();
        return Testimonial.findById(id).exec();
    }

    async findPublished(limit: number = 10): Promise<ITestimonial[]> {
        await connectDB();
        return Testimonial.find({published: true})
            .sort({publishedAt: -1, order: 1})
            .limit(limit)
            .exec();
    }

    async findFeatured(limit: number = 6): Promise<ITestimonial[]> {
        await connectDB();
        return Testimonial.find({published: true, featured: true})
            .sort({order: 1, rating: -1})
            .limit(limit)
            .exec();
    }

    async findByService(serviceId: string): Promise<ITestimonial[]> {
        await connectDB();
        return Testimonial.find({published: true, serviceId})
            .sort({publishedAt: -1})
            .exec();
    }

    async findByRating(minRating: number): Promise<ITestimonial[]> {
        await connectDB();
        return Testimonial.find({published: true, rating: {$gte: minRating}})
            .sort({rating: -1, publishedAt: -1})
            .exec();
    }

    async create(data: Partial<ITestimonial>): Promise<ITestimonial> {
        await connectDB();
        return Testimonial.create(data);
    }

    async update(
        id: string,
        data: Partial<ITestimonial>
    ): Promise<ITestimonial | null> {
        await connectDB();
        return Testimonial.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    async delete(id: string): Promise<void> {
        await connectDB();
        await Testimonial.deleteOne({_id: id});
    }

    async getTestimonialsCount(): Promise<number> {
        await connectDB();
        return Testimonial.countDocuments({published: true});
    }
}

export const testimonialRepository = new TestimonialRepository();
