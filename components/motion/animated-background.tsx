"use client";

import {motion} from "framer-motion";
import {cn} from "@/lib/utils";

interface AnimatedBackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export function AnimatedBackground({
                                       className,
                                       children,
                                   }: AnimatedBackgroundProps) {
    return (
        <div className={cn("relative overflow-hidden", className)}>
            {/* Градиентный фон по референсу template.png */}
            <div className="absolute inset-0 gradient-bg"/>

            {/* Анимированные круги */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                }}
            />

            {/* Плавающие элементы */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
                animate={{
                    y: [0, 30, 0],
                    x: [0, -20, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Контент */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
