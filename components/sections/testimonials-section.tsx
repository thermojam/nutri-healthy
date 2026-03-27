import {Quote, Star} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {Carousel, CarouselItem} from "@/components/ui/carousel";
import {cn} from "@/lib/utils";
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
}

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

export function TestimonialsSection({testimonials}: TestimonialsSectionProps) {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section id="reviews" className="py-24 bg-background">
            <div className="container">
                <FadeIn className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Отзывы клиентов</h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Истории и впечатления тех, кто уже прошел путь к здоровью
                    </p>
                </FadeIn>

                <Carousel showDots={true} showArrows={true}>
                    {testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial._id.toString()}>
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
                                    <h3 className="text-lg font-semibold">"{testimonial.title}"</h3>

                                    {/* Текст отзыва */}
                                    <blockquote className="relative">
                                        <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20"/>
                                        <p className="text-muted text-sm leading-relaxed pl-4">
                                            {testimonial.content}
                                        </p>
                                    </blockquote>

                                    {/* Услуга */}
                                    <div className="pt-4 border-t border-border">
                                        <p className="text-xs text-muted">
                                            Услуга:{" "}
                                            <span className="font-medium text-foreground">
                                                {testimonial.serviceName}
                                            </span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
