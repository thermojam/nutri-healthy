import {Quote} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {Carousel, CarouselItem} from "@/components/ui/carousel";
import {cn} from "@/lib/utils";
import Image from "next/image";
import type {ObjectId} from "mongoose";

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
        <section id="cases" className="py-24 bg-card">
            <div className="container">
                <FadeIn className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Истории трансформации
                    </h2>
                    <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
                        Эти женщины пришли с запросом «просто похудеть», 
                        а обрели здоровье, энергию и гармонию в семье. 
                        <strong className="text-foreground"> Их результат — ваша возможность</strong> увидеть, 
                        что работает действительно.
                    </p>
                </FadeIn>

                <Carousel showDots={true} showArrows={false}>
                    {cases.map((caseItem) => (
                        <CarouselItem key={caseItem._id.toString()}>
                            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                                <CardContent className="p-0 space-y-4">
                                    {/* Изображение кейса */}
                                    {caseItem.image?.url && (
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image
                                                src={caseItem.image.url}
                                                alt={caseItem.image.alt || caseItem.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="p-6 space-y-4">
                                    {/* Заголовок и клиент */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-full flex items-center justify-center",
                                                    caseItem.client.anonymized
                                                        ? "bg-primary/20"
                                                        : "bg-gradient-to-br from-primary to-accent"
                                                )}
                                            >
                                                {caseItem.client.anonymized ? (
                                                    <span className="text-xl">👤</span>
                                                ) : (
                                                    <span className="text-xl font-bold text-white">
                                                        {caseItem.client.name[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {caseItem.client.anonymized
                                                        ? "Клиент"
                                                        : caseItem.client.name}
                                                </h3>
                                                <p className="text-sm text-muted">
                                                    {caseItem.client.age && `${caseItem.client.age} лет`} •{" "}
                                                    {caseItem.serviceName}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{caseItem.duration}</Badge>
                                    </div>

                                    {/* Название кейса */}
                                    <h3 className="text-lg font-bold">{caseItem.title}</h3>

                                    {/* Проблема */}
                                    <div>
                                        <p className="text-sm text-muted mb-1">Запрос:</p>
                                        <p className="text-sm">{caseItem.problem}</p>
                                    </div>

                                    {/* Результаты */}
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted font-medium">Результаты:</p>
                                        {caseItem.results.map((result, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                <span className="text-primary font-bold">✓</span>
                                                <span>
                                                    <strong className="text-primary">{result.value}</strong>
                                                    {result.metric && (
                                                        <span className="text-muted"> {result.metric}</span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Отзыв */}
                                    {caseItem.testimonial && (
                                        <blockquote
                                            className="border-l-4 border-primary pl-4 italic text-muted text-sm"
                                        >
                                            <Quote className="h-4 w-4 inline mr-2 -mt-1 opacity-50"/>
                                            {caseItem.testimonial}
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
                    <div className="mt-12 text-center">
                        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-3xl p-6 sm:p-8 border border-primary/20">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">
                                Ваша история успеха начинается здесь
                            </h3>
                            <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto mb-6">
                                Через 3 месяца вы сможете сказать: «Это было лучшее решение в моей жизни». 
                                Как Екатерина, которая похудела на 15 кг и восстановила энергию.
                            </p>
                            <a href="#contact">
                                <Button size="lg">
                                    Начать свою трансформацию →
                                </Button>
                            </a>
                            <p className="text-xs text-muted mt-4">
                                🔒 100% конфиденциально • Без осуждения • С заботой
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
