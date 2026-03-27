import {cn} from "@/lib/utils";

/**
 * Skeleton - Заглушка загрузки
 *
 * Лучшие практики:
 * - rendering-hoist-jsx: Анимация вынесена в CSS
 * - bundle-conditional: Загружается только когда нужна
 */

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "rounded";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "wave" | "none";
}

/**
 * Skeleton компонент для отображения загрузки
 */
export function Skeleton({
    className,
    variant = "text",
    width,
    height,
    animation = "pulse",
}: SkeletonProps) {
    const baseStyles = cn(
        "bg-muted",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-none",
        variant === "rounded" && "rounded-lg",
        variant === "text" && "rounded h-4",
        animation === "pulse" && "animate-pulse",
        animation === "wave" && "animate-shimmer",
        className
    );

    const style: React.CSSProperties = {};

    if (width !== undefined) {
        style.width = typeof width === "number" ? `${width}px` : width;
    }

    if (height !== undefined) {
        style.height = typeof height === "number" ? `${height}px` : height;
    }

    return <div className={baseStyles} style={style} />;
}

/**
 * Skeleton для карточки
 */
export function CardSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton variant="rounded" height={200} />
            <div className="space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" />
            </div>
        </div>
    );
}

/**
 * Skeleton для списка
 */
export function ListSkeleton({count = 5}: {count?: number}) {
    return (
        <div className="space-y-4">
            {Array.from({length: count}).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Skeleton для таблицы
 */
export function TableSkeleton({rows = 5}: {rows?: number}) {
    return (
        <div className="space-y-3">
            {Array.from({length: rows}).map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4">
                    <Skeleton variant="text" className="col-span-1" />
                    <Skeleton variant="text" className="col-span-1" />
                    <Skeleton variant="text" className="col-span-1" />
                    <Skeleton variant="text" className="col-span-1" />
                </div>
            ))}
        </div>
    );
}
