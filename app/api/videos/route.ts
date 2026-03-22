import { NextResponse } from "next/server";
import { videoRepository } from "@/lib/db/repositories/video.repository";

/**
 * GET /api/videos
 * Получение списка видео
 */
export async function GET() {
  try {
    const videos = await videoRepository.findFeatured(3);
    
    return NextResponse.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("❌ Failed to fetch videos:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Не удалось загрузить видео" 
      },
      { status: 500 }
    );
  }
}
