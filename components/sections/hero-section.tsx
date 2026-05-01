"use client";

import {useState} from "react";
import Image from "next/image";
import {ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {AnimatedBackground} from "@/components/motion/animated-background";
import {GradientPreview} from "@/components/features/gradient-preview";
import {SECTION_BADGES} from "@/lib/constants/section-badges";

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
        title: "Психология и здоровье женской гормональной системы",
        subtitle: "",
        description:
            "Помогаю женщинам понять, почему тело и эмоции «бунтуют», и вернуть баланс — без диет, без насилия, через понимание себя.",
        ctaPrimary: "Выбрать программу",
        ctaSecondary: "Узнать больше",
        stats: [
            {value: "500+", label: "Клиентов"},
            {value: "7 лет", label: "Опыта"},
            {value: "98%", label: "Довольных"},
        ],
    };

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center pt-12 rounded-b-[4rem] md:rounded-b-[6rem]">
            <AnimatedBackground
                className="absolute inset-0"
                gradientVariant={gradientVariant}
            />


            <div className="relative z-10 container px-4 py-18 md:py-16">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Heading */}
                    <FadeIn direction="up" delay={0.2}>
                        <h1 className="text-4xl md:text-5xl xl:text-7xl font-bold leading-tight hero-text">
                            {heroData.title}
                        </h1>
                    </FadeIn>

                    {/* Description */}
                    <FadeIn direction="up" delay={0.3}>
                        <p className="mt-3 sm:mt-4 md:mt-6 px-2 sm:px-4 max-w-4xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg hero-description-emphasis">
                            {heroData.description}
                        </p>
                    </FadeIn>

                    {/* Image */}
                    <FadeIn direction="up" delay={0.4}>
                        <div className="relative mt-2 flex justify-center">

                            {/* Floating elements */}
                            <div className="hidden md:block absolute left-10 top-1/3 w-24 h-24 bg-white/10 rounded-full backdrop-blur-md"/>
                            <div className="hidden md:block absolute right-10 top-20 w-16 h-16 bg-orange-300/20 rounded-full backdrop-blur-md"/>

                            <Image
                                src="/images/main-image.png"
                                alt="Meditation"
                                width={900}
                                height={900}
                                className="relative z-10 object-contain w-full max-w-[800px] drop-shadow-2xl"
                                priority
                            />
                        </div>
                    </FadeIn>

                    {/* CTA */}
                    <FadeIn direction="up" delay={0.5}>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center hero-description">
                            <Button asChild size="lg" className="gap-2 shadow-lg">
                                <a href="#services" onClick={(e) => {
                                    e.preventDefault();
                                    const el = document.getElementById("services");
                                    el?.scrollIntoView({behavior: "smooth"});
                                }}>
                                    {heroData.ctaPrimary}
                                    <ArrowRight className="h-4 w-4"/>
                                </a>
                            </Button>

                            <Button variant="secondary" asChild size="lg" className="shadow-lg">
                                <a href="#about" onClick={(e) => {
                                    e.preventDefault();
                                    const el = document.getElementById("about");
                                    el?.scrollIntoView({behavior: "smooth"});
                                }}>
                                    {heroData.ctaSecondary}
                                </a>
                            </Button>
                        </div>
                    </FadeIn>
                </div>
            </div>

        </div>
    );
}
