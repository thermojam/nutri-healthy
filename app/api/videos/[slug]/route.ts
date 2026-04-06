import {NextRequest, NextResponse} from "next/server";
import {videoRepository} from "@/lib/db/repositories/video.repository";

/**
 * GET /api/videos/[slug]
 * Получение видео по slug
 */
export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ slug: string }> }
) {
    try {
        const {slug} = await params;

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Slug не указан"
                },
                {status: 400}
            );
        }

        const video = await videoRepository.findBySlug(slug);

        if (!video) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Видео не найдено"
                },
                {status: 404}
            );
        }

        // Увеличиваем счетчик просмотров
        await videoRepository.updateViews(slug);

        return NextResponse.json({
            success: true,
            data: video,
        });
    } catch (error) {
        console.error("❌ Failed to fetch video:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить видео"
            },
            {status: 500}
        );
    }
}
