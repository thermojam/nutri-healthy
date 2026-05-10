import {NextResponse} from "next/server";
import {serviceRepository} from "@/lib/db/repositories/service.repository";
import {metricsCollector} from "@/lib/metrics";

/**
 * GET /api/services
 * Получение списка услуг
 */
export async function GET() {
    const startTime = Date.now();
    try {
        const services = await serviceRepository.findAll();

        const duration = Date.now() - startTime;
        metricsCollector.recordRequest('/api/services', 'GET', 200, duration);

        return NextResponse.json({
            success: true,
            data: services,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("❌ Failed to fetch services:", error);
        metricsCollector.recordRequest('/api/services', 'GET', 500, duration, 'Failed to fetch services');

        return NextResponse.json(
            {
                success: false,
                error: "Не удалось загрузить услуги"
            },
            {status: 500}
        );
    }
}
