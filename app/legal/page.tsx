import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft, Scale} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {getLegalIcon} from "@/components/legal/icon-map";
import {getIndexLegalDocuments} from "@/lib/legal/registry";
import {type LegalCategory} from "@/lib/legal/frontmatter";

export const metadata: Metadata = {
    title: "Юридическая информация | Ксения Каменская",
    description: "Договор оферты, политика конфиденциальности, согласия на обработку данных и порядок оказания услуг.",
    robots: {index: true, follow: true},
};

const CATEGORY_LABELS: Record<LegalCategory, string> = {
    contract: "Договоры",
    privacy: "Конфиденциальность",
    consent: "Согласия",
    policy: "Политики и регламенты",
    info: "Информация",
};

const CATEGORY_ORDER: LegalCategory[] = ["contract", "privacy", "consent", "policy", "info"];

export default async function LegalIndexPage() {
    const docs = await getIndexLegalDocuments();

    const grouped = new Map<LegalCategory, typeof docs>();
    for (const doc of docs) {
        const cat = doc.frontmatter.category;
        if (!grouped.has(cat)) grouped.set(cat, []);
        grouped.get(cat)!.push(doc);
    }

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
                            <Scale className="h-4 w-4"/>
                            <span className="hidden sm:inline">Юридическая информация</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container py-8 sm:py-12">
                <div className="max-w-4xl mx-auto mb-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/50">
                            <Scale className="h-6 w-6 sm:h-7 sm:w-7"/>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                Юридическая информация
                            </h1>
                            <p className="text-sm sm:text-base text-muted mt-2">
                                Полный список документов, регулирующих оказание услуг и обработку данных
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto space-y-10">
                    {CATEGORY_ORDER.map((cat) => {
                        const items = grouped.get(cat);
                        if (!items?.length) return null;

                        return (
                            <section key={cat}>
                                <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                                    {CATEGORY_LABELS[cat]}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {items.map((doc) => {
                                        const Icon = getLegalIcon(doc.frontmatter.icon);
                                        return (
                                            <Link
                                                key={doc.frontmatter.slug}
                                                href={`/legal/${doc.frontmatter.slug}`}
                                                className="block group"
                                            >
                                                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-primary/5">
                                                    <CardContent className="p-5 flex items-start gap-4">
                                                        <div className="w-11 h-11 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/30 group-hover:bg-primary/20 transition-colors">
                                                            <Icon className="h-5 w-5"/>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                                {doc.frontmatter.title}
                                                            </h3>
                                                            <p className="text-sm text-muted mt-1 line-clamp-2">
                                                                {doc.frontmatter.description}
                                                            </p>
                                                            <p className="text-xs text-muted mt-2">
                                                                Версия {doc.frontmatter.version}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
