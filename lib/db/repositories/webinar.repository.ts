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
      .sort({ publishedAt: -1, order: 1 })
      .limit(limit)
      .exec();
  }

  async findFeatured(limit: number = 1): Promise<IWebinar[]> {
    await connectDB();
    return Webinar.find({ published: true, featured: true })
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async findFreeWebinars(): Promise<IWebinar[]> {
    await connectDB();
    return Webinar.find({ published: true, accessType: "free" })
      .sort({ publishedAt: -1 })
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

  async updateViews(slug: string): Promise<void> {
    await connectDB();
    await Webinar.updateOne({ slug }, { $inc: { views: 1 } });
  }
}

export const webinarRepository = new WebinarRepository();
