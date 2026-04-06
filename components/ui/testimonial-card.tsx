import {memo} from "react";
import {Star, Quote} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {getInitials} from "@/lib/utils";

/**
 * Testimonial Card компонент
 * 
 * Лучшие практики:
 * - rerender-memo: memo для предотвращения лишних ререндеров
 * - rendering-hoist-jsx: Статические элементы вынесены
 */

interface Testimonial {
    _id: string;
    author: {
        name: string;
        photo?: string;
        anonymized?: boolean;
    };
    rating: number;
    title: string;
    content: string;
    serviceName?: string;
    verified?: boolean;
    video?: {
        url: string;
        thumbnail: string;
        duration: number;
    };
}

interface TestimonialCardProps {
    testimonial: Testimonial;
    className?: string;
    variant?: "default" | "compact" | "featured";
}

/**
 * Карточка отзыва
 */
export const TestimonialCard = memo(function TestimonialCard({
    testimonial,
    className,
    variant = "default",
}: TestimonialCardProps) {
    const {author, rating, title, content, serviceName, verified, video} = testimonial;

    const isCompact = variant === "compact";
    const isFeatured = variant === "featured";

    return (
        <Card
            className={cn(
                "h-full transition-shadow hover:shadow-lg",
                isFeatured && "border-primary border-2 shadow-lg",
                className
            )}
        >
            <CardContent
                className={cn(
                    "p-6 space-y-4",
                    isCompact && "p-4 space-y-3",
                    isFeatured && "p-8 space-y-6"
                )}
            >
                {/* Заголовок с автором */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className={cn(isCompact ? "h-10 w-10" : "h-12 w-12")}>
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getInitials(author.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{author.name}</p>
                            {serviceName && (
                                <p className="text-xs text-muted">{serviceName}</p>
                            )}
                        </div>
                    </div>

                    {/* Рейтинг */}
                    <div className="flex items-center gap-1">
                        {Array.from({length: 5}).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-4 w-4",
                                    i < rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Контент */}
                <div className="space-y-3">
                    {/* Заголовок отзыва */}
                    {!isCompact && title && (
                        <div className="flex items-start gap-2">
                            <Quote className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <h4 className="font-semibold text-lg">{title}</h4>
                        </div>
                    )}

                    {/* Текст отзыва */}
                    <p
                        className={cn(
                            "text-muted leading-relaxed",
                            isCompact && "text-sm line-clamp-3",
                            isFeatured && "text-base"
                        )}
                    >
                        {content}
                    </p>
                </div>

                {/* Verified badge */}
                {verified && (
                    <div className="flex items-center gap-2 text-xs text-success">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span>Проверенный отзыв</span>
                    </div>
                )}

                {/* Видео отзыв */}
                {video && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/10">
                        <img
                            src={video.thumbnail}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                            </div>
                        </div>
                        <span className="absolute bottom-2 right-2 text-xs bg-black/80 text-white px-2 py-1 rounded">
                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

/**
 * Компактная карточка отзыва для списка
 */
export const CompactTestimonial = memo(function CompactTestimonial({
    testimonial,
    className,
}: {
    testimonial: Testimonial;
    className?: string;
}) {
    return (
        <TestimonialCard
            testimonial={testimonial}
            variant="compact"
            className={className}
        />
    );
});

/**
 * Выделенная карточка отзыва (featured)
 */
export const FeaturedTestimonial = memo(function FeaturedTestimonial({
    testimonial,
    className,
}: {
    testimonial: Testimonial;
    className?: string;
}) {
    return (
        <TestimonialCard
            testimonial={testimonial}
            variant="featured"
            className={className}
        />
    );
});
