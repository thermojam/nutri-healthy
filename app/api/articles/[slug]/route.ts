import {NextRequest, NextResponse} from "next/server";
import {articleRepository} from "@/lib/db/repositories/article.repository";

/**
 * GET /api/articles/[slug]
 * Получение статьи по slug
 */
export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ slug: string }> }
) {
    try {
        const {slug} = await params;
        const article = await articleRepository.findBySlug(slug);

        if (!article) {
            return NextResponse.json(
                {success: false, error: "Статья не найдена"},
                {status: 404}
            );
        }

        return NextResponse.json({
            success: true,
            data: article,
        });
    } catch (error) {
        console.error("❌ Failed to fetch article:", error);
        return NextResponse.json(
            {success: false, error: "Не удалось загрузить статью"},
            {status: 500}
        );
    }
}
