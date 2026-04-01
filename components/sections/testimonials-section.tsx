import {Quote, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {Carousel, CarouselItem} from "@/components/ui/carousel";
import {cn} from "@/lib/utils";
import Image from "next/image";
import type {ObjectId} from "mongoose";

interface Testimonial {
    _id: string | ObjectId;
    author: {
        name: string;
        anonymized: boolean;
    };
    rating: number;
    title: string;
    content: string;
    serviceName: string;
    verified: boolean;
    image?: {
        url: string;
        alt: string;
    };
}

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

export function TestimonialsSection({testimonials}: TestimonialsSectionProps) {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section id="reviews" className="py-16 sm:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6">
                <FadeIn className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        Отзывы тех, кто уже с нами
                    </h2>
                    <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto leading-relaxed">
                        Более 500 женщин уже восстановили здоровье и обрели энергию.
                        <strong className="text-foreground"> 98% клиентов</strong> рекомендуют меня
                        подругам — это лучшая оценка моей работы. Читайте честные отзывы.
                    </p>
                </FadeIn>

                <Carousel showDots={true} showArrows={false}>
                    {testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial._id.toString()}>
                            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                                <CardContent className="p-0 space-y-4">
                                    {/* Изображение отзыва */}
                                    {testimonial.image?.url && (
                                        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                                            <Image
                                                src={testimonial.image.url}
                                                alt={testimonial.image.alt || testimonial.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    {/* Автор и рейтинг */}
                                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div
                                                className={cn(
                                                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0",
                                                    testimonial.author.anonymized
                                                        ? "bg-primary/20"
                                                        : "bg-gradient-to-br from-primary to-accent"
                                                )}
                                            >
                                                {testimonial.author.anonymized ? (
                                                    <span className="text-lg sm:text-xl">👤</span>
                                                ) : (
                                                    <span className="text-lg sm:text-xl font-bold text-white">
                                                        {testimonial.author.name[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-sm sm:text-base truncate">
                                                    {testimonial.author.anonymized
                                                        ? "Анонимно"
                                                        : testimonial.author.name}
                                                </h4>
                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "h-3 w-3 sm:h-4 sm:w-4",
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
                                            <Badge variant="success" className="text-xs flex-shrink-0">
                                                ✓ Проверен
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Заголовок */}
                                    <h3 className="text-base sm:text-lg font-semibold leading-tight">
                                        "{testimonial.title}"
                                    </h3>

                                    {/* Текст отзыва */}
                                    <blockquote className="relative">
                                        <Quote className="absolute -top-2 -left-2 h-5 w-5 sm:h-6 sm:w-6 text-primary/20"/>
                                        <p className="text-muted text-sm leading-relaxed pl-4">
                                            {testimonial.content}
                                        </p>
                                    </blockquote>

                                    {/* Услуга */}
                                    <div className="pt-3 sm:pt-4 border-t border-border">
                                        <p className="text-xs text-muted">
                                            Услуга:{" "}
                                            <span className="font-medium text-foreground">
                                                {testimonial.serviceName}
                                            </span>
                                        </p>
                                    </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </Carousel>

                {/* CTA с социальным доказательством */}
                <FadeIn delay={0.6}>
                    <div className="mt-8 sm:mt-12 text-center">
                        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary/20">
                            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-5 w-5 sm:h-6 sm:w-6 fill-accent text-accent"/>
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm font-semibold">4.9/5</span>
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">
                                Станьте следующей историей успеха
                            </h3>
                            <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
                                Присоединяйтесь к сообществу женщин, которые выбрали здоровье,
                                энергию и гармонию. Ваша трансформация начинается сегодня.
                            </p>
                            <a href="#contact" className="block w-full max-w-xs mx-auto">
                                <Button size="lg" className="w-full">
                                    Записаться →
                                </Button>
                            </a>
                            <p className="text-xs text-muted mt-3 sm:mt-4">
                                ✨ Первая 15-минутная консультация — бесплатно
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
