import {connectDB} from "../connect";
import {User, IUser} from "../models/User";
import {Consent} from "@/lib/db/models";
import {Order} from "../models/Order";

/**
 * User Repository
 *
 * Лучшие практики:
 * - Ранние возвраты (js-early-exit)
 * - Кэширование результатов (server-cache-lru)
 * - Индексы для производительности
 */

// LRU кэш для пользователей (in-memory)
const userCache = new Map<string, IUser & {cachedAt: number}>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

export class UserRepository {
    /**
     * Найти пользователя по ID с кэшированием
     */
    async findById(id: string): Promise<IUser | null> {
        // Проверка кэша
        const cached = userCache.get(id);
        if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
            return cached;
        }

        await connectDB();
        const user = await User.findById(id).lean().exec();

        if (user) {
            userCache.set(id, {...user, cachedAt: Date.now()});
        }

        return user;
    }

    /**
     * Найти пользователя по email
     */
    async findByEmail(email: string): Promise<IUser | null> {
        await connectDB();
        return User.findOne({email: email.toLowerCase()}).lean().exec();
    }

    /**
     * Найти пользователя по телефону
     */
    async findByPhone(phone: string): Promise<IUser | null> {
        await connectDB();
        return User.findOne({phone}).lean().exec();
    }

    /**
     * Создать нового пользователя
     */
    async create(data: Partial<IUser>): Promise<IUser> {
        await connectDB();

        // Проверка на дубликат email
        const existing = await this.findByEmail(data.email!);
        if (existing) {
            throw new Error("Пользователь с таким email уже существует");
        }

        const user = await User.create(data);

        // Очистка кэша
        userCache.clear();

        return user;
    }

    /**
     * Обновить пользователя
     */
    async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
        await connectDB();
        const user = await User.findByIdAndUpdate(
            id,
            data,
            {new: true, runValidators: true}
        ).lean().exec();

        if (user) {
            userCache.set(id, {...user, cachedAt: Date.now()});
        }

        return user;
    }

    /**
     * Обновить последнее посещение
     */
    async updateLastLogin(id: string): Promise<void> {
        await connectDB();
        await User.findByIdAndUpdate(id, {
            lastLoginAt: new Date(),
        }).exec();
    }

    /**
     * Получить все согласия пользователя
     */
    async getConsents(userId: string) {
        await connectDB();
        return Consent.find({user: userId})
            .sort({createdAt: -1})
            .lean()
            .exec();
    }

    /**
     * Отозвать согласие (152-ФЗ)
     */
    async withdrawConsent(
        userId: string,
        consentType: string,
        ipAddress: string,
        userAgent: string
    ): Promise<void> {
        await connectDB();

        const consent = await Consent.findOne({
            user: userId,
            type: consentType,
            given: true,
            withdrawn: {$ne: true},
        }).exec();

        if (!consent) {
            throw new Error("Согласие не найдено");
        }

        consent.withdrawn = true;
        consent.withdrawnAt = new Date();
        consent.metadata = {
            ...consent.metadata,
            withdrawalIpAddress: ipAddress,
            withdrawalUserAgent: userAgent,
        };

        await consent.save();

        // Обновление пользователя
        if (consentType === "personal_data") {
            await User.findByIdAndUpdate(userId, {
                "consents.personalData.withdrawn": true,
                "consents.personalData.withdrawnAt": new Date(),
            }).exec();
        }

        // Очистка кэша
        userCache.delete(userId);
    }

    /**
     * Получить заказы пользователя
     */
    async getUserOrders(
        userId: string,
        limit: number = 10,
        page: number = 1
    ) {
        await connectDB();

        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            Order.find({user: userId})
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
                .populate("service", "title slug")
                .lean()
                .exec(),
            Order.countDocuments({user: userId}),
        ]);

        return {
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Получить статистику пользователя
     */
    async getUserStats(userId: string) {
        await connectDB();

        const [ordersCount, totalSpent] = await Promise.all([
            Order.countDocuments({user: userId}),
            Order.aggregate([
                {$match: {user: userId}},
                {$group: {_id: null, total: {$sum: "$price"}}},
            ]).exec(),
        ]);

        return {
            ordersCount,
            totalSpent: totalSpent[0]?.total || 0,
        };
    }

    /**
     * Удалить пользователя (GDPR/152-ФЗ)
     */
    async delete(userId: string): Promise<void> {
        await connectDB();

        // Транзакция для согласованности
        const session = await User.startSession();
        session.startTransaction();

        try {
            // Удаление согласий
            await Consent.deleteMany({user: userId}, {session});

            // Анонимизация заказов (не удаляем, но обезличиваем)
            await Order.updateMany(
                {user: userId},
                {
                    $set: {
                        "client.firstName": "Удален",
                        "client.lastName": "Пользователь",
                        "client.email": "deleted@example.com",
                    },
                    $unset: {user: ""},
                },
                {session}
            );

            // Удаление пользователя
            await User.findByIdAndDelete(userId, {session});

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        // Очистка кэша
        userCache.clear();
    }

    /**
     * Получить количество пользователей
     */
    async getCount(): Promise<number> {
        await connectDB();
        return User.countDocuments({}).exec();
    }

    /**
     * Найти пользователей по роли
     */
    async findByRole(role: "client" | "admin", limit: number = 50) {
        await connectDB();
        return User.find({role})
            .select("-consents -preferences") // Не возвращаем чувствительные данные
            .sort({createdAt: -1})
            .limit(limit)
            .lean()
            .exec();
    }
}

// Singleton экземпляр
export const userRepository = new UserRepository();
