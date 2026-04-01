import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        "MONGODB_URI is not defined. Please add it to your .env.local file."
    );
}

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
            .connect(MONGODB_URI!, {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 10000, // Увеличено с 5000 до 10000
                socketTimeoutMS: 60000, // Увеличено с 45000 до 60000
                connectTimeoutMS: 30000, // Добавлен таймаут подключения
                family: 4, // IPv4
                retryWrites: true,
                retryReads: true,
            })
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
