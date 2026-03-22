import { NextResponse } from "next/server";
import { educationRepository } from "@/lib/db/repositories/education.repository";

/**
 * GET /api/education
 * Получение списка записей об образовании
 */
export async function GET() {
  try {
    const education = await educationRepository.findAll();
    
    return NextResponse.json({
      success: true,
      data: education,
    });
  } catch (error) {
    console.error("❌ Failed to fetch education:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Не удалось загрузить образование" 
      },
      { status: 500 }
    );
  }
}
