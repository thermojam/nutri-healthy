import {Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {Carousel, CarouselItem} from "@/components/ui/carousel";
import {SECTION_BADGES} from "@/lib/constants/section-badges";
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
                    <Badge variant="secondary" className="mb-3 uppercase tracking-wide text-xs">
                        {SECTION_BADGES.testimonials}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                        500+ довольных клиентов
                    </h2>
                </FadeIn>

                <Carousel showDots={true} showArrows={false}>
                    {testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial._id.toString()}>
                            <Card className="h-full hover:shadow-sm transition-shadow overflow-hidden flex flex-col bg-gradient-to-br from-background to-muted/20">
                                <CardContent className="p-5 sm:p-6 flex-1 flex flex-col space-y-3">
                                    {/* Рейтинг звёзд */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "h-4 w-4 sm:h-5 sm:w-5",
                                                    i < testimonial.rating
                                                        ? "fill-accent text-accent"
                                                        : "text-border"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    {/* Текст отзыва */}
                                    <p className="text-sm sm:text-base leading-relaxed flex-1">
                                        {testimonial.content}
                                    </p>

                                    {/* Автор и услуга */}
                                    <div className="pt-2 border-t border-border/50">
                                        <h4 className="font-semibold text-sm">
                                            {testimonial.author.anonymized
                                                ? "Анонимно"
                                                : testimonial.author.name}
                                        </h4>
                                        <p className="text-xs text-muted">
                                            {testimonial.serviceName}
                                        </p>
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
