import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

/**
 * KK Logo (theme-aware)
 *
 * CSS variables:
 * --logo-stroke
 * --logo-dot
 */
export function Logo({ className, size = "md" }: LogoProps) {
    const id = useId(); // для SSR-safe id

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    return (
        <svg
            className={cn(sizeClasses[size], className)}
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Nutri Healthy Logo"
        >
            <g
                stroke="var(--logo-stroke)"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Left K */}
                <path d="M30 20 V76" />
                <path d="M30 48 L48 20" />
                <path d="M30 48 L48 76" />

                {/* Right mirrored K */}
                <path d="M66 20 V76" />
                <path d="M66 48 L48 20" />
                <path d="M66 48 L48 76" />
            </g>

            {/* Center dot */}
            <circle cx="48" cy="49" r="4.2" fill="var(--logo-dot)" />        </svg>
    );
}
