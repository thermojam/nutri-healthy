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
                        Кейсы и результаты
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Истории успеха моих клиентов с реальными результатами
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
                        <p className="text-muted mb-4">
                            Хотите такой же результат? Запишитесь на консультацию!
                        </p>
                        <a href="#contact">
                            <Button size="lg">Начать свой путь к здоровью</Button>
                        </a>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
