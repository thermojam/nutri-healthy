"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface Webinar {
  _id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  originalDate: string;
  accessType: "free" | "paid" | "registration";
  price?: number;
  thumbnail?: { url: string; alt: string };
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}мин`;
  }
  return `${minutes} мин`;
}

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/webinars")
      .then((res) => res.json())
      .then((data) => {
        setWebinars(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch webinars:", err);
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
                Вебинары
              </h1>
              <p className="text-xl text-muted">
                Записи вебинаров по нутрициологии, health-коучингу и здоровому образу жизни
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Список вебинаров */}
        <section className="py-24 bg-background">
          <div className="container">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted">Загрузка вебинаров...</p>
              </div>
            ) : webinars.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted">Вебинары в процессе наполнения</p>
                <Link href="/#materials">
                  <Button variant="outline">Вернуться на главную</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {webinars.map((webinar, index) => (
                  <FadeIn key={webinar._id} delay={index * 0.1}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-2">
                        {/* Превью */}
                        <div className="relative aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                              <Play className="h-10 w-10 text-white ml-1" />
                            </div>
                          </div>
                          <Badge className="absolute top-4 left-4">
                            {formatDuration(webinar.duration)}
                          </Badge>
                          {webinar.accessType === "free" && (
                            <Badge variant="success" className="absolute top-4 right-4">
                              Бесплатно
                            </Badge>
                          )}
                          {webinar.accessType === "paid" && webinar.price && (
                            <Badge variant="outline" className="absolute top-4 right-4">
                              {webinar.price} ₽
                            </Badge>
                          )}
                        </div>

                        {/* Контент */}
                        <div className="p-6 flex flex-col justify-center space-y-4">
                          <h3 className="text-2xl font-bold">{webinar.title}</h3>
                          <p className="text-muted">{webinar.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(webinar.originalDate).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(webinar.duration)}</span>
                            </div>
                          </div>
                          <Link href={`/materials/webinars/${webinar.slug}`}>
                            <Button size="lg" className="w-full">
                              Смотреть запись
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-card">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold">
                  Хотите узнать больше?
                </h2>
                <p className="text-lg text-muted">
                  Запишитесь на индивидуальную консультацию и получите персональные рекомендации
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
