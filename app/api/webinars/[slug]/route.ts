import {NextRequest, NextResponse} from "next/server";
import {webinarRepository} from "@/lib/db/repositories/webinar.repository";

/**
 * GET /api/webinars/[slug]
 * Получение вебинара по slug
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

        const webinar = await webinarRepository.findBySlug(slug);

        if (!webinar) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Вебинар не найден"
                },
                {status: 404}
            );
        }

        return NextResponse.json({
            success: true,
            data: webinar,
        });
    } catch (error) {
        console.error("❌ Failed to fetch webinar:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить вебинар"
            },
            {status: 500}
        );
    }
}
