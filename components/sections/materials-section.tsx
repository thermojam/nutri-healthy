"use client";

import {useEffect, useState} from "react";
import {Play, FileText, Video, Calendar, Clock} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {StaggerChildren, StaggerItem} from "@/components/motion/stagger-children";
import {Spinner} from "@/components/ui/spinner";

interface Article {
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: "nutrition" | "psychology" | "wellness" | "lifestyle";
    readingTime: number;
}

interface VideoItem {
    _id: string;
    slug: string;
    title: string;
    description: string;
    duration: number;
    category: "nutrition" | "psychology" | "wellness" | "gymnastics";
}

interface Webinar {
    _id: string;
    slug: string;
    title: string;
    description: string;
    duration: number;
    originalDate: string;
    accessType: "free" | "paid";
}

const categoryLabels: Record<string, string> = {
    nutrition: "Нутрициология",
    psychology: "Психология",
    wellness: "Wellness",
    lifestyle: "Образ жизни",
    gymnastics: "Гимнастика",
};

const categoryColors: Record<string, string> = {
    nutrition: "bg-green-500",
    psychology: "bg-purple-500",
    wellness: "bg-blue-500",
    lifestyle: "bg-orange-500",
    gymnastics: "bg-pink-500",
};

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}ч ${remainingMinutes}мин`;
    }
    return `${minutes} мин`;
}

export function MaterialsSection() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/articles").then((res) => res.json()),
            fetch("/api/videos").then((res) => res.json()),
            fetch("/api/webinars").then((res) => res.json()),
        ])
            .then(([articlesData, videosData, webinarsData]) => {
                setArticles(articlesData.data || []);
                setVideos(videosData.data || []);
                setWebinars(webinarsData.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch materials:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section id="materials" className="py-24 bg-card">
                <div className="container">
                    <FadeIn className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Полезные материалы
                        </h2>
                        <div className="flex justify-center">
                            <Spinner size="lg" />
                        </div>
                    </FadeIn>
                </div>
            </section>
        );
    }

    return (
        <section id="materials" className="py-24 bg-card">
            <div className="container">
                <FadeIn className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Полезные материалы
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Статьи, видео и вебинары для вашего здоровья и развития
                    </p>
                </FadeIn>

                {/* Статьи */}
                {articles.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold flex items-center gap-2">
                                <FileText className="h-6 w-6 text-primary"/>
                                Статьи
                            </h3>
                            <Link
                                href="/materials/articles"
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                Все статьи →
                            </Link>
                        </div>

                        <StaggerChildren className="grid md:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <StaggerItem key={article._id}>
                                    <Link href={`/materials/articles/${article.slug}`}>
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                                            <CardContent className="p-0">
                                                {/* Обложка placeholder */}
                                                <div
                                                    className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <FileText className="h-12 w-12 text-muted opacity-50"/>
                                                    </div>
                                                    <Badge
                                                        className={`absolute top-2 left-2 ${
                                                            categoryColors[article.category] || "bg-primary"
                                                        }`}
                                                    >
                                                        {categoryLabels[article.category] || "Статья"}
                                                    </Badge>
                                                </div>

                                                {/* Контент */}
                                                <div className="p-4 space-y-3">
                                                    <h4 className="font-semibold line-clamp-2 leading-tight">
                                                        {article.title}
                                                    </h4>
                                                    <p className="text-sm text-muted line-clamp-2">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center text-sm text-muted">
                                                        <Clock className="h-4 w-4 mr-1"/>
                                                        {article.readingTime} мин чтения
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </StaggerItem>
                            ))}
                        </StaggerChildren>
                    </div>
                )}

                {/* Видео */}
                {videos.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold flex items-center gap-2">
                                <Video className="h-6 w-6 text-primary"/>
                                Видео
                            </h3>
                            <Link
                                href="/materials/videos"
                                className="text-primary hover:underline text-sm font-medium"
                            >
                                Все видео →
                            </Link>
                        </div>

                        <StaggerChildren className="grid md:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <StaggerItem key={video._id}>
                                    <Link href={`/materials/videos/${video.slug}`}>
                                        <Card
                                            className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                                            <CardContent className="p-0">
                                                {/* Превью */}
                                                <div
                                                    className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div
                                                            className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <Play className="h-8 w-8 text-white ml-1"/>
                                                        </div>
                                                    </div>
                                                    <Badge className="absolute bottom-2 right-2 bg-black/80">
                                                        {formatDuration(video.duration)}
                                                    </Badge>
                                                </div>

                                                {/* Контент */}
                                                <div className="p-4 space-y-3">
                                                    <h4 className="font-semibold line-clamp-2 leading-tight">
                                                        {video.title}
                                                    </h4>
                                                    <p className="text-sm text-muted line-clamp-2">
                                                        {video.description}
                                                    </p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {categoryLabels[video.category] || "Видео"}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </StaggerItem>
                            ))}
                        </StaggerChildren>
                    </div>
                )}

                {/* Вебинары */}
                {webinars.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-primary"/>
                                Запись вебинара
                            </h3>
                        </div>

                        <FadeIn>
                            {webinars.map((webinar) => (
                                <Card key={webinar._id} className="overflow-hidden">
                                    <div className="grid md:grid-cols-2">
                                        {/* Превью */}
                                        <div
                                            className="relative aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div
                                                    className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                                                    <Play className="h-10 w-10 text-white ml-1"/>
                                                </div>
                                            </div>
                                            <Badge className="absolute top-4 left-4">
                                                {formatDuration(webinar.duration)}
                                            </Badge>
                                            {webinar.accessType === "free" && (
                                                <Badge variant="success" className="absolute top-4 right-4">
                                                    Бесплатно
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Контент */}
                                        <div className="p-6 flex flex-col justify-center space-y-4">
                                            <h4 className="text-2xl font-bold">{webinar.title}</h4>
                                            <p className="text-muted">{webinar.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4"/>
                                                    {new Date(webinar.originalDate).toLocaleDateString(
                                                        "ru-RU",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4"/>
                                                    {formatDuration(webinar.duration)}
                                                </div>
                                            </div>
                                            <Link href={`/materials/webinars/${webinar.slug}`}>
                                                <Button size="lg" className="w-full">
                                                    Смотреть запись
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </FadeIn>
                    </div>
                )}

                {/* CTA */}
                <FadeIn delay={0.6}>
                    <div className="mt-12 text-center">
                        <p className="text-muted mb-4">
                            Хотите получить доступ ко всем материалам?
                        </p>
                        <a href="#contact">
                            <Button size="lg">Записаться на консультацию</Button>
                        </a>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
