import mongoose, {Document, Schema} from "mongoose";

export interface ITestimonial extends Document {
    author: { name: string; photo?: string; anonymized: boolean };
    serviceId?: mongoose.Types.ObjectId;
    serviceName: string;
    rating: number;
    title: string;
    content: string;
    verified: boolean;
    orderId?: mongoose.Types.ObjectId;
    published: boolean;
    publishedAt?: Date;
    consentGiven: boolean;
    consentDate?: Date;
    video?: { url: string; thumbnail: string; duration: number };
    order: number;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        author: {
            name: {type: String, required: true},
            photo: String,
            anonymized: {type: Boolean, default: false},
        },
        serviceId: {type: Schema.Types.ObjectId, ref: "Service"},
        serviceName: {type: String, required: true},
        rating: {type: Number, required: true, min: 1, max: 5},
        title: {type: String, required: true},
        content: {type: String, required: true},
        verified: {type: Boolean, default: false},
        orderId: {type: Schema.Types.ObjectId, ref: "Order"},
        published: {type: Boolean, default: false, index: true},
        publishedAt: Date,
        consentGiven: {type: Boolean, required: true, default: false},
        consentDate: Date,
        video: {url: String, thumbnail: String, duration: Number},
        order: {type: Number, default: 0},
        featured: {type: Boolean, default: false, index: true},
    },
    {timestamps: true}
);

TestimonialSchema.index({published: 1, publishedAt: -1});
TestimonialSchema.index({rating: -1});
TestimonialSchema.index({serviceId: 1});
TestimonialSchema.index({featured: 1});

export const Testimonial =
    mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
