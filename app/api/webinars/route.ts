import { NextResponse } from "next/server";
import { webinarRepository } from "@/lib/db/repositories/webinar.repository";

/**
 * GET /api/webinars
 * Получение списка вебинаров
 */
export async function GET() {
  try {
    const webinars = await webinarRepository.findFeatured(1);
    
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
      { status: 500 }
    );
  }
}
