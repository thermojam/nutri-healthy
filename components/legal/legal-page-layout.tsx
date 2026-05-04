import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft, Scale, Shield, FileText, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {BUSINESS} from "@/lib/legal/business";

interface LegalPageProps {
    title: string;
    description: string;
    version: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    lastUpdated?: Date;
    effectiveDate?: Date;
}

function formatRuDate(date: Date): string {
    return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export const metadata: Metadata = {
    robots: {index: true, follow: true},
};

export default function LegalPage({
    title,
    description,
    version,
    icon,
    children,
    lastUpdated = new Date(),
    effectiveDate,
}: LegalPageProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
                                <ArrowLeft className="h-4 w-4"/>
                                <span className="hidden sm:inline">На главную</span>
                                <span className="sm:hidden">Назад</span>
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted">
                            <Shield className="h-4 w-4"/>
                            <span className="hidden sm:inline">Юридическая информация</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container py-8 sm:py-12">
                {/* Заголовок страницы */}
                <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/50">
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{title}</h1>
                            <p className="text-sm sm:text-base text-muted mt-2">{description}</p>
                        </div>
                    </div>

                    {/* Информация о версии */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 pt-5 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/50">
                                    <FileText className="h-4 w-4 text-primary"/>
                                </div>
                                <span className="text-muted">Версия:</span>
                                <span className="font-semibold">{version}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/50">
                                    <Shield className="h-4 w-4 text-primary"/>
                                </div>
                                <span className="text-muted">Обновлено:</span>
                                <span className="font-semibold">{formatRuDate(lastUpdated)}</span>
                            </div>
                            {effectiveDate ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/50">
                                        <FileText className="h-4 w-4 text-primary"/>
                                    </div>
                                    <span className="text-muted">Действует с:</span>
                                    <span className="font-semibold">{formatRuDate(effectiveDate)}</span>
                                </div>
                            ) : null}
                            <div className="flex items-center gap-2 ml-auto">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/50">
                                    <Mail className="h-4 w-4 text-primary"/>
                                </div>
                                <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline font-medium">
                                    {BUSINESS.email}
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Основной контент — стили задаются непосредственно в компонентах
                    (см. components/legal/markdown-renderer.tsx). */}
                <article className="max-w-4xl mx-auto">
                    {children}
                </article>

                {/* Footer с контактами */}
                <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border">
                    <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
                        <CardContent className="p-6 sm:p-8">
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/50">
                                        <Scale className="h-5 w-5"/>
                                    </div>
                                    <span className="font-semibold">Юридическая информация</span>
                                </div>
                                <p className="text-sm text-muted max-w-2xl mx-auto">
                                    {BUSINESS.fullName}
                                    {BUSINESS.inn ? ` | ИНН ${BUSINESS.inn}` : null}
                                    {BUSINESS.ogrnip ? ` | ОГРНИП ${BUSINESS.ogrnip}` : null}
                                </p>
                                <p className="text-sm text-muted">
                                    {BUSINESS.address}
                                    {BUSINESS.phone ? (
                                        <>
                                            {" | "}
                                            <a href={`tel:${BUSINESS.phoneTel}`} className="text-primary hover:underline ml-1">
                                                {BUSINESS.phone}
                                            </a>
                                        </>
                                    ) : null}
                                </p>
                                <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
                                    <Link href="/legal/privacy-policy" className="hover:text-primary transition-colors">
                                        Политика конфиденциальности
                                    </Link>
                                    <Link href="/legal/contract" className="hover:text-primary transition-colors">
                                        Договор оферты
                                    </Link>
                                    <Link href="/legal/return-policy" className="hover:text-primary transition-colors">
                                        Возврат
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
