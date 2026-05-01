import {NextResponse} from "next/server";
import {webinarRepository} from "@/lib/db/repositories/webinar.repository";

/**
 * GET /api/webinars?limit=1&featured=true
 * Получение списка вебинаров
 * @param limit - количество вебинаров (по умолчанию 10, для главной используй featured=true)
 * @param featured - только избранные вебинары
 */
export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const featured = searchParams.get("featured") === "true";

        const webinars = featured
            ? await webinarRepository.findFeatured(limit)
            : await webinarRepository.findPublished(limit);

        return NextResponse.json({
            success: true,
            data: webinars,
        });
    } catch (error) {
        console.error("❌ Failed to fetch webinars:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить вебинары"
            },
            {status: 500}
        );
    }
}
