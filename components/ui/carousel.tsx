"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type {EmblaCarouselType} from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useCallback, useEffect, useState} from "react";

interface CarouselProps {
    children: React.ReactNode;
    className?: string;
    showArrows?: boolean;
    showDots?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
}

export function Carousel({
    children,
    className,
    showArrows = true,
    showDots = true,
    autoplay = false,
    autoplayDelay = 5000,
}: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            align: "start",
            loop: true,
            slidesToScroll: 1,
        },
        autoplay ? [Autoplay({delay: autoplayDelay, stopOnInteraction: true})] : []
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onInit = useCallback((api: EmblaCarouselType) => {
        setScrollSnaps(api.scrollSnapList());
    }, []);

    const onSelect = useCallback((api: EmblaCarouselType) => {
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);

        emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
    }, [emblaApi, onInit, onSelect]);

    const childCount = Array.isArray(children) ? children.length : React.Children.count(children);
    const showNavigation = childCount > 1;

    return (
        <div className={cn("relative group", className)}>
            {/* Кнопки - только desktop */}
            {showArrows && showNavigation && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden lg:flex bg-background/80 backdrop-blur hover:bg-background"
                        onClick={scrollPrev}
                        aria-label="Предыдущий слайд"
                    >
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden lg:flex bg-background/80 backdrop-blur hover:bg-background"
                        onClick={scrollNext}
                        aria-label="Следующий слайд"
                    >
                        <ArrowRight className="h-5 w-5"/>
                    </Button>
                </>
            )}

            {/* Embla viewport */}
            <div className="overflow-hidden px-3 sm:px-4 lg:px-6" ref={emblaRef}>
                <div className="flex">
                    {children}
                </div>
            </div>

            {/* Точки - только mobile */}
            {showDots && showNavigation && (
                <div className="flex justify-center gap-2 mt-6 lg:hidden">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                index === selectedIndex
                                    ? "bg-primary w-6"
                                    : "bg-border"
                            )}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface CarouselItemProps {
    children: React.ReactNode;
    className?: string;
}

export function CarouselItem({children, className}: CarouselItemProps) {
    return (
        <div
            className={cn(
                // Mobile: 1 карточка на 100% ширины с минимальными отступами
                "flex-[0_0_100%] min-w-0 px-1",
                // Tablet: 2 карточки
                "sm:flex-[0_0_50%] sm:max-w-[calc(50%-0.5rem)] sm:px-2",
                // Desktop: 3 карточки
                "lg:flex-[0_0_33.333%] lg:max-w-[calc(33.333%-1rem)] lg:px-3",
                className
            )}
        >
            <div className="h-full">
                {children}
            </div>
        </div>
    );
}
