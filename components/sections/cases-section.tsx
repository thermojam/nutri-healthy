import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {Carousel, CarouselItem} from "@/components/ui/carousel";
import {SECTION_BADGES} from "@/lib/constants/section-badges";
import {cn} from "@/lib/utils";
import type {ObjectId} from "mongoose";

function getInitials(name: string): string {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
}

function getAvatarColor(name: string): string {
    const colors = [
        "bg-amber-100 text-amber-700",
        "bg-rose-100 text-rose-700",
        "bg-purple-100 text-purple-700",
        "bg-blue-100 text-blue-700",
    ];
    return colors[name.length % colors.length];
}

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
                    {cases.map((caseItem) => (
                        <CarouselItem key={caseItem._id.toString()}>
                            <Card className="h-full hover:shadow-sm transition-shadow overflow-hidden flex flex-col bg-gradient-to-br from-background to-muted/20">
                                <CardContent className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
                                    {/* Шапка с аватаром и информацией */}
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm sm:text-base",
                                            getAvatarColor(caseItem.client.name)
                                        )}>
                                            {getInitials(caseItem.client.name)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-base sm:text-lg">
                                                {caseItem.client.anonymized ? "Анонимно" : caseItem.client.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-muted">
                                                {caseItem.client.age && `${caseItem.client.age} лет`} • {caseItem.duration}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Результат - яркий заголовок */}
                                    <h3 className="text-base sm:text-lg font-bold text-primary leading-snug">
                                        {caseItem.title}
                                    </h3>

                                    {/* Два столбца БЫЛО / СТАЛО */}
                                    <div className="grid grid-cols-2 gap-4 flex-1 py-2">
                                        <div>
                                            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Было</p>
                                            <p className="text-xs sm:text-sm leading-relaxed">{caseItem.problem}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Стало</p>
                                            <ul className="text-xs sm:text-sm space-y-1">
                                                {caseItem.results.map((result, i) => (
                                                    <li key={i} className="leading-relaxed">
                                                        <span className="font-bold text-primary">{result.value}</span>
                                                        {result.metric && <span className="text-muted text-xs"> {result.metric}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Отзыв в конце */}
                                    {caseItem.testimonial && (
                                        <blockquote className="border-l-2 border-primary pl-3 py-2 text-xs sm:text-sm italic text-primary/80 leading-snug">
                                            &ldquo;{caseItem.testimonial}&rdquo;
                                        </blockquote>
                                    )}
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
