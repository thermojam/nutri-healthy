import {NextRequest, NextResponse} from "next/server";
import {serviceRepository} from "@/lib/db/repositories/service.repository";

/**
 * GET /api/services/[slug]
 * Получение услуги по slug
 */
export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ slug: string }> }
) {
    try {
        const {slug} = await params;
        const service = await serviceRepository.findBySlug(slug);

        if (!service) {
            return NextResponse.json(
                {success: false, error: "Услуга не найдена"},
                {status: 404}
            );
        }

        return NextResponse.json({
            success: true,
            data: service,
        });
    } catch (error) {
        console.error("❌ Failed to fetch service:", error);
        return NextResponse.json(
            {success: false, error: "Не удалось загрузить услугу"},
            {status: 500}
        );
    }
}
