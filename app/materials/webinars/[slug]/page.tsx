import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, Clock, Calendar, Play, Download} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {webinarRepository} from "@/lib/db/repositories/webinar.repository";

interface Webinar {
    _id: string;
    slug: string;
    title: string;
    description: string;
    recordingUrl: string;
    thumbnail?: { url: string; alt: string };
    duration: number;
    originalDate: string;
    speaker: { name: string; photo?: string; bio?: string };
    topics?: string[];
    materials?: { name: string; url: string; type: "pdf" | "doc" | "xlsx" }[];
    accessType: "free" | "paid" | "registration";
    price?: number;
    views?: number;
}

async function getWebinar(slug: string): Promise<Webinar | null> {
    try {
        const webinar = await webinarRepository.findBySlug(slug);
        if (!webinar) return null;
        return JSON.parse(JSON.stringify(webinar));
    } catch (error) {
        console.error("Failed to fetch webinar:", error);
        return null;
    }
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}ч ${remainingMinutes}мин`;
    }
    return `${minutes} мин`;
}

export default async function WebinarPage({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const webinar = await getWebinar(slug);

    if (!webinar) {
        notFound();
    }

    return (
        <>
            <Header/>

            <main className="flex-1">
                {/* Hero секция */}
                <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="container">
                        <Link href="/#materials">
                            <Button variant="ghost" size="sm" className="mb-6 gap-2">
                                <ArrowLeft className="h-4 w-4"/>
                                Назад к материалам
                            </Button>
                        </Link>

                        <div className="max-w-5xl mx-auto space-y-6">
                            <div className="flex items-center gap-3">
                                <Badge>Вебинар</Badge>
                                {webinar.accessType === "free" && (
                                    <Badge variant="success">Бесплатно</Badge>
                                )}
                                {webinar.accessType === "paid" && webinar.price && (
                                    <Badge variant="outline">{webinar.price} ₽</Badge>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {webinar.title}
                            </h1>

                            <p className="text-xl text-muted">
                                {webinar.description}
                            </p>

                            {/* Мета информация */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4"/>
                                    <span>
                    {new Date(webinar.originalDate).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4"/>
                                    <span>{formatDuration(webinar.duration)}</span>
                                </div>
                                {webinar.views && (
                                    <div className="flex items-center gap-2">
                                        <Play className="h-4 w-4"/>
                                        <span>{webinar.views} просмотров</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Видео плеер */}
                <section className="py-8 bg-background">
                    <div className="container">
                        <div className="max-w-5xl mx-auto">
                            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                                {webinar.recordingUrl.includes("youtube") ? (
                                    <iframe
                                        src={webinar.recordingUrl.replace("watch?v=", "embed/")}
                                        title={webinar.title}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                        <div className="text-center space-y-4">
                                            <div
                                                className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center mx-auto">
                                                <Play className="h-10 w-10 text-white ml-1"/>
                                            </div>
                                            <p className="text-muted">Запись вебинара доступна для просмотра</p>
                                            <a href={webinar.recordingUrl} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline">
                                                    Открыть в новом окне
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Информация о вебинаре */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Основная информация */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">О вебинаре</h2>
                                    <p className="text-muted leading-relaxed">
                                        {webinar.description}
                                    </p>
                                </div>

                                {/* Темы */}
                                {webinar.topics && webinar.topics.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold mb-4">Темы вебинара</h3>
                                        <ul className="space-y-2">
                                            {webinar.topics.map((topic, index) => (
                                                <li key={index} className="flex items-start gap-2 text-muted">
                                                    <span className="text-primary mt-1">•</span>
                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Спикер и материалы */}
                            <div className="space-y-6">
                                {/* Спикер */}
                                <Card>
                                    <CardContent className="p-6 space-y-4">
                                        <h3 className="font-semibold">Спикер</h3>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {webinar.speaker.name[0]}
                        </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{webinar.speaker.name}</p>
                                                <p className="text-sm text-muted">
                                                    Нутрициолог, health-коуч
                                                </p>
                                            </div>
                                        </div>
                                        {webinar.speaker.bio && (
                                            <p className="text-sm text-muted">
                                                {webinar.speaker.bio}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Материалы */}
                                {webinar.materials && webinar.materials.length > 0 && (
                                    <Card>
                                        <CardContent className="p-6 space-y-4">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <Download className="h-4 w-4"/>
                                                Материалы
                                            </h3>
                                            <ul className="space-y-2">
                                                {webinar.materials.map((material, index) => (
                                                    <li key={index}>
                                                        <a
                                                            href={material.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                                                        >
                                                            <Download className="h-4 w-4"/>
                                                            {material.name} ({material.type.toUpperCase()})
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Хотите узнать больше?
                            </h2>
                            <p className="text-lg text-muted">
                                Запишитесь на индивидуальную консультацию и получите персональные рекомендации
                            </p>
                            <Link href="/#contact">
                                <Button size="lg">
                                    Записаться на консультацию
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </>
    );
}
