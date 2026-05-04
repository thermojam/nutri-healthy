"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import {FadeIn} from "@/components/motion/fade-in";
import {StaggerChildren, StaggerItem} from "@/components/motion/stagger-children";
import {SECTION_BADGES} from "@/lib/constants/section-badges";

const WORK_AREAS = [
    "Усталость, апатия, ПМС и нерегулярный цикл",
    "Лишний вес и проблемы с метаболизмом",
    "Эмоциональное нестабильность и стресс",
    "Проблемы с самооценкой и личными границами",
    "Пищевые расстройства и переедание",
    "Жизненные сценарии и родовые программы",
];

export default function AboutSection() {

    return (
        <section id="about" className="py-16 sm:py-24 bg-background">
            <div className="container">
                <FadeIn className="text-center mb-8 sm:mb-12">
                    <Badge variant="secondary" className="mb-3 uppercase tracking-wide text-xs">
                        {SECTION_BADGES.about}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Обо мне</h2>
                    <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
                        Я специалист по интегративному подходу к здоровью и психике
                    </p>
                </FadeIn>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* Фото */}
                    <FadeIn direction="right" delay={0.2}>
                        <div className="relative">
                            <div
                                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                <Image
                                    src="/images/expert.jpeg"
                                    alt="Ксения Каменская - психолог"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Декоративные элементы с задержанной анимацией */}
                            <motion.div
                                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-primary/20 rounded-2xl -z-10"
                                initial={{scale: 0, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                transition={{delay: 1.5, duration: 0.8, ease: "easeOut"}}
                            />
                            <motion.div
                                className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-accent/20 rounded-full -z-10"
                                initial={{scale: 0, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                transition={{delay: 1.8, duration: 0.8, ease: "easeOut"}}
                            />
                        </div>
                    </FadeIn>

                    {/* Контент */}
                    <div className="space-y-6 sm:space-y-8">
                        <FadeIn direction="left" delay={0.3}>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed">
                                    Мой путь начался с собственного кризиса: лишний вес, инсулинорезистентность,
                                    гормональный сбой, обильные месячные, эстрогендоминирование. Врачи предлагали КОК.
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed">
                                    Я пошла другим путём — через психосоматику, питание и образ жизни.
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed">
                                    Сейчас я соединяю знание физиологии и глубину психологии, чтобы помочь женщинам
                                    понять, что их гормональная система — это не «сломанный механизм», а зеркало их
                                    жизни.
                                </p>
                            </div>
                        </FadeIn>

                        {/* С чем я работаю */}
                        <FadeIn direction="left" delay={0.6}>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">С чем я работаю</h3>
                                <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {WORK_AREAS.map((area, idx) => (
                                        <StaggerItem key={idx}>
                                            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-border/50 bg-primary/5 hover:bg-primary/10 transition-colors">
                                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"/>
                                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                                    {area}
                                                </p>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </StaggerChildren>
                            </div>
                        </FadeIn>

                    </div>
                </div>
            </div>
        </section>
    );
}
