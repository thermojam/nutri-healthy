"use client";

import {useEffect, useState} from "react";
import {Play, FileText, Calendar, Clock} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {Spinner} from "@/components/ui/spinner";
import {SECTION_BADGES} from "@/lib/constants/section-badges";
import {cn} from "@/lib/utils";

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

const TABS = [
    {key: "articles", label: "Статьи"},
    {key: "videos", label: "Видео"},
    {key: "webinars", label: "Вебинары"},
] as const;

type MaterialType = "articles" | "videos" | "webinars";

const categoryLabels: Record<string, string> = {
    nutrition: "Нутрициология",
    psychology: "Психология",
    wellness: "Wellness",
    lifestyle: "Образ жизни",
    gymnastics: "Гимнастика",
};

const categoryColors: Record<string, string> = {
    nutrition: "bg-green-500 text-white",
    psychology: "bg-purple-500 text-white",
    wellness: "bg-blue-500 text-white",
    lifestyle: "bg-orange-500 text-white",
    gymnastics: "bg-pink-500 text-white",
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
    const [activeTab, setActiveTab] = useState<MaterialType>("articles");

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
            <section id="materials" className="py-24 bg-background">
                <div className="container">
                    <FadeIn className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            База знаний о здоровье
                        </h2>
                        <div className="flex justify-center">
                            <Spinner size="lg" />
                        </div>
                    </FadeIn>
                </div>
            </section>
        );
    }

    const hasAnyMaterials = articles.length > 0 || videos.length > 0 || webinars.length > 0;

    if (!hasAnyMaterials) {
        return null;
    }

    return (
        <section id="materials" className="py-16 sm:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6">
                <FadeIn className="text-center mb-8 sm:mb-12">
                    <Badge variant="secondary" className="mb-3 uppercase tracking-wide text-xs">
                        {SECTION_BADGES.materials}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                        База знаний о здоровье
                    </h2>
                    <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                        Бесплатные статьи, видео и записи вебинаров помогут вам разобраться в теме
                        и научиться заботиться о своём здоровье правильно.
                    </p>
                </FadeIn>

                {/* Таб-навигация */}
                <FadeIn delay={0.2} className="mb-8 sm:mb-12">
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    activeTab === tab.key
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border text-foreground hover:bg-muted/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* Контент табов */}
                <FadeIn delay={0.3}>
                    {/* Статьи */}
                    {activeTab === "articles" && articles.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {articles.map((article) => (
                                <Link key={article._id} href={`/materials/articles/${article.slug}`}>
                                    <Card className="h-full hover:shadow-sm transition-shadow overflow-hidden bg-gradient-to-br from-background to-muted/20">
                                        <CardContent className="p-4 sm:p-5 flex flex-col h-full space-y-3">
                                            {/* Иконка */}
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary"/>
                                            </div>

                                            {/* Заголовок и описание */}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm sm:text-base leading-snug mb-2 line-clamp-2">
                                                    {article.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-muted line-clamp-2">
                                                    {article.excerpt}
                                                </p>
                                            </div>

                                            {/* Категория и время */}
                                            <div className="pt-3 border-t border-border/30 space-y-2">
                                                <Badge className={cn("text-xs", categoryColors[article.category] || "bg-primary")}>
                                                    {categoryLabels[article.category] || "Статья"}
                                                </Badge>
                                                <div className="flex items-center text-xs text-muted">
                                                    <Clock className="h-3 w-3 mr-1"/>
                                                    {article.readingTime} мин чтения
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Видео */}
                    {activeTab === "videos" && videos.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {videos.map((video) => (
                                <Link key={video._id} href={`/materials/videos/${video.slug}`}>
                                    <Card className="h-full hover:shadow-sm transition-shadow overflow-hidden bg-gradient-to-br from-background to-muted/20 group">
                                        <CardContent className="p-4 sm:p-5 flex flex-col h-full space-y-3">
                                            {/* Плей-кнопка */}
                                            <div className="relative h-32 sm:h-40 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white ml-0.5"/>
                                                </div>
                                                <Badge className="absolute bottom-2 right-2 bg-black/80 text-xs">
                                                    {formatDuration(video.duration)}
                                                </Badge>
                                            </div>

                                            {/* Информация */}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm sm:text-base leading-snug mb-2 line-clamp-2">
                                                    {video.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-muted line-clamp-2">
                                                    {video.description}
                                                </p>
                                            </div>

                                            {/* Категория */}
                                            <div className="pt-2 border-t border-border/30">
                                                <Badge className={cn("text-xs", categoryColors[video.category] || "bg-primary")}>
                                                    {categoryLabels[video.category] || "Видео"}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Вебинары */}
                    {activeTab === "webinars" && webinars.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            {webinars.map((webinar) => (
                                <Link key={webinar._id} href={`/materials/webinars/${webinar.slug}`}>
                                    <Card className="h-full hover:shadow-sm transition-shadow overflow-hidden bg-gradient-to-br from-background to-muted/20 group">
                                        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                            {/* Плей-превью */}
                                            <div className="relative h-40 sm:h-32 sm:w-48 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="h-6 w-6 sm:h-7 sm:w-7 text-white ml-1"/>
                                                </div>
                                                <Badge className="absolute top-2 right-2 bg-black/80 text-xs">
                                                    {formatDuration(webinar.duration)}
                                                </Badge>
                                                {webinar.accessType === "free" && (
                                                    <Badge variant="success" className="absolute bottom-2 left-2 text-xs">
                                                        Бесплатно
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Информация */}
                                            <div className="flex flex-col justify-between flex-1 space-y-2">
                                                <div>
                                                    <h4 className="font-semibold text-base sm:text-lg leading-snug mb-2">
                                                        {webinar.title}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-muted line-clamp-2">
                                                        {webinar.description}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5"/>
                                                        {new Date(webinar.originalDate).toLocaleDateString("ru-RU", {
                                                            day: "numeric",
                                                            month: "short",
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5"/>
                                                        {formatDuration(webinar.duration)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={0.6}>
                    <div className="mt-12 sm:mt-16 text-center">
                        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary/20">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">
                                💡 Получите персональные рекомендации
                            </h3>
                            <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
                                Материалы дают общие знания, но ваше здоровье уникально. На консультации я разработаю индивидуальный план с учётом ваших анализов и целей.
                            </p>
                            <a href="#contact" className="block w-full max-w-xs mx-auto">
                                <Button size="lg" className="w-full">
                                    Записаться →
                                </Button>
                            </a>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
