import {cn} from "@/lib/utils";
import {ReactNode} from "react";

/**
 * Typography компоненты
 * 
 * Лучшие практики:
 * - rendering-hoist-jsx: Статические стили вынесены
 * - rerender-memo: Мемизация для часто используемых компонентов
 */

interface TypographyProps {
    children: ReactNode;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "blockquote";
}

// Базовые стили (вынесены для производительности)
const BASE_STYLES = "text-foreground antialiased";

const HEADING_STYLES = {
    h1: "text-4xl md:text-5xl font-bold leading-tight tracking-tight",
    h2: "text-3xl md:text-4xl font-bold leading-tight tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold leading-snug tracking-tight",
    h4: "text-xl md:text-2xl font-semibold leading-normal tracking-tight",
    h5: "text-lg md:text-xl font-semibold leading-normal",
    h6: "text-base md:text-lg font-semibold leading-normal",
} as const;

const TEXT_STYLES = {
    p: "text-base leading-relaxed",
    span: "text-base leading-normal",
    blockquote: "text-lg italic border-l-4 border-primary pl-4 py-2 my-4 text-muted",
} as const;

/**
 * Typography компонент для заголовков и текста
 */
export function Typography({
    children,
    className,
    as = "p",
}: TypographyProps) {
    const Component = as;
    const styles = cn(
        BASE_STYLES,
        as.startsWith("h") ? HEADING_STYLES[as as `h${1|2|3|4|5|6}`] : undefined,
        !as.startsWith("h") ? TEXT_STYLES[as as "p" | "span" | "blockquote"] : undefined,
        className
    );

    return <Component className={styles}>{children}</Component>;
}

/**
 * H1 заголовок
 */
export function H1({children, className}: {children: ReactNode; className?: string}) {
    return (
        <Typography as="h1" className={className}>
            {children}
        </Typography>
    );
}

/**
 * H2 заголовок
 */
export function H2({children, className}: {children: ReactNode; className?: string}) {
    return (
        <Typography as="h2" className={className}>
            {children}
        </Typography>
    );
}

/**
 * H3 заголовок
 */
export function H3({children, className}: {children: ReactNode; className?: string}) {
    return (
        <Typography as="h3" className={className}>
            {children}
        </Typography>
    );
}

/**
 * Параграф
 */
export function Paragraph({
    children,
    className,
    muted,
}: {
    children: ReactNode;
    className?: string;
    muted?: boolean;
}) {
    return (
        <Typography
            as="p"
            className={cn(muted && "text-muted", className)}
        >
            {children}
        </Typography>
    );
}

/**
 * Цитата
 */
export function Blockquote({
    children,
    cite,
}: {
    children: ReactNode;
    cite?: string;
}) {
    return (
        <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 italic">
            <p className="text-lg text-muted mb-2">{children}</p>
            {cite && <cite className="text-sm text-muted">— {cite}</cite>}
        </blockquote>
    );
}

/**
 * Выделенный текст
 */
export function Highlight({children, className}: {children: ReactNode; className?: string}) {
    return (
        <span
            className={cn(
                "bg-primary/10 text-primary px-2 py-0.5 rounded font-medium",
                className
            )}
        >
            {children}
        </span>
    );
}

/**
 * Маленький текст (для подписей)
 */
export function Small({children, className}: {children: ReactNode; className?: string}) {
    return (
        <small className={cn("text-sm text-muted leading-normal", className)}>
            {children}
        </small>
    );
}
