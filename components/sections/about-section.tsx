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
}

export default function AboutSection() {
    const [education, setEducation] = useState<EducationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/education")
            .then((res) => res.json())
            .then((data) => {
                const formatted = (data.data || []).slice(0, 5).map((item: any) => ({
                    ...item,
                    year: new Date(item.startDate).getFullYear().toString(),
                }));
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
                        Психосоматика × биохимия тела | Научный подход к здоровью
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
                                    alt="Ксения Каменская - нутрициолог"
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
                                    Привет! Меня зовут Ксения Каменская, и я нутрициолог, health-коуч и специалист по психосоматике.
                                    Помогаю женщинам восстановить здоровье через работу с эмоциями, питанием и биохимией тела.
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed">
                                    Моя миссия — научить вас быть Берегиней здоровья себе и семье, управлять эмоциями
                                    и переключать саботаж на ресурс для управления своей жизнью по-женски.
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed">
                                    Аккредитованный нутрициолог НАИС. Постоянно повышаю квалификацию на форумах по
                                    превентивной медицине, применяю научный подход к работе с микробиомом, гормонами и стрессом.
                                </p>
                            </div>
                        </FadeIn>

                        {/* Философия - градиентный блок */}
                        <FadeIn direction="left" delay={0.4}>
                            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 p-4 sm:p-6 backdrop-blur-sm">
                                {/* Декоративный элемент */}
                                <div className="absolute top-0 right-0 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-50"/>

                                <div className="relative z-10">
                                    <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                                        <span className="text-xl">✨</span>
                                        Моя философия
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted italic leading-relaxed">
                                        Устойчивое здоровье рождается на стыке понимания своей души и мудрой заботы о теле.
                                        Тело будет кричать нам, пока мы не услышим истину.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Timeline пути */}
                        <FadeIn direction="left" delay={0.6}>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Мой путь</h3>
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <Spinner size="md" />
                                    </div>
                                ) : (
                                    <StaggerChildren className="space-y-3 sm:space-y-4">
                                        {education.map((item, index) => (
                                            <StaggerItem key={item._id}>
                                                <div className="flex gap-3 sm:gap-4 items-start">
                                                    <div className="flex-shrink-0 w-12 sm:w-16 text-primary font-bold text-sm sm:text-lg">
                                                        {item.year}
                                                    </div>
                                                    <div className="flex-1 pb-3 sm:pb-4 border-b border-border last:border-b-0">
                                                        <h4 className="font-semibold text-sm sm:text-base mb-1">{item.title}</h4>
                                                        <p className="text-xs sm:text-sm text-muted">
                                                            {item.institution} • {item.specialty}
                                                        </p>
                                                    </div>
                                                </div>
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
