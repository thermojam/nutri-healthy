import {NextResponse} from "next/server";
import {webinarRepository} from "@/lib/db/repositories/webinar.repository";
import {metricsCollector} from "@/lib/metrics";

/**
 * GET /api/webinars?limit=1&featured=true
 * Получение списка вебинаров
 * @param limit - количество вебинаров (по умолчанию 10, для главной используй featured=true)
 * @param featured - только избранные вебинары
 */
export async function GET(request: Request) {
    const startTime = Date.now();
    try {
        const {searchParams} = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const featured = searchParams.get("featured") === "true";

        const webinars = featured
            ? await webinarRepository.findFeatured(limit)
            : await webinarRepository.findPublished(limit);

        const duration = Date.now() - startTime;
        metricsCollector.recordRequest('/api/webinars', 'GET', 200, duration);

        return NextResponse.json({
            success: true,
            data: webinars,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ Failed to fetch webinars:", error);
        metricsCollector.recordRequest('/api/webinars', 'GET', 500, duration, 'Failed to fetch webinars');

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить вебинары"
            },
            {status: 500}
        );
    }
}
