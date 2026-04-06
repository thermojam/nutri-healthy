"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {Check} from "lucide-react";
import {cn} from "@/lib/utils";

const gradientOptions = [
    {
        id: 0,
        name: "Текущий",
        subtitle: "Референс template.png",
        className: "gradient-bg",
        colors: ["#F4D03F", "#C792EA", "#3B3272"],
    },
    {
        id: 1,
        name: "Нежный рассвет",
        subtitle: "Мягкий, воздушный",
        className: "gradient-bg-1",
        colors: ["#FFE5D9", "#E8DFF5", "#C8B8DB"],
    },
    {
        id: 2,
        name: "Энергия жизни",
        subtitle: "Динамичный, современный",
        className: "gradient-bg-2",
        colors: ["#FF8A4C", "#A855F7", "#6D28D9"],
    },
    {
        id: 3,
        name: "Природная гармония",
        subtitle: "Естественный, органичный",
        className: "gradient-bg-3",
        colors: ["#BBF7D0", "#E9D5FF", "#A5F3FC"],
    },
    {
        id: 4,
        name: "Глубокий космос",
        subtitle: "Премиальный, глубокий",
        className: "gradient-bg-4",
        colors: ["#E9D5FF", "#A855F7", "#5B21B6"],
    },
    {
        id: 5,
        name: "Тёплый закат",
        subtitle: "Тёплый, уютный",
        className: "gradient-bg-5",
        colors: ["#FED7AA", "#F0ABFC", "#C084FC"],
    },
];

interface GradientPreviewProps {
    currentGradient: number;
    onGradientChange: (id: number) => void;
}

export function GradientPreview({currentGradient, onGradientChange}: GradientPreviewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selected = gradientOptions.find(g => g.id === currentGradient);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Кнопка открытия */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-background border border-border rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
                <div className={cn("w-6 h-6 rounded-full", selected?.className)}/>
                <span className="text-sm font-medium">{selected?.name}</span>
            </button>

            {/* Панель выбора */}
            {isOpen && (
                <motion.div
                    initial={{opacity: 0, y: 10, scale: 0.95}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 10, scale: 0.95}}
                    className="absolute bottom-12 right-0 bg-background border border-border rounded-2xl shadow-2xl p-4 w-80"
                >
                    <h3 className="text-lg font-semibold mb-3">Выберите градиент</h3>
                    <div className="space-y-2">
                        {gradientOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    onGradientChange(option.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full p-3 rounded-xl border transition-all text-left",
                                    currentGradient === option.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Мини-превью градиента */}
                                    <div className={cn("w-12 h-12 rounded-lg flex-shrink-0", option.className)}/>
                                    
                                    {/* Информация */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{option.name}</span>
                                            {currentGradient === option.id && (
                                                <Check className="h-4 w-4 text-primary"/>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted">{option.subtitle}</p>
                                    </div>
                                    
                                    {/* Цвета */}
                                    <div className="flex -space-x-1">
                                        {option.colors.map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-4 h-4 rounded-full border border-background"
                                                style={{backgroundColor: color}}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    <p className="text-xs text-muted mt-3 text-center">
                        💡 Нажмите на градиент для применения
                    </p>
                </motion.div>
            )}
        </div>
    );
}
