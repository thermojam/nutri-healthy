import {NextResponse} from "next/server";
import {articleRepository} from "@/lib/db/repositories/article.repository";
import {metricsCollector} from "@/lib/metrics";

/**
 * GET /api/articles?limit=3&featured=true
 * Получение списка статей
 * @param limit - количество статей (по умолчанию 10, для главной используй featured=true)
 * @param featured - только избранные статьи
 */
export async function GET(request: Request) {
    const startTime = Date.now();
    try {
        const {searchParams} = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const featured = searchParams.get("featured") === "true";

        const articles = featured
            ? await articleRepository.findFeatured(limit)
            : await articleRepository.findPublished(limit);

        const duration = Date.now() - startTime;
        metricsCollector.recordRequest('/api/articles', 'GET', 200, duration);

        return NextResponse.json({
            success: true,
            data: articles,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ Failed to fetch articles:", error);
        metricsCollector.recordRequest('/api/articles', 'GET', 500, duration, 'Failed to fetch articles');

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить статьи"
            },
            {status: 500}
        );
    }
}
