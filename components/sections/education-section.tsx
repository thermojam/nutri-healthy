"use client";

import {useEffect, useState} from "react";
import {FileText, Award, BookOpen} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {FadeIn} from "@/components/motion/fade-in";
import {Carousel, CarouselItem} from "@/components/ui/carousel";

interface Education {
    _id: string;
    title: string;
    institution: string;
    specialty: string;
    year: string;
    degree?: string;
    documents?: {
        type: "diploma" | "certificate" | "course";
        url: string;
        name: string;
    }[];
}

const documentIcons = {
    diploma: Award,
    certificate: FileText,
    course: BookOpen,
};

export default function EducationSection() {
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/education")
            .then((res) => res.json())
            .then((data) => {
                // Форматируем данные
                const formatted = (data.data || []).map((item: any) => ({
                    ...item,
                    year: new Date(item.startDate).getFullYear().toString(),
                }));
                setEducation(formatted);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch education:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section id="education" className="py-24 bg-card">
                <div className="container">
                    <FadeIn className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Образование и дипломы
                        </h2>
                        <p className="text-lg text-muted">Загрузка...</p>
                    </FadeIn>
                </div>
            </section>
        );
    }

    return (
        <section id="education" className="py-24 bg-card">
            <div className="container">
                <FadeIn className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Образование и дипломы
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Все документы подтверждены и сертифицированы
                    </p>
                </FadeIn>

                <Carousel showDots={true} showArrows={true}>
                    {education.map((item) => {
                        const DocumentIcon = item.documents?.[0]
                            ? documentIcons[item.documents[0].type]
                            : Award;

                        return (
                            <CarouselItem key={item._id}>
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6 space-y-4">
                                        {/* Заголовок и бейдж */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div
                                                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <DocumentIcon className="h-5 w-5 text-primary"/>
                                            </div>
                                            {item.degree && (
                                                <Badge variant="outline">{item.degree}</Badge>
                                            )}
                                        </div>

                                        {/* Основная информация */}
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-primary font-medium text-sm">
                                                {item.institution}
                                            </p>
                                            <p className="text-sm text-muted">{item.specialty}</p>
                                        </div>

                                        {/* Год */}
                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm font-semibold text-primary">
                        {item.year}
                      </span>

                                            {/* Документы */}
                                            {item.documents && item.documents.length > 0 && (
                                                <div className="flex gap-2">
                                                    {item.documents.map((doc, index) => {
                                                        const DocIcon = documentIcons[doc.type];
                                                        return (
                                                            <a
                                                                key={index}
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-muted hover:text-primary transition-colors"
                                                                title={doc.name}
                                                            >
                                                                <DocIcon className="h-4 w-4"/>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        );
                    })}
                </Carousel>

                {/* Примечание */}
                <FadeIn delay={0.6}>
                    <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
                        <p className="text-sm text-muted">
                            📄 Все документы доступны для проверки. Копии дипломов и сертификатов
                            можно запросить через форму обратной связи.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
