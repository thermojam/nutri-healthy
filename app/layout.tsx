import type {Metadata} from "next";
import {Nunito, Playfair_Display} from "next/font/google";
import {ThemeProvider} from "next-themes";
import {AnalyticsProvider} from "@/components/analytics";
import {ErrorBoundary} from "@/components/ui/error-boundary";
import {CookieBannerWrapper} from "@/components/features/cookie-banner";
import "./globals.css";

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["cyrillic", "latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
    variable: "--font-elegant",
    subsets: ["cyrillic", "latin"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "Ксения Каменская",
        template: "%s | Ксения Каменская",
    },
    description: "Индивидуальные консультации по психологии. Персональные планы питания, сопровождение и поддержка.",
    keywords: [
        "психолог",
        "здоровое питание",
        "консультация нутрициолога",
        "план питания",
        "коуч по здоровью",
    ],
    authors: [{name: "Ксения Каменская"}],
    creator: "Ксения Каменская",
    publisher: "Ксения Каменская",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' }, // Стандарт для старых браузеров
            { url: '/icon.svg', type: 'image/svg+xml' }, // ОСНОВНОЙ: будет четким везде
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180' }, // Для закладок Safari и iOS
        ],
    },
    openGraph: {
        type: "website",
        locale: "ru_RU",
        url: "/",
        siteName: "Ксения Каменская",
        title: "Ксения Каменская",
        description: "Индивидуальные консультации по нутрициологии и health-коучингу",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Ксения Каменская - Нутрициолог | Health-коучинг",
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Ксения Каменская",
        description: "Индивидуальные консультации по нутрициологии и health-коучингу",
        images: ["/og-image.jpg"],
        creator: "@username",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        yandex: "your-yandex-verification-code",
        google: "your-google-verification-code",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ru"
            className={`${nunito.variable} ${playfair.variable} h-full antialiased`}
            suppressHydrationWarning
        >
        <body className="min-h-screen flex flex-col overflow-x-hidden">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ErrorBoundary>
                <AnalyticsProvider>
                    {children}
                    <CookieBannerWrapper />
                </AnalyticsProvider>
            </ErrorBoundary>
        </ThemeProvider>
        </body>
        </html>
    );
}
