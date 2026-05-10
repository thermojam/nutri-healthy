import {NextResponse} from "next/server";
import {educationRepository} from "@/lib/db/repositories/education.repository";
import {metricsCollector} from "@/lib/metrics";

/**
 * GET /api/education
 * Получение списка записей об образовании
 */
export async function GET() {
    const startTime = Date.now();
    try {
        const education = await educationRepository.findAll();

        const duration = Date.now() - startTime;
        metricsCollector.recordRequest('/api/education', 'GET', 200, duration);

        return NextResponse.json({
            success: true,
            data: education,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ Failed to fetch education:", error);
        metricsCollector.recordRequest('/api/education', 'GET', 500, duration, 'Failed to fetch education');

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить образование"
            },
            {status: 500}
        );
    }
}
