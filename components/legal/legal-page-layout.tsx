import Link from "next/link";
import {ArrowLeft, Shield} from "lucide-react";
import {Button} from "@/components/ui/button";
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
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4"/>
                                <span className="hidden sm:inline">На главную</span>
                                <span className="sm:hidden">Назад</span>
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-muted">
                            <Shield className="h-4 w-4"/>
                            <span className="hidden sm:inline">Юридическая информация</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container py-8 sm:py-12">
                <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/50 shrink-0">
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
                            <p className="text-sm text-muted mt-1">{description}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted border-t border-border pt-4">
                        <span>Версия: <strong className="text-foreground">{version}</strong></span>
                        <span>Обновлено: <strong className="text-foreground">{formatRuDate(lastUpdated)}</strong></span>
                        {effectiveDate ? (
                            <span>Действует с: <strong className="text-foreground">{formatRuDate(effectiveDate)}</strong></span>
                        ) : null}
                        {BUSINESS.email ? (
                            <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline sm:ml-auto">
                                {BUSINESS.email}
                            </a>
                        ) : null}
                    </div>
                </div>

                <article className="max-w-4xl mx-auto">
                    {children}
                </article>

                <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-muted space-y-2">
                    <p className="font-medium text-foreground">
                        {BUSINESS.fullName}
                        {BUSINESS.inn ? ` · ИНН ${BUSINESS.inn}` : null}
                        {BUSINESS.ogrnip ? ` · ОГРНИП ${BUSINESS.ogrnip}` : null}
                    </p>
                    <p>
                        {BUSINESS.address}
                        {BUSINESS.phone ? (
                            <>
                                {" · "}
                                <a href={`tel:${BUSINESS.phoneTel}`} className="text-primary hover:underline">
                                    {BUSINESS.phone}
                                </a>
                            </>
                        ) : null}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs">
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
                </footer>
            </main>
        </div>
    );
}
