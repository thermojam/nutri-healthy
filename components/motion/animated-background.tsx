"use client";

import {motion} from "framer-motion";
import {cn} from "@/lib/utils";

interface AnimatedBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    gradientVariant?: number; // 0-5 для выбора варианта
}

export function AnimatedBackground({
    className,
    children,
    gradientVariant = 0,
}: AnimatedBackgroundProps) {
    // Выбираем класс градиента в зависимости от варианта
    const gradientClass = cn(
        gradientVariant === 0 && "gradient-bg",
        gradientVariant === 1 && "gradient-bg-1",
        gradientVariant === 2 && "gradient-bg-2",
        gradientVariant === 3 && "gradient-bg-3",
        gradientVariant === 4 && "gradient-bg-4",
        gradientVariant === 5 && "gradient-bg-5"
    );

    return (
        <div className={cn("relative min-h-screen overflow-hidden", className)}>
            {/* Градиентный фон */}
            <div className={cn("absolute inset-0", gradientClass)}/>

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

            {/* Плавающие элементы - адаптированы для мобильных */}
            <motion.div
                className="absolute top-[10%] left-[10%] w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl"
                animate={{
                    y: [0, -20, 0],
                    x: [0, 15, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-[10%] right-[10%] w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl"
                animate={{
                    y: [0, 25, 0],
                    x: [0, -15, 0],
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
