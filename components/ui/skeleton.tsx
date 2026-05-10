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

/**
 * Skeleton для карточки материала (статья/видео)
 */
export function MaterialCardSkeleton() {
    return (
        <div className="overflow-hidden bg-gradient-to-br from-background to-muted/20 rounded-lg p-4 sm:p-5 space-y-3">
            {/* Иконка или превью */}
            <Skeleton variant="rounded" height={128} />

            {/* Заголовок */}
            <div className="space-y-2">
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="75%" />
            </div>

            {/* Категория и время */}
            <div className="space-y-2 pt-2">
                <Skeleton variant="rounded" width={80} height={20} />
                <Skeleton variant="text" width="50%" />
            </div>
        </div>
    );
}

/**
 * Skeleton сетка для материалов (3 колонки)
 */
export function MaterialsGridSkeleton({count = 3}: {count?: number}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({length: count}).map((_, i) => (
                <MaterialCardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Skeleton для вебинара (горизонтальная карточка)
 */
export function WebinarCardSkeleton() {
    return (
        <div className="overflow-hidden bg-gradient-to-br from-background to-muted/20 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Плей-превью */}
            <Skeleton variant="rounded" width="100%" height={160} className="sm:h-32 sm:w-48 sm:flex-shrink-0" />

            {/* Информация */}
            <div className="flex-1 space-y-3">
                <div className="space-y-2">
                    <Skeleton variant="text" width="85%" />
                    <Skeleton variant="text" width="70%" />
                </div>
                <div className="flex gap-3">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="40%" />
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton для кейса (карточка с аватаром)
 */
export function CaseCardSkeleton() {
    return (
        <div className="overflow-hidden bg-gradient-to-br from-background to-muted/20 rounded-lg p-5 sm:p-6 space-y-4">
            {/* Аватар и информация */}
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={56} height={56} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="30%" />
                </div>
            </div>

            {/* Заголовок результата */}
            <Skeleton variant="text" width="80%" height={20} />

            {/* Два столбца БЫЛО/СТАЛО */}
            <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-2">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="100%" height={16} />
                </div>
                <div className="space-y-2">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="80%" height={16} />
                </div>
            </div>

            {/* Цитата */}
            <div className="pt-2 border-t border-border/30">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
            </div>
        </div>
    );
}

/**
 * Skeleton для сетки кейсов (карусель)
 */
export function CasesCarouselSkeleton({count = 1}: {count?: number}) {
    return (
        <div className="space-y-4">
            {Array.from({length: count}).map((_, i) => (
                <CaseCardSkeleton key={i} />
            ))}
        </div>
    );
}
