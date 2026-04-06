import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft, Scale, Shield, FileText, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";

interface LegalPageProps {
    title: string;
    description: string;
    version: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    lastUpdated?: Date;
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
                                <span className="font-semibold">{lastUpdated.toLocaleDateString("ru-RU", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/50">
                                    <Mail className="h-4 w-4 text-primary"/>
                                </div>
                                <a href="mailto:info@yoursite.ru" className="text-primary hover:underline font-medium">
                                    info@yoursite.ru
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Основной контент */}
                <article className="prose dark:prose-invert max-w-4xl mx-auto prose-headings:font-bold prose-headings:text-foreground prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pt-8 prose-h2:border-t prose-h2:border-border prose-p:text-muted prose-p:leading-relaxed prose-li:text-muted prose-li:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-ul:my-6 prose-ol:my-6 prose-section:my-8">
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
                                    ИП Каменская Ксения | ИНН 123456789012 | ОГРНИП 123456789012345
                                </p>
                                <p className="text-sm text-muted">
                                    123317, г. Москва, Пресненская наб., д. 10, стр. 2 | 
                                    <a href="tel:+79991234567" className="text-primary hover:underline ml-1">
                                        +7 (999) 123-45-67
                                    </a>
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
