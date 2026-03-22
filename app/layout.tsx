import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Нутрициолог [Имя] | Health-коучинг",
  description:
    "Индивидуальные консультации по нутрициологии и health-коучингу. Персональный план питания, сопровождение к здоровью.",
  keywords: [
    "нутрициолог",
    "health-коучинг",
    "здоровое питание",
    "консультация нутрициолога",
    "план питания",
  ],
  authors: [{ name: "Нутрициолог [Имя Фамилия]" }],
  creator: "Нутрициолог [Имя Фамилия]",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://yoursite.ru",
    title: "Нутрициолог [Имя] | Health-коучинг",
    description:
      "Индивидуальные консультации по нутрициологии и health-коучингу",
    siteName: "Нутрициолог [Имя]",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Нутрициолог [Имя] - Health-коучинг",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Нутрициолог [Имя] | Health-коучинг",
    description:
      "Индивидуальные консультации по нутрициологии и health-коучингу",
    images: ["/og-image.jpg"],
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
