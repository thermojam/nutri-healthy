import { NextResponse } from "next/server";
import { testimonialRepository } from "@/lib/db/repositories/testimonial.repository";

/**
 * GET /api/testimonials
 * Получение списка отзывов
 */
export async function GET() {
  try {
    const testimonials = await testimonialRepository.findFeatured(6);
    
    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("❌ Failed to fetch testimonials:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Не удалось загрузить отзывы" 
      },
      { status: 500 }
    );
  }
}
