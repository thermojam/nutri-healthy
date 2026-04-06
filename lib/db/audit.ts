import {headers} from "next/headers";
import {connectDB} from "./connect";
import {AuditLog, IAuditLog} from "./models/AuditLog";
import {Types} from "mongoose";

export interface CreateAuditLogParams {
    userId?: string;
    action: IAuditLog["action"];
    entityType: IAuditLog["entityType"];
    entityId: string;
    details?: Record<string, unknown>;
}

/**
 * Получить IP адрес клиента (с учетом прокси)
 */
export async function getClientIP(): Promise<string> {
    const headersList = await headers();

    // Проверка различных заголовков для определения реального IP
    const forwarded = headersList.get("x-forwarded-for");
    const realIP = headersList.get("x-real-ip");

    if (forwarded) {
        // X-Forwarded-For может содержать несколько IP, берем первый
        return forwarded.split(",")[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return "127.0.0.1"; // Fallback для локальной разработки
}

/**
 * Получить User-Agent из заголовков
 */
export async function getUserAgent(): Promise<string> {
    const headersList = await headers();
    return headersList.get("user-agent") || "Unknown";
}

/**
 * Создать запись в журнале аудита (152-ФЗ требование)
 */
export async function createAuditLog({
                                         userId,
                                         action,
                                         entityType,
                                         entityId,
                                         details = {},
                                     }: CreateAuditLogParams): Promise<void> {
    try {
        await connectDB();

        const ipAddress = await getClientIP();
        const userAgent = await getUserAgent();

        await AuditLog.create({
            userId: userId ? new Types.ObjectId(userId) : undefined,
            action,
            entityType,
            entityId: new Types.ObjectId(entityId),
            details,
            ipAddress,
            userAgent,
        });

        console.log(`✅ Audit log created: ${action} for ${entityType}:${entityId}`);
    } catch (error) {
        console.error("❌ Failed to create audit log:", error);
        // Не выбрасываем ошибку, чтобы не ломать основной поток
    }
}

/**
 * Получить историю аудита для пользователя
 */
export async function getUserAuditHistory(
    userId: string,
    limit: number = 50
) {
    try {
        await connectDB();

        return await AuditLog.find({userId: new Types.ObjectId(userId)})
            .sort({createdAt: -1})
            .limit(limit)
            .lean();
    } catch (error) {
        console.error("❌ Failed to get user audit history:", error);
        return [];
    }
}

/**
 * Получить историю аудита для сущности
 */
export async function getEntityAuditHistory(
    entityType: string,
    entityId: string,
    limit: number = 50
) {
    try {
        await connectDB();

        return await AuditLog.find({
            entityType: entityType as IAuditLog["entityType"],
            entityId: new Types.ObjectId(entityId),
        })
            .sort({createdAt: -1})
            .limit(limit)
            .lean();
    } catch (error) {
        console.error("❌ Failed to get entity audit history:", error);
        return [];
    }
}
