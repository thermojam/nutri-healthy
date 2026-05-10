import {NextResponse} from "next/server";
import {caseRepository} from "@/lib/db/repositories/case.repository";
import {metricsCollector} from "@/lib/metrics";

/**
 * GET /api/cases
 * Получение списка кейсов
 */
export async function GET() {
    const startTime = Date.now();
    try {
        const cases = await caseRepository.findFeatured(5);

        const duration = Date.now() - startTime;
        metricsCollector.recordRequest('/api/cases', 'GET', 200, duration);

        return NextResponse.json({
            success: true,
            data: cases,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ Failed to fetch cases:", error);
        metricsCollector.recordRequest('/api/cases', 'GET', 500, duration, 'Failed to fetch cases');

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить кейсы"
            },
            {status: 500}
        );
    }
}
