import mongoose from "mongoose";
import {databaseConfig, validateDatabaseConfig} from "@/config/database";

// Валидация конфигурации при инициализации
validateDatabaseConfig();

const MONGODB_URI = databaseConfig.uri;

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || {conn: null, promise: null};

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, databaseConfig.options)
            .then((mongoose) => {
                console.log("✅ MongoDB connected successfully");
                return mongoose;
            })
            .catch((error) => {
                console.error("❌ MongoDB connection error:", error);
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
