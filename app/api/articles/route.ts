import {NextResponse} from "next/server";
import {articleRepository} from "@/lib/db/repositories/article.repository";

/**
 * GET /api/articles?limit=3&featured=true
 * Получение списка статей
 * @param limit - количество статей (по умолчанию 10, для главной используй featured=true)
 * @param featured - только избранные статьи
 */
export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const featured = searchParams.get("featured") === "true";

        const articles = featured
            ? await articleRepository.findFeatured(limit)
            : await articleRepository.findPublished(limit);

        return NextResponse.json({
            success: true,
            data: articles,
        });
    } catch (error) {
        console.error("❌ Failed to fetch articles:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить статьи"
            },
            {status: 500}
        );
    }
}
