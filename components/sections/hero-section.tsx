"use client";

import {motion} from "framer-motion";
import Image from "next/image";
import {ArrowRight, Play} from "lucide-react";
import {Button} from "@/components/ui/button";
import {FadeIn} from "@/components/motion/fade-in";
import {AnimatedBackground} from "@/components/motion/animated-background";

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
    // Данные по умолчанию, если не переданы
    const heroData = data || {
        title: "Нутрициолог / Health-коуч",
        subtitle: "Индивидуальный подход к вашему здоровью",
        description:
            "Персональные планы питания, сопровождение и поддержка на пути к лучшей версии себя. Научный подход и забота о вашем здоровье.",
        ctaPrimary: "Выбрать программу",
        ctaSecondary: "Узнать больше",
        stats: [
            {value: "500+", label: "Клиентов"},
            {value: "7 лет", label: "Опыта"},
            {value: "98%", label: "Довольных"},
        ],
    };

    return (
        <AnimatedBackground className="min-h-screen flex items-center">
            <div className="container py-24 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Левая часть - Контент */}
                    <div className="space-y-8">
                        <FadeIn direction="up" delay={0.2}>
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                <span className="relative flex h-2 w-2">
                  <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                                Доступно для новых клиентов
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.3}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                {heroData.title}
                            </h1>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.4}>
                            <p className="text-lg md:text-xl text-muted max-w-xl">
                                {heroData.description}
                            </p>
                        </FadeIn>

                        {/* CTA кнопки */}
                        <FadeIn direction="up" delay={0.5}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="#services">
                                    <Button size="lg" className="gap-2">
                                        {heroData.ctaPrimary}
                                        <ArrowRight className="h-5 w-5"/>
                                    </Button>
                                </a>
                                <a href="#about">
                                    <Button variant="outline" size="lg">
                                        {heroData.ctaSecondary}
                                    </Button>
                                </a>
                            </div>
                        </FadeIn>

                        {/* Статистика */}
                        {heroData.stats && (
                            <FadeIn direction="up" delay={0.6}>
                                <div className="flex flex-wrap gap-8 pt-4">
                                    {heroData.stats.map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{opacity: 0, y: 20}}
                                            whileInView={{opacity: 1, y: 0}}
                                            viewport={{once: true}}
                                            transition={{delay: 0.7 + index * 0.1}}
                                            className="text-center sm:text-left"
                                        >
                                            <p className="text-3xl md:text-4xl font-bold text-primary">
                                                {stat.value}
                                            </p>
                                            <p className="text-sm text-muted">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </FadeIn>
                        )}

                        {/* Доверие */}
                        <FadeIn direction="up" delay={0.8}>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                                        >
                                            <span className="text-xs text-primary">👤</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-muted">
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
                                {/* Placeholder для фото эксперта */}
                                <div
                                    className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                                    <div
                                        className="w-3/4 h-3/4 rounded-full bg-background/90 flex items-center justify-center">
                                        <span className="text-6xl">👩‍⚕️</span>
                                    </div>
                                </div>

                                {/* Декоративные круги (по референсу template.png) */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-primary/20"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <motion.div
                                    className="absolute inset-8 rounded-full border border-accent/20"
                                    animate={{
                                        scale: [1.05, 1, 1.05],
                                        rotate: [0, -5, 5, 0],
                                    }}
                                    transition={{
                                        duration: 10,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </div>

                            {/* Плавающие карточки */}
                            <motion.div
                                className="absolute top-1/4 -left-4 bg-card rounded-2xl shadow-lg p-4 border border-border"
                                animate={{y: [0, -10, 0]}}
                                transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                        <span className="text-xl">✨</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Результат</p>
                                        <p className="text-xs text-muted">-10 кг за 3 месяца</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-1/4 -right-4 bg-card rounded-2xl shadow-lg p-4 border border-border"
                                animate={{y: [0, 10, 0]}}
                                transition={{duration: 5, repeat: Infinity, ease: "easeInOut"}}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                        <span className="text-xl">🎯</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Подход</p>
                                        <p className="text-xs text-muted">Индивидуальный</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </FadeIn>
                </div>

                {/* Логотипы партнеров / СМИ (опционально) */}
                <FadeIn direction="up" delay={1}>
                    <div className="mt-16 pt-8 border-t border-primary/10">
                        <p className="text-center text-sm text-muted mb-6">
                            Публиковались в изданиях
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
                            {["Forbes", "Vogue", "Harper's Bazaar", "Elle", "GQ"].map(
                                (brand) => (
                                    <div
                                        key={brand}
                                        className="text-xl md:text-2xl font-bold text-muted"
                                    >
                                        {brand}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </AnimatedBackground>
    );
}
