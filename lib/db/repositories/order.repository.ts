import {connectDB} from "../connect";
import {Order, IOrder} from "../models/Order";
import {User} from "../models/User";
import {Service} from "@/lib/db/models";

/**
 * Order Repository
 *
 * Лучшие практики:
 * - async-parallel: Параллельные запросы для независимых операций
 * - js-early-exit: Ранние возвраты
 * - server-cache-lru: Кэширование статистики
 */

// Кэш для статистики
const statsCache = new Map<string, {data: any; cachedAt: number}>();
const STATS_CACHE_TTL = 2 * 60 * 1000; // 2 минуты

export class OrderRepository {
    /**
     * Найти заказ по ID
     */
    async findById(id: string): Promise<IOrder | null> {
        await connectDB();
        return Order.findById(id)
            .populate("user", "email firstName lastName phone")
            .populate("service", "title slug category")
            .lean()
            .exec();
    }

    /**
     * Создать заказ
     */
    async create(data: Partial<IOrder>): Promise<IOrder> {
        await connectDB();

        // Проверка существования услуги
        if (data.service) {
            const service = await Service.findById(data.service).exec();
            if (!service || !service.available) {
                throw new Error("Услуга недоступна");
            }
        }

        // Проверка существования пользователя
        if (data.user) {
            const user = await User.findById(data.user).exec();
            if (!user) {
                throw new Error("Пользователь не найден");
            }
        }

        const order = await Order.create(data);

        // Очистка кэша статистики
        statsCache.clear();

        return order;
    }

    /**
     * Обновить статус заказа
     */
    async updateStatus(
        id: string,
        status: IOrder["status"],
        metadata?: Record<string, any>
    ): Promise<IOrder | null> {
        await connectDB();

        const update: any = {status};

        if (metadata) {
            update.metadata = metadata;
        }

        return Order.findByIdAndUpdate(
            id,
            update,
            {new: true, runValidators: true}
        )
            .populate("user", "email firstName lastName")
            .populate("service", "title")
            .exec();
    }

    /**
     * Найти заказы пользователя
     */
    async findByUser(
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
                .populate("service", "title slug image")
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
     * Найти заказы по статусу
     */
    async findByStatus(
        status: IOrder["status"],
        limit: number = 50
    ) {
        await connectDB();
        return Order.find({status})
            .sort({createdAt: -1})
            .limit(limit)
            .populate("user", "email firstName lastName phone")
            .populate("service", "title")
            .lean()
            .exec();
    }

    /**
     * Получить статистику заказов
     */
    async getStatistics(period: "day" | "week" | "month" | "all" = "all") {
        const cacheKey = `stats_${period}`;
        const cached = statsCache.get(cacheKey);

        if (cached && Date.now() - cached.cachedAt < STATS_CACHE_TTL) {
            return cached.data;
        }

        await connectDB();

        const now = new Date();
        let startDate: Date | undefined = undefined;

        if (period !== "all") {
            startDate = new Date(now);
            switch (period) {
                case "day":
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case "week":
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case "month":
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
            }
        }

        const matchStage: any = {};
        if (startDate) {
            matchStage.createdAt = {$gte: startDate};
        }

        const [
            totalOrders,
            totalRevenue,
            statusBreakdown,
            recentOrders,
        ] = await Promise.all([
            Order.countDocuments(matchStage).exec(),
            Order.aggregate([
                {$match: matchStage},
                {$group: {_id: null, total: {$sum: "$price"}}},
            ]).exec(),
            Order.aggregate([
                {$match: matchStage},
                {$group: {_id: "$status", count: {$sum: 1}}},
            ]).exec(),
            Order.find(matchStage)
                .sort({createdAt: -1})
                .limit(10)
                .populate("user", "firstName lastName")
                .populate("service", "title")
                .lean()
                .exec(),
        ]);

        const stats = {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            statusBreakdown: statusBreakdown.reduce(
                (acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                },
                {} as Record<string, number>
            ),
            recentOrders,
            period,
            updatedAt: new Date(),
        };

        statsCache.set(cacheKey, {data: stats, cachedAt: Date.now()});

        return stats;
    }

    /**
     * Получить заказы для админки (с пагинацией и фильтрами)
     */
    async getAdminOrders({
        page = 1,
        limit = 20,
        status,
        userId,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
    }: {
        page?: number;
        limit?: number;
        status?: IOrder["status"];
        userId?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }) {
        await connectDB();

        const skip = (page - 1) * limit;
        const query: any = {};

        // Фильтры
        if (status) query.status = status;
        if (userId) query.user = userId;

        // Поиск по email или имени
        if (search) {
            const users = await User.find({
                $or: [
                    {email: {$regex: search, $options: "i"}},
                    {firstName: {$regex: search, $options: "i"}},
                    {lastName: {$regex: search, $options: "i"}},
                ],
            })
                .limit(100)
                .select("_id")
                .lean()
                .exec();

            query.user = {$in: users.map((u) => u._id)};
        }

        const sortOption: any = {[sortBy]: sortOrder === "asc" ? 1 : -1};

        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .populate("user", "email firstName lastName phone")
                .populate("service", "title slug")
                .lean()
                .exec(),
            Order.countDocuments(query),
        ]);

        return {
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        };
    }

    /**
     * Удалить заказ (только если статус позволяет)
     */
    async delete(id: string): Promise<void> {
        await connectDB();

        const order = await Order.findById(id).exec();
        if (!order) {
            throw new Error("Заказ не найден");
        }

        // Нельзя удалить оплаченный заказ
        if (["paid", "completed", "in_progress"].includes(order.status)) {
            throw new Error("Нельзя удалить оплаченный заказ");
        }

        await Order.findByIdAndDelete(id).exec();

        // Очистка кэша
        statsCache.clear();
    }

    /**
     * Получить количество заказов
     */
    async getCount(status?: IOrder["status"]): Promise<number> {
        await connectDB();

        const query = status ? {status} : {};
        return Order.countDocuments(query).exec();
    }

    /**
     * Обновить метаданные заказа
     */
    async updateMetadata(
        id: string,
        metadata: Record<string, any>
    ): Promise<IOrder | null> {
        await connectDB();

        return Order.findByIdAndUpdate(
            id,
            {$set: {metadata}},
            {new: true}
        ).exec();
    }
}

// Singleton экземпляр
export const orderRepository = new OrderRepository();
