"use client";

import {Play, FileText, Video, Calendar, Clock} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {StaggerChildren, StaggerItem} from "@/components/motion/stagger-children";

interface MaterialsSectionProps {
    data?: {
        title: string;
        subtitle: string;
        articles?: {
            id: string;
            slug: string;
            title: string;
            excerpt: string;
            category: "nutrition" | "psychology" | "wellness" | "lifestyle";
            coverImage?: {
                url: string;
                alt: string;
            };
            readingTime: number;
        }[];
        videos?: {
            id: string;
            slug: string;
            title: string;
            description: string;
            thumbnail?: {
                url: string;
                alt: string;
            };
            duration: number;
            category: "nutrition" | "psychology" | "wellness" | "gymnastics";
        }[];
        webinar?: {
            id: string;
            slug: string;
            title: string;
            description: string;
            thumbnail?: {
                url: string;
                alt: string;
            };
            duration: number;
            originalDate: string;
            accessType: "free" | "paid";
        };
        gymnastics?: {
            id: string;
            title: string;
            description: string;
            thumbnail?: {
                url: string;
                alt: string;
            };
            schedule?: {
                day: string;
                time: string;
            }[];
        }[];
    };
}

const categoryLabels = {
    nutrition: "Нутрициология",
    psychology: "Психология",
    wellness: "Wellness",
    lifestyle: "Образ жизни",
    gymnastics: "Гимнастика",
};

const categoryColors = {
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

export default function MaterialsSection({data}: MaterialsSectionProps) {
    const materialsData = data || {
        title: "Полезные материалы",
        subtitle: "Статьи, видео и вебинары для вашего здоровья и развития",
        articles: [
            {
                id: "1",
                slug: "kak-pravilno-pitatsya-utrom",
                title: "Как правильно питаться утром: 5 правил здорового завтрака",
                excerpt:
                    "Разбираем, каким должен быть идеальный завтрак для энергии и хорошего настроения на весь день.",
                category: "nutrition",
                readingTime: 7,
            },
            {
                id: "2",
                slug: "svyaz-pitaniya-i-emociy",
                title: "Связь питания и эмоций: как еда влияет на настроение",
                excerpt:
                    "Научный взгляд на то, как различные продукты влияют на наше эмоциональное состояние.",
                category: "psychology",
                readingTime: 10,
            },
            {
                id: "3",
                slug: "top-5-vitaminov-dlya-energii",
                title: "Топ-5 витаминов для энергии и бодрости",
                excerpt:
                    "Какие витамины и микроэлементы необходимы для поддержания высокого уровня энергии.",
                category: "nutrition",
                readingTime: 5,
            },
        ],
        videos: [
            {
                id: "1",
                slug: "5-privychek-zdorovogo-pitaniya",
                title: "5 привычек здорового питания",
                description: "Практическое руководство по формированию полезных привычек",
                duration: 900,
                category: "nutrition",
            },
            {
                id: "2",
                slug: "meditaciya-dlya-nachinayuschih",
                title: "Медитация для начинающих",
                description: "Простая техника для снятия стресса и улучшения концентрации",
                duration: 600,
                category: "wellness",
            },
            {
                id: "3",
                slug: "uprazhneniya-dlya-spiny",
                title: "Упражнения для здоровой спины",
                description: "Комплекс упражнений для снятия напряжения с позвоночника",
                duration: 1200,
                category: "gymnastics",
            },
        ],
        webinar: {
            id: "1",
            slug: "garmoniya-tela-i-soznaniya",
            title: "Гармония тела и сознания: большой вебинар о здоровье",
            description:
                "Комплексный подход к здоровью: питание, движение, мышление и эмоциональное благополучие.",
            duration: 5400,
            originalDate: "2025-01-15",
            accessType: "free",
        },
        gymnastics: [
            {
                id: "1",
                title: "Утренняя разминка",
                description: "15 минут для пробуждения тела и энергии на весь день",
                schedule: [
                    {day: "Пн", time: "08:00"},
                    {day: "Ср", time: "08:00"},
                    {day: "Пт", time: "08:00"},
                ],
            },
            {
                id: "2",
                title: "Вечернее расслабление",
                description: "Мягкая практика для снятия напряжения после рабочего дня",
                schedule: [
                    {day: "Вт", time: "19:00"},
                    {day: "Чт", time: "19:00"},
                ],
            },
        ],
    };

    return (
        <section id="materials" className="py-24 bg-card">
            <div className="container">
                <FadeIn className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {materialsData.title}
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        {materialsData.subtitle}
                    </p>
                </FadeIn>

                {/* Статьи */}
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
                        {materialsData.articles?.map((article) => (
                            <StaggerItem key={article.id}>
                                <Link href={`/materials/articles/${article.slug}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                                        <CardContent className="p-0">
                                            {/* Обложка */}
                                            <div
                                                className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <FileText className="h-12 w-12 text-muted opacity-50"/>
                                                </div>
                                                <Badge
                                                    className={`absolute top-2 left-2 ${
                                                        categoryColors[article.category]
                                                    }`}
                                                >
                                                    {categoryLabels[article.category]}
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

                {/* Видео */}
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
                        {materialsData.videos?.map((video) => (
                            <StaggerItem key={video.id}>
                                <Link href={`/materials/videos/${video.slug}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
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
                                                    {categoryLabels[video.category]}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerChildren>
                </div>

                {/* Вебинар */}
                {materialsData.webinar && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-primary"/>
                                Запись вебинара
                            </h3>
                        </div>

                        <FadeIn>
                            <Card className="overflow-hidden">
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
                                            {formatDuration(materialsData.webinar.duration)}
                                        </Badge>
                                        {materialsData.webinar.accessType === "free" && (
                                            <Badge
                                                variant="success"
                                                className="absolute top-4 right-4"
                                            >
                                                Бесплатно
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Контент */}
                                    <div className="p-6 flex flex-col justify-center space-y-4">
                                        <h4 className="text-2xl font-bold">
                                            {materialsData.webinar.title}
                                        </h4>
                                        <p className="text-muted">
                                            {materialsData.webinar.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4"/>
                                                {new Date(
                                                    materialsData.webinar.originalDate
                                                ).toLocaleDateString("ru-RU", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4"/>
                                                {formatDuration(materialsData.webinar.duration)}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/materials/webinars/${materialsData.webinar.slug}`}
                                        >
                                            <Button size="lg" className="w-full">
                                                Смотреть запись
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </FadeIn>
                    </div>
                )}

                {/* Гимнастика */}
                {materialsData.gymnastics && materialsData.gymnastics.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold flex items-center gap-2">
                                <Play className="h-6 w-6 text-primary"/>
                                Открытые занятия по гимнастике
                            </h3>
                        </div>

                        <StaggerChildren className="grid md:grid-cols-2 gap-6">
                            {materialsData.gymnastics.map((item) => (
                                <StaggerItem key={item.id}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <CardContent className="p-0">
                                            {/* Превью */}
                                            <div
                                                className="relative aspect-video bg-gradient-to-br from-pink/20 to-purple/20">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-6xl">🧘</span>
                                                </div>
                                            </div>

                                            {/* Контент */}
                                            <div className="p-4 space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-lg mb-1">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-muted">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {item.schedule && (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium">Расписание:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.schedule.map((slot, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="text-sm"
                                                                >
                                                                    {slot.day} в {slot.time}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <Button variant="outline" className="w-full">
                                                    Присоединиться
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </StaggerItem>
                            ))}
                        </StaggerChildren>
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
