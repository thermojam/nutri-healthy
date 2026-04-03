import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, Clock, Calendar, Play} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface Video {
    _id: string;
    slug: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail?: { url: string; alt: string };
    duration: number;
    category: string;
    tags?: string[];
    publishedAt?: string;
    views?: number;
}

const categoryLabels: Record<string, string> = {
    nutrition: "Нутрициология",
    psychology: "Психология",
    wellness: "Wellness",
    gymnastics: "Гимнастика",
};

async function getVideo(slug: string): Promise<Video | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/videos/${slug}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data || null;
    } catch (error) {
        console.error("Failed to fetch video:", error);
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

export default async function VideoPage({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const video = await getVideo(slug);

    if (!video) {
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
                            <Badge>{categoryLabels[video.category] || "Видео"}</Badge>

                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {video.title}
                            </h1>

                            <p className="text-xl text-muted">
                                {video.description}
                            </p>

                            {/* Мета информация */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4"/>
                                    <span>{formatDuration(video.duration)}</span>
                                </div>
                                {video.publishedAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4"/>
                                        <span>
                      {new Date(video.publishedAt).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                      })}
                    </span>
                                    </div>
                                )}
                                {video.views && (
                                    <div className="flex items-center gap-2">
                                        <Play className="h-4 w-4"/>
                                        <span>{video.views} просмотров</span>
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
                                {video.videoUrl.includes("youtube") ? (
                                    <iframe
                                        src={video.videoUrl.replace("watch?v=", "embed/")}
                                        title={video.title}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : video.videoUrl.includes("vimeo") ? (
                                    <iframe
                                        src={`https://player.vimeo.com/video/${video.videoUrl.split("/").pop()}`}
                                        title={video.title}
                                        className="w-full h-full"
                                        allow="autoplay; fullscreen; picture-in-picture"
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
                                            <p className="text-muted">Видео доступно для просмотра</p>
                                            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
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

                {/* Описание */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <h2 className="text-2xl font-bold">О видео</h2>
                            <p className="text-muted leading-relaxed">
                                {video.description}
                            </p>

                            {/* Теги */}
                            {video.tags && video.tags.length > 0 && (
                                <div className="pt-8 border-t border-border">
                                    <div className="flex flex-wrap gap-2">
                                        {video.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Понравилось видео?
                            </h2>
                            <p className="text-lg text-muted">
                                Запишитесь на консультацию и получите персональные рекомендации
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
