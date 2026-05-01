"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {FadeIn} from "@/components/motion/fade-in";
import {StaggerChildren, StaggerItem} from "@/components/motion/stagger-children";
import {Spinner} from "@/components/ui/spinner";

interface EducationItem {
    _id: string;
    title: string;
    institution: string;
    specialty: string;
    year: string;
    startDate: string;
}

const WORK_AREAS = [
    "Усталость, апатия, ПМС и нерегулярный цикл",
    "Лишний вес и проблемы с метаболизмом",
    "Эмоциональное нестабильность и стресс",
    "Проблемы с самооценкой и личными границами",
    "Пищевые расстройства и переедание",
    "Жизненные сценарии и родовые программы",
];

export default function AboutSection() {
    const [education, setEducation] = useState<EducationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/education")
            .then((res) => res.json())
            .then((data) => {
                const formatted = (data.data || [])
                    .map((item: Record<string, unknown>) => ({
                        ...item,
                        year: new Date(item.startDate as string).getFullYear().toString(),
                    }))
                    .sort((a: EducationItem, b: EducationItem) => parseInt(b.year) - parseInt(a.year))
                    .slice(0, 5);
                setEducation(formatted);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch education:", err);
                setLoading(false);
            });
    }, []);

    return (
        <section id="about" className="py-16 sm:py-24 bg-background">
            <div className="container">
                <FadeIn className="text-center mb-8 sm:mb-12">
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

                        {/* Мои квалификации */}
                        <FadeIn direction="left" delay={0.8}>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Мои квалификации</h3>
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <Spinner size="md"/>
                                    </div>
                                ) : (
                                    <StaggerChildren className="space-y-3 sm:space-y-4">
                                        {education.map((item) => (
                                            <StaggerItem key={item._id}>
                                                <motion.div
                                                initial={{opacity: 0, x: -10}}
                                                whileInView={{opacity: 1, x: 0}}
                                                viewport={{once: true}}
                                                className="flex gap-3 sm:gap-4 items-start">
                                                    <div
                                                        className="shrink-0 w-12 sm:w-16 text-primary font-bold text-sm sm:text-lg">
                                                        {item.year}
                                                    </div>
                                                    <div
                                                        className="flex-1 pb-3 sm:pb-4 border-b border-border last:border-b-0">
                                                        <h4 className="font-semibold text-sm sm:text-base mb-1">{item.title}</h4>
                                                        <p className="text-xs sm:text-sm text-muted">
                                                            {item.institution} • {item.specialty}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </StaggerItem>
                                        ))}
                                    </StaggerChildren>
                                )}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
