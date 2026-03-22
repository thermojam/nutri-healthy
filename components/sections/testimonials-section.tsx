"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
  data?: {
    title: string;
    subtitle: string;
    testimonials?: {
      id: string;
      author: {
        name: string;
        photo?: string;
        anonymized: boolean;
      };
      rating: number;
      title: string;
      content: string;
      serviceName: string;
      verified: boolean;
    }[];
  };
}

export default function TestimonialsSection({
  data,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonialsData = data || {
    title: "Отзывы клиентов",
    subtitle: "Истории и впечатления тех, кто уже прошел путь к здоровью",
    testimonials: [
      {
        id: "1",
        author: {
          name: "Екатерина М.",
          anonymized: false,
        },
        rating: 5,
        title: "Лучшее решение в моей жизни!",
        content:
          "Обратилась с проблемой лишнего веса после родов. За 4 месяца не только похудела на 15 кг, но и полностью изменила отношение к питанию. Энергия зашкаливает, кожа сияет, волосы блестят! Спасибо за индивидуальный подход и постоянную поддержку!",
        serviceName: "Health-коучинг",
        verified: true,
      },
      {
        id: "2",
        author: {
          name: "Анна К.",
          anonymized: true,
        },
        rating: 5,
        title: "Наконец-то гармония с едой",
        content:
          "Долгие годы страдала от компульсивного переедания. Перепробовала всё: диеты, психологи, кодирование... Ничего не работало надолго. Только здесь я поняла корень проблемы и научилась слышать свой организм. 3 месяца без срывов!",
        serviceName: "Нутрициология + Психология",
        verified: true,
      },
      {
        id: "3",
        author: {
          name: "Михаил Д.",
          anonymized: false,
        },
        rating: 5,
        title: "Здоровье ЖКТ восстановлено",
        content:
          "После многих лет безуспешного лечения у гастроэнтерологов обратился за помощью. Через 2 месяца симптомы ушли на 90%. Просто изменил питание по рекомендациям. Жалею только об одном — что не обратился раньше!",
        serviceName: "Нутрициология",
        verified: true,
      },
      {
        id: "4",
        author: {
          name: "Ольга П.",
          anonymized: false,
        },
        rating: 5,
        title: "Славянская гимнастика — это чудо!",
        content:
          "В 50 лет я чувствую себя лучше, чем в 40! Боли в спине ушли, появилась гибкость, энергия бьет ключом. А главное — научилась расслабляться и получать удовольствие от движения. Рекомендую всем!",
        serviceName: "Славянская гимнастика",
        verified: true,
      },
      {
        id: "5",
        author: {
          name: "Ирина С.",
          anonymized: true,
        },
        rating: 5,
        title: "Профессиональный подход",
        content:
          "Очень понравился комплексный подход. Не просто дали список продуктов, а разобрали весь образ жизни: сон, стресс, движение, питание. Результат превзошел ожидания. Минус 8 кг и полное изменение качества жизни!",
        serviceName: "Нутрициология",
        verified: true,
      },
      {
        id: "6",
        author: {
          name: "Дмитрий В.",
          anonymized: false,
        },
        rating: 5,
        title: "Энергия вернулась!",
        content:
          "Постоянная усталость стала нормой жизни. После консультации и коррекции питания энергия вернулась на такой уровень, что я снова начал тренироваться. Это невероятно! Спасибо!",
        serviceName: "Health-коучинг",
        verified: true,
      },
    ],
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (testimonialsData.testimonials?.length || 1));
  }, [testimonialsData.testimonials?.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (testimonialsData.testimonials?.length || 1)) %
        (testimonialsData.testimonials?.length || 1)
    );
  }, [testimonialsData.testimonials?.length]);

  // Автопереключение слайдов
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="container">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {testimonialsData.title}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {testimonialsData.subtitle}
          </p>
        </FadeIn>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {testimonialsData.testimonials?.slice(0, 6).map((testimonial, index) => (
            <FadeIn key={testimonial.id} delay={index * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  {/* Автор и рейтинг */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          testimonial.author.anonymized
                            ? "bg-primary/20"
                            : "bg-gradient-to-br from-primary to-accent"
                        )}
                      >
                        {testimonial.author.anonymized ? (
                          <span className="text-xl">👤</span>
                        ) : (
                          <span className="text-xl font-bold text-white">
                            {testimonial.author.name[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {testimonial.author.anonymized
                            ? "Анонимно"
                            : testimonial.author.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < testimonial.rating
                                  ? "fill-accent text-accent"
                                  : "text-border"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {testimonial.verified && (
                      <Badge variant="success" className="text-xs">
                        ✓ Проверен
                      </Badge>
                    )}
                  </div>

                  {/* Заголовок */}
                  <h3 className="text-lg font-semibold">
                    "{testimonial.title}"
                  </h3>

                  {/* Текст отзыва */}
                  <blockquote className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                    <p className="text-muted text-sm leading-relaxed pl-4">
                      {testimonial.content}
                    </p>
                  </blockquote>

                  {/* Услуга */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted">
                      Услуга: <span className="font-medium text-foreground">{testimonial.serviceName}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {testimonialsData.testimonials &&
                testimonialsData.testimonials[currentIndex] && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      {/* Автор и рейтинг */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              testimonialsData.testimonials[currentIndex]?.author
                                .anonymized
                                ? "bg-primary/20"
                                : "bg-gradient-to-br from-primary to-accent"
                            )}
                          >
                            {testimonialsData.testimonials[currentIndex]?.author
                              .anonymized ? (
                              <span className="text-xl">👤</span>
                            ) : (
                              <span className="text-xl font-bold text-white">
                                {
                                  testimonialsData.testimonials[currentIndex]
                                    ?.author.name[0]
                                }
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {testimonialsData.testimonials[currentIndex]?.author
                                .anonymized
                                ? "Анонимно"
                                : testimonialsData.testimonials[currentIndex]
                                    ?.author.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => {
                                const currentTestimonial = testimonialsData.testimonials?.[currentIndex];
                                const rating = currentTestimonial?.rating || 0;
                                return (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < rating
                                        ? "fill-accent text-accent"
                                        : "text-border"
                                    )}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        {testimonialsData.testimonials[currentIndex]?.verified && (
                          <Badge variant="success" className="text-xs">
                            ✓ Проверен
                          </Badge>
                        )}
                      </div>

                      {/* Заголовок */}
                      <h3 className="text-lg font-semibold">
                        "
                        {testimonialsData.testimonials[currentIndex]?.title}"
                      </h3>

                      {/* Текст отзыва */}
                      <blockquote className="relative">
                        <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                        <p className="text-muted text-sm leading-relaxed pl-4">
                          {testimonialsData.testimonials[currentIndex]?.content}
                        </p>
                      </blockquote>

                      {/* Услуга */}
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted">
                          Услугa:{" "}
                          <span className="font-medium text-foreground">
                            {testimonialsData.testimonials[currentIndex]?.serviceName}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </motion.div>
          </AnimatePresence>

          {/* Навигация карусели */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {testimonialsData.testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-primary/50"
                  )}
                  aria-label={`Перейти к отзыву ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Автоплей toggle */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              {isAutoPlaying ? "⏸ Пауза" : "▶ Автопрокрутка"}
            </button>
          </div>
        </div>

        {/* CTA */}
        <FadeIn delay={0.6}>
          <div className="mt-12 text-center">
            <p className="text-muted mb-4">
              Хотите оставить свой отзыв?
            </p>
            <a href="#contact">
              <Button variant="outline">Написать отзыв</Button>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
