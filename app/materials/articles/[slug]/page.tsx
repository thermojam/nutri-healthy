import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, Clock, Calendar, User, FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface Article {
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage?: { url: string; alt: string };
    author: { name: string; photo?: string };
    category: string;
    tags?: string[];
    publishedAt?: string;
    readingTime: number;
    views?: number;
}

const categoryLabels: Record<string, string> = {
    nutrition: "Нутрициология",
    psychology: "Психология",
    wellness: "Wellness",
    lifestyle: "Образ жизни",
};

const categoryColors: Record<string, string> = {
    nutrition: "bg-green-500",
    psychology: "bg-purple-500",
    wellness: "bg-blue-500",
    lifestyle: "bg-orange-500",
};

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/articles/${slug}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data || null;
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return null;
    }
}

export default async function ArticlePage({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            <Header/>

            <main className="flex-1">
                {/* Hero секция */}
                <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="container">
                        <Link href="/#materials">
                            <Button variant="ghost" size="sm" className="mb-6 gap-2">
                                <ArrowLeft className="h-4 w-4"/>
                                Назад к материалам
                            </Button>
                        </Link>

                        <div className="max-w-4xl mx-auto space-y-6">
                            <Badge className={categoryColors[article.category] || "bg-primary"}>
                                {categoryLabels[article.category] || "Статья"}
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {article.title}
                            </h1>

                            <p className="text-xl text-muted">
                                {article.excerpt}
                            </p>

                            {/* Мета информация */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    <span>{article.author.name}</span>
                                </div>
                                {article.publishedAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4"/>
                                        <span>
                      {new Date(article.publishedAt).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                      })}
                    </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4"/>
                                    <span>{article.readingTime} мин чтения</span>
                                </div>
                                {article.views && (
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4"/>
                                        <span>{article.views} просмотров</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Обложка */}
                {article.coverImage && (
                    <section className="py-8 bg-background">
                        <div className="container">
                            <div className="max-w-4xl mx-auto">
                                <div
                                    className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="h-24 w-24 text-muted opacity-50"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Контент статьи */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <article className="max-w-3xl mx-auto prose dark:prose-invert prose-lg">
                            {article.content.split("\n").map((paragraph, index) => {
                                // Заголовки H2
                                if (paragraph.startsWith("# ")) {
                                    return (
                                        <h2 key={index} className="text-3xl font-bold mt-12 mb-6">
                                            {paragraph.replace("# ", "")}
                                        </h2>
                                    );
                                }
                                // Заголовки H3
                                if (paragraph.startsWith("## ")) {
                                    return (
                                        <h3 key={index} className="text-2xl font-semibold mt-8 mb-4">
                                            {paragraph.replace("## ", "")}
                                        </h3>
                                    );
                                }
                                // Списки
                                if (paragraph.startsWith("- ")) {
                                    return (
                                        <li key={index} className="ml-4 text-muted leading-relaxed">
                                            {paragraph.replace("- ", "")}
                                        </li>
                                    );
                                }
                                // Обычный текст
                                if (paragraph.trim()) {
                                    return (
                                        <p key={index} className="text-muted leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    );
                                }
                                return null;
                            })}
                        </article>

                        {/* Теги */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Автор */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto">
                            <Card className="p-6 border-2">
                                <CardContent className="space-y-4">
                                    <h3 className="text-xl font-bold">Об авторе</h3>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {article.author.name[0]}
                      </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{article.author.name}</p>
                                            <p className="text-sm text-muted">
                                                Нутрициолог, health-коуч
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Хотите индивидуальную консультацию?
                            </h2>
                            <p className="text-lg text-muted">
                                Запишитесь на консультацию и получите персональные рекомендации
                            </p>
                            <Link href="/#contact">
                                <Button size="lg">
                                    Записаться на консультацию
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </>
    );
}
