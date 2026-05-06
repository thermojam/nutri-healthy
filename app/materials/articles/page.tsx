"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
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

interface Article {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
}

const categoryLabels: Record<string, string> = {
  nutrition: "Нутрициология",
  psychology: "Психология",
  wellness: "Wellness",
  lifestyle: "Образ жизни",
};

const categoryColors: Record<string, string> = {
  nutrition: "bg-green-500",
  psychology: "bg-purple-500",
  wellness: "bg-blue-500",
  lifestyle: "bg-orange-500",
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch articles:", err);
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
                Статьи
              </h1>
              <p className="text-xl text-muted">
                Полезные материалы по нутрициологии, психологии и здоровому образу жизни
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Список статей */}
        <section className="py-24 bg-background">
          <div className="container px-3 sm:px-4 md:px-6">
            {loading ? (
              <MaterialsGridSkeleton count={6} />
            ) : articles.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted">Статьи в процессе наполнения</p>
                <Button asChild variant="outline">
                  <Link href="/#materials">Вернуться на главную</Link>
                </Button>
              </div>
            ) : (
              <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <StaggerItem key={article._id}>
                    <Link href={`/materials/articles/${article.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-0">
                          {/* Обложка */}
                          <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                            <Image
                              src={`/images/articles/${article.category}.svg`}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                            <Badge
                              className={`absolute top-2 left-2 ${
                                categoryColors[article.category] || "bg-primary"
                              }`}
                            >
                              {categoryLabels[article.category] || "Статья"}
                            </Badge>
                          </div>

                          {/* Контент */}
                          <div className="p-4 space-y-3">
                            <h4 className="font-semibold line-clamp-2 leading-tight">
                              {article.title}
                            </h4>
                            <p className="text-sm text-muted line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center text-sm text-muted">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readingTime} мин чтения
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
                  Хотите индивидуальную консультацию?
                </h2>
                <p className="text-lg text-muted">
                  Запишитесь на консультацию и получите персональные рекомендации
                </p>
                <Button asChild size="lg">
                  <Link href="/#contact">Записаться на консультацию</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
