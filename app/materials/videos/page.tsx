"use client";

import { useEffect, useState } from "react";
import { Play, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { MaterialsGridSkeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Video {
  _id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  thumbnail?: { url: string; alt: string };
}

const categoryLabels: Record<string, string> = {
  nutrition: "Нутрициология",
  psychology: "Психология",
  wellness: "Wellness",
  gymnastics: "Гимнастика",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}мин`;
  }
  return `${minutes} мин`;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch videos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero секция */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container">
            <FadeIn className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                Видео материалы
              </h1>
              <p className="text-xl text-muted">
                Полезные видео по нутрициологии, психологии и здоровому образу жизни
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Список видео */}
        <section className="py-24 bg-background">
          <div className="container">
            {loading ? (
              <div className="flex justify-center py-12">
                <MaterialsGridSkeleton count={6} />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted">Видео материалы в процессе наполнения</p>
                <Link href="/#materials">
                  <Button variant="outline">Вернуться на главную</Button>
                </Link>
              </div>
            ) : (
              <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <StaggerItem key={video._id}>
                    <Link href={`/materials/videos/${video.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                        <CardContent className="p-0">
                          {/* Превью */}
                          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                            <Image
                              src={`/images/videos/${video.category}.svg`}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="h-8 w-8 text-white ml-1" />
                              </div>
                            </div>
                            <Badge className="absolute bottom-2 right-2 bg-black/80">
                              {formatDuration(video.duration)}
                            </Badge>
                          </div>

                          {/* Контент */}
                          <div className="p-4 space-y-3">
                            <h4 className="font-semibold line-clamp-2 leading-tight">
                              {video.title}
                            </h4>
                            <p className="text-sm text-muted line-clamp-2">
                              {video.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[video.category] || "Видео"}
                              </Badge>
                              <div className="flex items-center text-xs text-muted">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDuration(video.duration)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-background">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold">
                  Хотите персональные рекомендации?
                </h2>
                <p className="text-lg text-muted">
                  Запишитесь на консультацию и получите индивидуальный план действий
                </p>
                <Link href="/#contact">
                  <Button size="lg">
                    Записаться на консультацию
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
