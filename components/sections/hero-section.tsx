"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import {ArrowRight, Play} from "lucide-react";
import {Button} from "@/components/ui/button";
import {FadeIn} from "@/components/motion/fade-in";
import {AnimatedBackground} from "@/components/motion/animated-background";
import {GradientPreview} from "@/components/features/gradient-preview";

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
            <div className="relative z-10 container py-16 sm:py-24 md:py-32">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Левая часть - Контент */}
                    <div
                        className="space-y-6 sm:space-y-8 text-center lg:text-left mx-auto lg:mx-0 max-w-3xl lg:max-w-none">
                        <FadeIn direction="up" delay={0.2}>
                            <div
                                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm text-primary">
                <span className="relative flex h-2 w-2">
                  <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                                Аккредитованный нутрициолог НАИС | Доступно для новых клиентов
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.3}>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                {heroData.title}
                            </h1>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.4}>
                            <p className="text-base sm:text-lg md:text-xl text-muted max-w-xl mx-auto lg:mx-0">
                                {heroData.description}
                            </p>
                        </FadeIn>

                        {/* CTA кнопки */}
                        <FadeIn direction="up" delay={0.5}>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                <a href="#services">
                                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                                        {heroData.ctaPrimary}
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5"/>
                                    </Button>
                                </a>
                                <a href="#about">
                                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                        {heroData.ctaSecondary}
                                    </Button>
                                </a>
                            </div>
                        </FadeIn>

                        {/* Статистика */}
                        {heroData.stats && (
                            <FadeIn direction="up" delay={0.6}>
                                <div
                                    className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 pt-4 justify-center lg:justify-start">
                                    {heroData.stats.map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{opacity: 0, y: 20}}
                                            whileInView={{opacity: 1, y: 0}}
                                            viewport={{once: true}}
                                            transition={{delay: 0.7 + index * 0.1}}
                                            className="text-center sm:text-left"
                                        >
                                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs sm:text-sm text-muted">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </FadeIn>
                        )}

                        {/* Доверие */}
                        <FadeIn direction="up" delay={0.8}>
                            <div className="flex items-center gap-2 sm:gap-4 pt-4 justify-center lg:justify-start">
                                <div className="flex -space-x-2 sm:-space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                                        >
                                            <span className="text-xs sm:text-xs text-primary">👤</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm text-muted">
                                    <span className="font-semibold text-foreground">500+</span>{" "}
                                    довольных клиентов
                                </p>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Правая часть - Визуал */}
                    <FadeIn direction="left" delay={0.4} className="hidden lg:block">
                        <div className="relative">
                            {/* Основное фото */}
                            <div className="relative w-full aspect-square max-w-md mx-auto">
                                <Image
                                    src="/images/main-image.png"
                                    alt="Нутрициолог"
                                    fill
                                    className="object-cover"
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
