"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import {ArrowRight, Play} from "lucide-react";
import {Button} from "@/components/ui/button";
import {FadeIn} from "@/components/motion/fade-in";
import {AnimatedBackground} from "@/components/motion/animated-background";
import {GradientPreview} from "@/components/features/gradient-preview";
import {AnimatedStats} from "@/components/sections/animated-stats";

interface HeroSectionProps {
    data?: {
        title: string;
        subtitle: string;
        description: string;
        ctaPrimary: string;
        ctaSecondary: string;
        photo?: {
            url: string;
            alt: string;
        };
        stats?: {
            value: string;
            label: string;
        }[];
    };
}

export default function HeroSection({data}: HeroSectionProps) {
    const [gradientVariant, setGradientVariant] = useState(0);

    // Данные по умолчанию, если не переданы
    const heroData = data || {
        title: "Нутрициолог / Health-коуч / Психосоматика",
        subtitle: "Экстракт женственности с Ксенией Каменской",
        description:
            "Психосоматика × биохимия тела. Научный подход к здоровью: от работы с эмоциями до восполнения дефицитов. Стань Берегиней здоровья себе и семье.",
        ctaPrimary: "Выбрать программу",
        ctaSecondary: "Узнать больше",
        stats: [
            {value: "500+", label: "Клиентов"},
            {value: "7 лет", label: "Опыта"},
            {value: "98%", label: "Довольных"},
        ],
    };

    return (
        <div className="relative min-h-screen overflow-hidden pt-20 rounded-b-[4rem] md:rounded-b-[5rem] lg:rounded-b-[8rem]">
            <AnimatedBackground
                className="absolute inset-0"
                gradientVariant={gradientVariant}
            />
            <div className="relative z-10 container py-12 sm:py-24 md:py-32 px-3 sm:px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                    {/* Левая часть - Контент */}
                    <div
                        className="space-y-6 sm:space-y-8 text-center lg:text-left mx-auto lg:mx-0 max-w-3xl lg:max-w-none w-full">
                        <FadeIn direction="up" delay={0.2}>
                            <div
                                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 border border-primary/30 dark:border-primary/40 text-[10px] sm:text-xs font-semibold leading-tight cursor-pointer hover:from-primary/30 hover:to-accent/30 transition-all">
                                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0">
                                    <span
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-accent"></span>
                                </span>
                                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
                                    Аккредитованный нутрициолог НАИС
                                </span>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.3}>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
                                {heroData.title}
                            </h1>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.4}>
                            <p className="text-base sm:text-lg md:text-xl text-white max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                                {heroData.description}
                            </p>
                        </FadeIn>

                        {/* CTA кнопки */}
                        <FadeIn direction="up" delay={0.5}>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
                                <a href="#services" className="w-full sm:w-auto cursor-pointer">
                                    <Button size="lg" className="gap-2 w-full text-sm sm:text-base cursor-pointer">
                                        {heroData.ctaPrimary}
                                        <ArrowRight className="h-4 w-4"/>
                                    </Button>
                                </a>
                                <a href="#about" className="w-full sm:w-auto cursor-pointer">
                                    <Button variant="secondary" size="lg" className="w-full text-sm sm:text-base cursor-pointer">
                                        {heroData.ctaSecondary}
                                    </Button>
                                </a>
                            </div>
                        </FadeIn>

                        {/* Статистика - только на десктопе */}
                        <FadeIn direction="up" delay={0.6}>
                            <div className="hidden sm:block pt-4">
                                {heroData.stats && (
                                    <div className="flex justify-center lg:justify-start">
                                        <AnimatedStats stats={heroData.stats}/>
                                    </div>
                                )}
                            </div>
                        </FadeIn>

                        {/* Доверие - реальные фото клиентов - видно всегда */}
                        <FadeIn direction="up" delay={0.7}>
                            <div className="flex flex-col items-center lg:items-start gap-2 sm:gap-3 pt-4">
                                {/* Текст */}
                                <p className="text-sm sm:text-base text-center lg:text-left font-medium cursor-pointer">
                                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">500+</span>{" "}
                                    <span className="text-white">довольных клиентов</span>
                                </p>

                                {/* Звезды */}
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className="w-4 h-4 sm:w-5 sm:h-5 fill-accent cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    ))}
                                </div>

                                {/* Аватары */}
                                <div className="flex -space-x-2 sm:-space-x-2.5">
                                    {[
                                        { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", alt: "Анна" },
                                        { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", alt: "Мария" },
                                        { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", alt: "Елена" },
                                        { url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face", alt: "Ольга" },
                                        { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", alt: "Наталья" },
                                    ].map((person, i) => (
                                        <div
                                            key={i}
                                            className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white/50 overflow-hidden shadow-lg cursor-pointer hover:scale-110 transition-transform"
                                        >
                                            <Image
                                                src={person.url}
                                                alt={person.alt}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Правая часть - Визуал */}
                    <FadeIn direction="left" delay={0.4} className="hidden lg:flex lg:justify-center lg:items-center">
                        <div className="relative w-full max-w-xl xl:max-w-2xl cursor-pointer">
                            {/* Основное фото */}
                            <div className="relative w-full" style={{aspectRatio: "4/3"}}>
                                <Image
                                    src="/images/main-image.png"
                                    alt="Нутрициолог"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Переключатель градиентов для превью */}
            <GradientPreview
                currentGradient={gradientVariant}
                onGradientChange={setGradientVariant}
            />
        </div>
    );
}
