import {NextResponse} from "next/server";
import {videoRepository} from "@/lib/db/repositories/video.repository";

/**
 * GET /api/videos?limit=3&featured=true
 * Получение списка видео
 * @param limit - количество видео (по умолчанию 10, для главной используй featured=true)
 * @param featured - только избранные видео
 */
export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const featured = searchParams.get("featured") === "true";

        const videos = featured
            ? await videoRepository.findFeatured(limit)
            : await videoRepository.findPublished(limit);

        return NextResponse.json({
            success: true,
            data: videos,
        });
    } catch (error) {
        console.error("❌ Failed to fetch videos:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить видео"
            },
            {status: 500}
        );
    }
}
