import {connectDB} from "../connect";
import {Consent, IConsent} from "@/lib/db/models";
import {AuditLog} from "@/lib/db/models";

/**
 * Consent Repository
 *
 * Лучшие практики:
 * - 152-ФЗ compliance: Логирование всех действий
 * - js-early-exit: Ранние возвраты
 * - Индексы для быстрого поиска
 */

export class ConsentRepository {
    /**
     * Найти согласие по ID
     */
    async findById(id: string): Promise<IConsent | null> {
        await connectDB();
        return Consent.findById(id).lean().exec();
    }

    /**
     * Найти все согласия пользователя
     */
    async findByUser(userId: string) {
        await connectDB();
        return Consent.find({user: userId})
            .sort({createdAt: -1})
            .lean()
            .exec();
    }

    /**
     * Найти активное согласие по типу
     */
    async findActiveByType(
        userId: string,
        type: IConsent["type"]
    ): Promise<IConsent | null> {
        await connectDB();
        return Consent.findOne({
            user: userId,
            type,
            given: true,
            withdrawn: {$ne: true},
        })
            .sort({createdAt: -1})
            .lean()
            .exec();
    }

    /**
     * Создать согласие
     */
    async create(data: Partial<IConsent>): Promise<IConsent> {
        await connectDB();

        // Проверка на дубликат (не даем создать если уже есть активное)
        if (!data.user || !data.type) {
            throw new Error("User и type обязательны");
        }

        const existing = await this.findActiveByType(
            data.user.toString(),
            data.type
        );

        if (existing) {
            throw new Error("Активное согласие уже существует");
        }

        return Consent.create(data);
    }

    /**
     * Отозвать согласие (152-ФЗ требование)
     */
    async withdraw(
        consentId: string,
        ipAddress: string,
        userAgent: string
    ): Promise<IConsent> {
        await connectDB();

        const consent = await Consent.findById(consentId).exec();

        if (!consent) {
            throw new Error("Согласие не найдено");
        }

        if (!consent.given || consent.withdrawn) {
            throw new Error("Согласие уже отозвано или не было дано");
        }

        consent.withdrawn = true;
        consent.withdrawnAt = new Date();
        consent.metadata = {
            ...consent.metadata,
            withdrawalIpAddress: ipAddress,
            withdrawalUserAgent: userAgent,
        };

        await consent.save();

        // Аудит (152-ФЗ)
        await AuditLog.create({
            userId: consent.user,
            action: "consent_withdrawn",
            entityType: "consent",
            entityId: consentId,
            details: {
                consentType: consent.type,
                ipAddress,
                userAgent,
            },
        });

        return consent;
    }

    /**
     * Отозвать все согласия пользователя
     */
    async withdrawAll(
        userId: string,
        ipAddress: string,
        userAgent: string
    ): Promise<number> {
        await connectDB();

        const consents = await Consent.find({
            user: userId,
            given: true,
            withdrawn: {$ne: true},
        }).exec();

        let withdrawnCount = 0;

        for (const consent of consents) {
            await this.withdraw(consent._id.toString(), ipAddress, userAgent);
            withdrawnCount++;
        }

        return withdrawnCount;
    }

    /**
     * Получить историю согласий пользователя
     */
    async getHistory(userId: string) {
        await connectDB();
        return Consent.find({user: userId})
            .sort({createdAt: -1})
            .populate("user", "email firstName lastName")
            .lean()
            .exec();
    }

    /**
     * Проверить наличие активного согласия
     */
    async hasActiveConsent(
        userId: string,
        type: IConsent["type"]
    ): Promise<boolean> {
        const consent = await this.findActiveByType(userId, type);
        return consent !== null;
    }

    /**
     * Получить статистику согласий
     */
    async getStatistics() {
        await connectDB();

        const [
            total,
            active,
            withdrawn,
            byType,
        ] = await Promise.all([
            Consent.countDocuments({}).exec(),
            Consent.countDocuments({
                given: true,
                withdrawn: {$ne: true},
            }).exec(),
            Consent.countDocuments({withdrawn: true}).exec(),
            Consent.aggregate([
                {
                    $group: {
                        _id: "$type",
                        total: {$sum: 1},
                        active: {
                            $sum: {
                                $cond: [
                                    {$and: ["$given", {$ne: ["$withdrawn", true]}]},
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]).exec(),
        ]);

        return {
            total,
            active,
            withdrawn,
            byType: byType.reduce(
                (acc, item: {_id: string; total: number; active: number}) => {
                    acc[item._id] = {
                        total: item.total,
                        active: item.active,
                    };
                    return acc;
                },
                {} as Record<string, {total: number; active: number}>
            ),
        };
    }

    /**
     * Получить согласия для экспорта (152-ФЗ)
     */
    async getForExport(startDate: Date, endDate: Date) {
        await connectDB();
        return Consent.find({
            createdAt: {$gte: startDate, $lte: endDate},
        })
            .populate("user", "email firstName lastName phone")
            .sort({createdAt: 1})
            .lean()
            .exec();
    }

    /**
     * Удалить старые отозванные согласия (GDPR)
     */
    async deleteOldWithdrawn(yearsAgo: number = 3): Promise<number> {
        await connectDB();

        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsAgo);

        const result = await Consent.deleteMany({
            withdrawn: true,
            withdrawnAt: {$lte: cutoffDate},
        }).exec();

        return result.deletedCount || 0;
    }
}

// Singleton
export const consentRepository = new ConsentRepository();
