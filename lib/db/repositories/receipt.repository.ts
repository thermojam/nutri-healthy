import {connectDB} from "../connect";
import {Receipt, IReceipt} from "../models/Receipt";

/**
 * Receipt Repository
 * 
 * Лучшие практики:
 * - js-early-exit: Ранние возвраты
 * - Индексы для 54-ФЗ compliance
 */

export class ReceiptRepository {
    /**
     * Найти чек по ID
     */
    async findById(id: string): Promise<IReceipt | null> {
        await connectDB();
        return Receipt.findById(id).lean().exec();
    }

    /**
     * Найти чек по ID заказа
     */
    async findByOrderId(orderId: string): Promise<IReceipt | null> {
        await connectDB();
        return Receipt.findOne({order: orderId}).lean().exec();
    }

    /**
     * Создать чек
     */
    async create(data: Partial<IReceipt>): Promise<IReceipt> {
        await connectDB();
        return Receipt.create(data);
    }

    /**
     * Обновить статус чека
     */
    async updateStatus(
        id: string,
        status: IReceipt["status"],
        fiscalData?: any
    ): Promise<IReceipt | null> {
        await connectDB();

        const update: any = {status};

        if (fiscalData) {
            update.fiscalData = fiscalData;
        }

        if (status === "sent") {
            update.sentAt = new Date();
        }

        return Receipt.findByIdAndUpdate(id, update, {new: true}).exec();
    }

    /**
     * Отметить чек как отправленный
     */
    async markAsSent(id: string, fiscalData: any): Promise<IReceipt | null> {
        await connectDB();

        return Receipt.findByIdAndUpdate(
            id,
            {
                status: "sent",
                fiscalData,
                sentAt: new Date(),
            },
            {new: true}
        ).exec();
    }

    /**
     * Найти чеки по статусу (для отправки)
     */
    async findByStatus(
        status: IReceipt["status"],
        limit: number = 100
    ) {
        await connectDB();
        return Receipt.find({status})
            .sort({createdAt: 1}) // Сначала старые
            .limit(limit)
            .lean()
            .exec();
    }

    /**
     * Получить статистику по чекам
     */
    async getStatistics(period: "day" | "week" | "month" | "all" = "all") {
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

        const [total, sent, pending, failed] = await Promise.all([
            Receipt.countDocuments(matchStage).exec(),
            Receipt.countDocuments({...matchStage, status: "sent"}).exec(),
            Receipt.countDocuments({...matchStage, status: "pending"}).exec(),
            Receipt.countDocuments({...matchStage, status: "failed"}).exec(),
        ]);

        return {
            total,
            sent,
            pending,
            failed,
            period,
        };
    }

    /**
     * Получить чеки пользователя
     */
    async getUserReceipts(userId: string, limit: number = 20) {
        await connectDB();
        return Receipt.find({user: userId})
            .sort({createdAt: -1})
            .limit(limit)
            .lean()
            .exec();
    }

    /**
     * Получить количество чеков
     */
    async getCount(status?: IReceipt["status"]): Promise<number> {
        await connectDB();
        const query = status ? {status} : {};
        return Receipt.countDocuments(query).exec();
    }
}

// Singleton
export const receiptRepository = new ReceiptRepository();
