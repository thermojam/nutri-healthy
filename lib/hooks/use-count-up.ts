import {useState, useEffect, useRef} from "react";

interface UseCountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    startOnView?: boolean;
}

/**
 * Хук для анимации счетчика чисел
 * @param end - конечное значение
 * @param duration - длительность анимации в мс
 * @param suffix - суффикс (например, "+", "%", " лет")
 * @param startOnView - начинать анимацию при появлении в viewport
 */
export function useCountUp({
    end,
    duration = 2000,
    suffix = "",
    startOnView = true,
}: UseCountUpProps) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(!startOnView);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!startOnView || !ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            {threshold: 0.5}
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [startOnView, hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easedProgress * end);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, hasStarted]);

    return {count, ref, formatted: `${count}${suffix}`};
}
