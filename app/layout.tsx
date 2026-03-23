import type {Metadata} from "next";
import {Nunito} from "next/font/google";
import {ThemeProvider} from "next-themes";
import {AnalyticsProvider} from "@/components/analytics";
import "./globals.css";

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["cyrillic", "latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: {
        default: "Нутрициолог [Имя] | Health-коучинг",
        template: "%s | Нутрициолог [Имя]",
    },
    description: "Индивидуальные консультации по нутрициологии и health-коучингу. Персональные планы питания, сопровождение и поддержка.",
    keywords: [
        "нутрициолог",
        "health-коучинг",
        "здоровое питание",
        "консультация нутрициолога",
        "план питания",
        "нутрициология онлайн",
        "коуч по здоровью",
    ],
    authors: [{name: "Нутрициолог [Имя Фамилия]"}],
    creator: "Нутрициолог [Имя Фамилия]",
    publisher: "Нутрициолог [Имя Фамилия]",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: "website",
        locale: "ru_RU",
        url: "/",
        siteName: "Нутрициолог [Имя]",
        title: "Нутрициолог [Имя] | Health-коучинг",
        description: "Индивидуальные консультации по нутрициологии и health-коучингу",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Нутрициолог [Имя] - Health-коучинг",
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Нутрициолог [Имя] | Health-коучинг",
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
            className={`${nunito.variable} h-full antialiased`}
            suppressHydrationWarning
        >
        <body className="min-h-full flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AnalyticsProvider>
                {children}
            </AnalyticsProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
