import React, {useId} from "react";
import {cn} from "@/lib/utils";

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
                         expertName = "Ksenia Kamenskaya",
                         expertTitle = "Holistic Expert",
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
                    <path d="M28 24 V72" />
                    <path d="M28 48 L42 26" />
                    <path d="M28 48 L42 70" />

                    {/* Right mirrored K */}
                    <path d="M68 24 V72" />
                    <path d="M68 48 L54 26" />
                    <path d="M68 48 L54 70" />
                </g>

                {/* Center dot */}
                <circle
                    cx="48"
                    cy="48"
                    r="4.5"
                    fill="var(--logo-dot)"
                />

                {/* Center dot */}
                <circle
                    cx="48"
                    cy="48"
                    r="4.5"
                    fill="var(--logo-dot)"
                />
            </svg>

            {/* Expert Info */}
            <div className="hidden sm:flex flex-col leading-[1.05]">
    <span
        className={cn(
            "font-semibold tracking-[-0.03em]",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
        )}
        style={{
            color: "var(--logo-text-primary)",
        }}
    >
        {expertName}
    </span>

                <span
                    className={cn(
                        "font-medium opacity-70 tracking-[-0.01em]",
                        size === "sm" && "text-[10px]",
                        size === "md" && "text-xs",
                        size === "lg" && "text-sm"
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
