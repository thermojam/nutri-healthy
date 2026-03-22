import { NextResponse } from "next/server";
import { serviceRepository } from "@/lib/db/repositories/service.repository";

/**
 * GET /api/services
 * Получение списка услуг
 */
export async function GET() {
  try {
    const services = await serviceRepository.findAll();
    
    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("❌ Failed to fetch services:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Не удалось загрузить услуги" 
      },
      { status: 500 }
    );
  }
}
