import {NextResponse} from "next/server";
import {articleRepository} from "@/lib/db/repositories/article.repository";

/**
 * GET /api/articles
 * Получение списка статей
 */
export async function GET() {
    try {
        const articles = await articleRepository.findFeatured(3);

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
