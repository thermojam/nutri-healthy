import {cn} from "@/lib/utils";

interface SpinnerProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "accent" | "white";
}

/**
 * Spinner - индикатор загрузки в стилистике проекта
 * Использует градиенты и цвета бренда
 */
export function Spinner({className, size = "md", variant = "primary"}: SpinnerProps) {
    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    const variantClasses = {
        primary: "spinner-primary",
        accent: "spinner-accent",
        white: "spinner-white",
    };

    return (
        <div
            className={cn(
                "spinner",
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            role="status"
            aria-label="Загрузка"
        >
            <svg
                className="spinner-svg"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Фоновый круг */}
                <circle
                    className="spinner-track"
                    cx="25"
                    cy="25"
                    r="20"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                {/* Вращающийся сегмент */}
                <circle
                    className="spinner-indicator"
                    cx="25"
                    cy="25"
                    r="20"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="125.6"
                    strokeDashoffset="94.2"
                />
            </svg>
        </div>
    );
}
