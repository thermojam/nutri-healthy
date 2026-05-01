import {Quote} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {Carousel, CarouselItem} from "@/components/ui/carousel";
import {SECTION_BADGES} from "@/lib/constants/section-badges";
import {cn} from "@/lib/utils";
import Image from "next/image";
import type {ObjectId} from "mongoose";

// Fallback изображения для кейсов с Unsplash (реальные люди)
const caseImageFallbacks = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop&crop=face",  // Екатерина
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=400&fit=crop&crop=face",  // Анна
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face",  // Михаил (мужчина)
];

interface Case {
    _id: string | ObjectId;
    slug: string;
    title: string;
    client: {
        name: string;
        anonymized: boolean;
        age?: number;
        gender?: "female" | "male";
    };
    problem: string;
    results: {
        title: string;
        value: string;
        metric?: string;
    }[];
    testimonial?: string;
    serviceName: string;
    duration: string;
    image?: {
        url: string;
        alt: string;
    };
}

interface CasesSectionProps {
    cases: Case[];
}

export function CasesSection({cases}: CasesSectionProps) {
    if (!cases || cases.length === 0) {
        return null;
    }

    return (
        <section id="cases" className="py-16 sm:py-24 bg-card">
            <div className="container px-3 sm:px-4 md:px-6">
                <FadeIn className="text-center mb-8 sm:mb-12">
                    <Badge variant="secondary" className="mb-3 uppercase tracking-wide text-xs">
                        {SECTION_BADGES.cases}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        Истории трансформации
                    </h2>
                    <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                        Эти женщины пришли с запросом «просто похудеть»,
                        а обрели здоровье, энергию и гармонию в семье.
                        <strong className="text-foreground"> Их результат — ваша возможность</strong> увидеть,
                        что работает действительно.
                    </p>
                </FadeIn>

                <Carousel showDots={true} showArrows={false}>
                    {cases.map((caseItem, index) => (
                        <CarouselItem key={caseItem._id.toString()}>
                            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                                <CardContent className="p-0 flex-1 flex flex-col">
                                    {/* Изображение кейса */}
                                    {(caseItem.image?.url || caseImageFallbacks[index % caseImageFallbacks.length]) && (
                                        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                                            <Image
                                                src={caseItem.image?.url || caseImageFallbacks[index % caseImageFallbacks.length]}
                                                alt={caseItem.image?.alt || caseItem.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 flex flex-col">
                                    {/* Заголовок и клиент */}
                                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-sm sm:text-base truncate">
                                                {caseItem.client.anonymized
                                                    ? "Анонимно"
                                                    : caseItem.client.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-muted truncate">
                                                {caseItem.client.age && `${caseItem.client.age} лет`} •{" "}
                                                {caseItem.serviceName}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs flex-shrink-0 whitespace-nowrap">{caseItem.duration}</Badge>
                                    </div>

                                    {/* Название кейса */}
                                    <h3 className="text-base sm:text-lg font-bold leading-tight">{caseItem.title}</h3>

                                    {/* Проблема */}
                                    <div>
                                        <p className="text-xs sm:text-sm text-muted mb-1">Запрос:</p>
                                        <p className="text-sm">{caseItem.problem}</p>
                                    </div>

                                    {/* Результаты - растягивается */}
                                    <div className="space-y-1.5 sm:space-y-2 flex-1">
                                        <p className="text-xs sm:text-sm text-muted font-medium">Результаты:</p>
                                        {caseItem.results.map((result, i) => (
                                            <div key={i} className="flex items-start gap-1.5 sm:gap-2 text-sm">
                                                <span className="text-primary font-bold flex-shrink-0">✓</span>
                                                <span className="break-words">
                                                    <strong className="text-primary">{result.value}</strong>
                                                    {result.metric && (
                                                        <span className="text-muted"> {result.metric}</span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Отзыв - всегда внизу */}
                                    {caseItem.testimonial && (
                                        <blockquote
                                            className="border-l-2 sm:border-l-4 border-primary pl-3 sm:pl-4 italic text-muted text-sm mt-auto"
                                        >
                                            <Quote className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2 -mt-1 opacity-50"/>
                                            <span className="break-words">{caseItem.testimonial}</span>
                                        </blockquote>
                                    )}
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </Carousel>

                {/* CTA */}
                <FadeIn delay={0.6}>
                    <div className="mt-8 sm:mt-12 text-center">
                        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary/20">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">
                                Ваша история успеха начинается здесь
                            </h3>
                            <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
                                Через 3 месяца вы сможете сказать: «Это было лучшее решение в моей жизни».
                                Как Екатерина, которая похудела на 15 кг и восстановила энергию.
                            </p>
                            <a href="#contact" className="block w-full max-w-xs mx-auto">
                                <Button size="lg" className="w-full">
                                    Начать →
                                </Button>
                            </a>
                            <p className="text-xs text-muted mt-3 sm:mt-4">
                                🔒 100% конфиденциально • Без осуждения • С заботой
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
