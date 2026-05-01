import { connectDB } from "../connect";
import { Webinar, IWebinar } from "@/lib/db/models";

export class WebinarRepository {
  async findById(id: string): Promise<IWebinar | null> {
    await connectDB();
    return Webinar.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<IWebinar | null> {
    await connectDB();
    return Webinar.findOne({ slug, published: true }).exec();
  }

  async findPublished(limit: number = 10): Promise<IWebinar[]> {
    await connectDB();
    return Webinar.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findFeatured(limit: number = 1): Promise<IWebinar[]> {
    await connectDB();
    return Webinar.find({ published: true, featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(data: Partial<IWebinar>): Promise<IWebinar> {
    await connectDB();
    return Webinar.create(data);
  }

  async update(slug: string, data: Partial<IWebinar>): Promise<IWebinar | null> {
    await connectDB();
    return Webinar.findOneAndUpdate({ slug }, data, { new: true }).exec();
  }

  async delete(slug: string): Promise<void> {
    await connectDB();
    await Webinar.deleteOne({ slug });
  }
}

export const webinarRepository = new WebinarRepository();
