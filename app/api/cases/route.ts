import {NextResponse} from "next/server";
import {caseRepository} from "@/lib/db/repositories/case.repository";

/**
 * GET /api/cases
 * Получение списка кейсов
 */
export async function GET() {
    try {
        const cases = await caseRepository.findFeatured(5);

        return NextResponse.json({
            success: true,
            data: cases,
        });
    } catch (error) {
        console.error("❌ Failed to fetch cases:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить кейсы"
            },
            {status: 500}
        );
    }
}
