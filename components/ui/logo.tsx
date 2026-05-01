import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    expertName?: string;
    expertTitle?: string;
}

/**
 * KK Logo + Expert Identity (theme-aware)
 *
 * CSS variables:
 * --logo-stroke
 * --logo-dot
 * --logo-bg
 * --logo-ring
 *
 * --logo-text-primary
 * --logo-text-secondary
 */

export function Logo({
                         className,
                         size = "md",
                         expertName = "Kate Kovalska",
                         expertTitle = "Holistic Nutrition Expert",
                     }: LogoProps) {
    const id = useId();

    const sizeClasses = {
        sm: {
            wrapper: "gap-3",
            logo: "w-10 h-10",
            name: "text-sm",
            title: "text-[11px]",
        },
        md: {
            wrapper: "gap-4",
            logo: "w-14 h-14",
            name: "text-lg",
            title: "text-sm",
        },
        lg: {
            wrapper: "gap-5",
            logo: "w-20 h-20",
            name: "text-2xl",
            title: "text-base",
        },
    };

    const current = sizeClasses[size];

    return (
        <div
            className={cn(
                "flex items-center",
                current.wrapper,
                className
            )}
        >
            {/* Logo */}
            <svg
                className={cn("shrink-0", current.logo)}
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="KK Expert Logo"
            >
                {/* Background circle */}
                <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="var(--logo-bg)"
                    stroke="var(--logo-ring)"
                    strokeWidth="2"
                />

                {/* Shadow */}
                <defs>
                    <filter
                        id={`shadow-${id}`}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feDropShadow
                            dx="0"
                            dy="2"
                            stdDeviation="3"
                            floodOpacity="0.18"
                        />
                    </filter>
                </defs>

                {/* KK */}
                <g
                    filter={`url(#shadow-${id})`}
                    stroke="var(--logo-stroke)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Left K */}
                    <path d="M32 24 V72" />
                    <path d="M32 48 L48 24" />
                    <path d="M32 48 L48 72" />

                    {/* Right mirrored K */}
                    <path d="M64 24 V72" />
                    <path d="M64 48 L48 24" />
                    <path d="M64 48 L48 72" />
                </g>

                {/* Center dot */}
                <circle
                    cx="48"
                    cy="48"
                    r="4.5"
                    fill="var(--logo-dot)"
                />
            </svg>

            {/* Expert Info */}
            <div className="flex flex-col leading-tight">
                <span
                    className={cn(
                        "font-semibold tracking-tight",
                        current.name
                    )}
                    style={{
                        color: "var(--logo-text-primary)",
                    }}
                >
                    {expertName}
                </span>

                <span
                    className={cn(
                        "font-medium opacity-80",
                        current.title
                    )}
                    style={{
                        color: "var(--logo-text-secondary)",
                    }}
                >
                    {expertTitle}
                </span>
            </div>
        </div>
    );
}
