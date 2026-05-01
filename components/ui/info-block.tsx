import {cn} from "@/lib/utils";
import {CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import React from "react";

interface InfoBlockProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "accent" | "success" | "warning" | "info";
    icon?: React.ReactNode;
    title?: string;
}

/**
 * Информационный блок с акцентным оформлением
 * Для блоков с важной информацией (рассрочки, бонусы, примечания)
 */
export function InfoBlock({
    children,
    className,
    variant = "default",
    icon,
    title,
}: InfoBlockProps) {
    const variantStyles = {
        default: "bg-primary/5 border-primary/20",
        accent: "bg-accent/10 border-accent/30",
        success: "bg-success/10 border-success/30",
        warning: "bg-warning/10 border-warning/30",
        info: "bg-info/10 border-info/30",
    };

    return (
        <div
            className={cn(
                "rounded-2xl border p-6",
                variantStyles[variant],
                className
            )}
        >
            <CardContent className="p-0 space-y-3">
                {(title || icon) && (
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-xl">{icon}</span>}
                        {title && (
                            <h3 className="font-semibold text-foreground">
                                {title}
                            </h3>
                        )}
                    </div>
                )}
                <div className="text-muted text-sm leading-relaxed">
                    {children}
                </div>
            </CardContent>
        </div>
    );
}

/**
 * Блок с бейджами (для рассрочек и партнеров)
 */
interface InfoBlockWithBadgesProps extends InfoBlockProps {
    badges?: string[];
}

export function InfoBlockWithBadges({
    badges,
    children,
    ...props
}: InfoBlockWithBadgesProps) {
    return (
        <InfoBlock {...props}>
            <div className="space-y-3">
                {children}
                {badges && badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {badges.map((badge, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="bg-background/50"
                            >
                                {badge}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </InfoBlock>
    );
}
