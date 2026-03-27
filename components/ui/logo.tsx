import React from "react";
import {cn} from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

/**
 * SVG-логотип с градиентными лепестками
 * Цвета адаптируются под тему через CSS-переменные для градиентов и обводки
 */
export function Logo({className, size = "md"}: LogoProps) {
    const sizeClasses = {
        sm: "w-10 h-10",
        md: "w-14 h-14",
        lg: "w-20 h-20",
    };

    return (
        <svg
            className={cn(sizeClasses[size], className)}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Логотип Нутрициолог"
            role="img"
        >
            {/* Градиенты для светлой темы */}
            <defs>
                {/* Градиент для лепестка 1 - светлая тема */}
                <linearGradient id="gradient-light-0" x1="26.9" y1="20.1075" x2="26.9" y2="30.6"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--logo-gradient-start-light)"/>
                    <stop offset="0.46875" stopColor="var(--logo-gradient-middle-light)"/>
                    <stop offset="1" stopColor="var(--logo-gradient-end-light)"/>
                </linearGradient>
                {/* Градиент для лепестка 2 - светлая тема */}
                <linearGradient id="gradient-light-1" x1="12.3" y1="20.1075" x2="12.3" y2="30.6"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--logo-gradient-start-light)"/>
                    <stop offset="0.46875" stopColor="var(--logo-gradient-middle-light)"/>
                    <stop offset="1" stopColor="var(--logo-gradient-end-light)"/>
                </linearGradient>
                {/* Градиент для центрального лепестка - светлая тема */}
                <linearGradient id="gradient-light-2" x1="19.6395" y1="9" x2="19.6395" y2="30.4"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--logo-gradient-start-light)"/>
                    <stop offset="0.46875" stopColor="var(--logo-gradient-middle-light)"/>
                    <stop offset="1" stopColor="var(--logo-gradient-end-light)"/>
                </linearGradient>

                {/* Градиент для лепестка 1 - темная тема */}
                <linearGradient id="gradient-dark-0" x1="26.9" y1="20.1075" x2="26.9" y2="30.6"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--logo-gradient-start-dark)"/>
                    <stop offset="0.46875" stopColor="var(--logo-gradient-middle-dark)"/>
                    <stop offset="1" stopColor="var(--logo-gradient-end-dark)"/>
                </linearGradient>
                {/* Градиент для лепестка 2 - темная тема */}
                <linearGradient id="gradient-dark-1" x1="12.3" y1="20.1075" x2="12.3" y2="30.6"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--logo-gradient-start-dark)"/>
                    <stop offset="0.46875" stopColor="var(--logo-gradient-middle-dark)"/>
                    <stop offset="1" stopColor="var(--logo-gradient-end-dark)"/>
                </linearGradient>
                {/* Градиент для центрального лепестка - темная тема */}
                <linearGradient id="gradient-dark-2" x1="19.6395" y1="9" x2="19.6395" y2="30.4"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="var(--logo-gradient-start-dark)"/>
                    <stop offset="0.46875" stopColor="var(--logo-gradient-middle-dark)"/>
                    <stop offset="1" stopColor="var(--logo-gradient-end-dark)"/>
                </linearGradient>
            </defs>

            {/* Лепесток 1 - правый */}
            <path
                className="logo-petal-light"
                d="M34.2 20.3C33.1 26.4 27.8 30.6 21.9 30.6C21.1 30.6 20.4 30.5 19.6 30.4C20.9 29.1 21.9 27.6 22.6 26.1C22.6 26 22.7 25.9 22.7 25.8C23 25.2 23.2 24.6 23.4 24C23.5 23.8 23.5 23.5 23.6 23.3C24.4 22.6 25.2 22 26.1 21.5C28.6 20.3 31.4 19.8 34.2 20.3Z"
                fill="url(#gradient-light-0)"
                stroke="var(--logo-stroke-light)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Лепесток 2 - левый */}
            <path
                className="logo-petal-light"
                d="M19.6 30.4C18.8 30.5 18.1 30.6 17.3 30.6C11.3 30.6 6.1 26.4 5 20.3C7.9 19.8 10.7 20.3 13 21.5C13.9 22 14.8 22.6 15.5 23.3C15.6 23.5 15.6 23.8 15.7 24C15.9 24.6 16.1 25.2 16.3 25.8C16.3 25.9 16.4 26 16.4 26.1C17.3 27.6 18.3 29.1 19.6 30.4Z"
                fill="url(#gradient-light-1)"
                stroke="var(--logo-stroke-light)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Центральный лепесток */}
            <path
                className="logo-petal-light"
                d="M24 19.7C24 20.9 23.9 22.1 23.6 23.3C23.5 23.5 23.5 23.8 23.4 24C23.2 24.6 23 25.2 22.7 25.8C22.7 25.9 22.6 26 22.6 26.1C21.9 27.7 20.8 29.1 19.6 30.4C18.3 29.1 17.3 27.6 16.6 26.1C16.6 26 16.5 25.9 16.5 25.8C16.2 25.2 16 24.6 15.9 24C15.8 23.8 15.8 23.5 15.7 23.3C15 20.5 15.2 17.5 16.1 14.8C16.8 12.7 18 10.7 19.7 9C21.4 10.7 22.6 12.7 23.3 14.8C23.8 16.4 24 18 24 19.7Z"
                fill="url(#gradient-light-2)"
                stroke="var(--logo-stroke-light)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Дополнительные контуры - светлая тема */}
            <path
                className="logo-stroke-light"
                d="M29.2 13.3C29.2 16.4 28.1 19.3 26.2 21.5C25.3 22 24.4 22.6 23.7 23.3C24 22.1 24.1 20.9 24.1 19.7C24.1 18 23.8 16.4 23.3 14.8C25 13.8 27 13.3 29.2 13.3Z"
                stroke="var(--logo-stroke-light)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                className="logo-stroke-light"
                d="M15.6 23.3C14.8 22.6 14 22 13.1 21.5C11.2 19.3 10.1 16.4 10.1 13.3C12.2 13.3 14.3 13.8 16 14.8C15 17.5 14.9 20.5 15.6 23.3Z"
                stroke="var(--logo-stroke-light)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Лепесток 1 - правый (темная тема) */}
            <path
                className="logo-petal-dark"
                d="M34.2 20.3C33.1 26.4 27.8 30.6 21.9 30.6C21.1 30.6 20.4 30.5 19.6 30.4C20.9 29.1 21.9 27.6 22.6 26.1C22.6 26 22.7 25.9 22.7 25.8C23 25.2 23.2 24.6 23.4 24C23.5 23.8 23.5 23.5 23.6 23.3C24.4 22.6 25.2 22 26.1 21.5C28.6 20.3 31.4 19.8 34.2 20.3Z"
                fill="url(#gradient-dark-0)"
                stroke="var(--logo-stroke-dark)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Лепесток 2 - левый (темная тема) */}
            <path
                className="logo-petal-dark"
                d="M19.6 30.4C18.8 30.5 18.1 30.6 17.3 30.6C11.3 30.6 6.1 26.4 5 20.3C7.9 19.8 10.7 20.3 13 21.5C13.9 22 14.8 22.6 15.5 23.3C15.6 23.5 15.6 23.8 15.7 24C15.9 24.6 16.1 25.2 16.3 25.8C16.3 25.9 16.4 26 16.4 26.1C17.3 27.6 18.3 29.1 19.6 30.4Z"
                fill="url(#gradient-dark-1)"
                stroke="var(--logo-stroke-dark)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Центральный лепесток (темная тема) */}
            <path
                className="logo-petal-dark"
                d="M24 19.7C24 20.9 23.9 22.1 23.6 23.3C23.5 23.5 23.5 23.8 23.4 24C23.2 24.6 23 25.2 22.7 25.8C22.7 25.9 22.6 26 22.6 26.1C21.9 27.7 20.8 29.1 19.6 30.4C18.3 29.1 17.3 27.6 16.6 26.1C16.6 26 16.5 25.9 16.5 25.8C16.2 25.2 16 24.6 15.9 24C15.8 23.8 15.8 23.5 15.7 23.3C15 20.5 15.2 17.5 16.1 14.8C16.8 12.7 18 10.7 19.7 9C21.4 10.7 22.6 12.7 23.3 14.8C23.8 16.4 24 18 24 19.7Z"
                fill="url(#gradient-dark-2)"
                stroke="var(--logo-stroke-dark)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Дополнительные контуры - темная тема */}
            <path
                className="logo-stroke-dark"
                d="M29.2 13.3C29.2 16.4 28.1 19.3 26.2 21.5C25.3 22 24.4 22.6 23.7 23.3C24 22.1 24.1 20.9 24.1 19.7C24.1 18 23.8 16.4 23.3 14.8C25 13.8 27 13.3 29.2 13.3Z"
                stroke="var(--logo-stroke-dark)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                className="logo-stroke-dark"
                d="M15.6 23.3C14.8 22.6 14 22 13.1 21.5C11.2 19.3 10.1 16.4 10.1 13.3C12.2 13.3 14.3 13.8 16 14.8C15 17.5 14.9 20.5 15.6 23.3Z"
                stroke="var(--logo-stroke-dark)"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
