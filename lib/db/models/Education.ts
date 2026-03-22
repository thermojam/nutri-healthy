import mongoose, {Document, Schema} from "mongoose";

export interface IEducation extends Document {
    title: string;
    institution: string;
    degree?: string;
    specialty: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description?: string;
    documents: { type: "diploma" | "certificate" | "course"; url: string; name: string }[];
    order: number;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
    {
        title: {type: String, required: true},
        institution: {type: String, required: true},
        degree: String,
        specialty: {type: String, required: true},
        startDate: {type: Date, required: true},
        endDate: Date,
        isCurrent: {type: Boolean, default: false},
        description: String,
        documents: [
            {
                type: {type: String, enum: ["diploma", "certificate", "course"], required: true},
                url: {type: String, required: true},
                name: {type: String, required: true},
            },
        ],
        order: {type: Number, default: 0, index: true},
        featured: {type: Boolean, default: false, index: true},
    },
    {timestamps: true}
);

EducationSchema.index({order: 1});
EducationSchema.index({featured: 1});

export const Education =
    mongoose.models.Education || mongoose.model<IEducation>("Education", EducationSchema);
