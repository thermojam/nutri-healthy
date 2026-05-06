"use client";

import Link from "next/link";
import {Home, Search, ArrowLeft, Leaf} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Анимированная графика */}
                <div className="relative">
                    <div className="relative w-48 h-48 mx-auto">
                        {/* Фоновый круг с градиентом */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 animate-pulse"/>

                        {/* Основной круг */}
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                                {/* Центральная иконка */}
                                <Leaf className="h-20 w-20 text-primary/60"/>
                            </div>
                        </div>

                        {/* Плавающие элементы */}
                        <div className="absolute top-2 left-1/4 w-3 h-3 rounded-full bg-primary/40 animate-bounce" style={{animationDelay: "0s"}}/>
                        <div className="absolute top-8 right-1/4 w-2 h-2 rounded-full bg-accent/50 animate-bounce" style={{animationDelay: "0.2s"}}/>
                        <div className="absolute bottom-4 left-1/3 w-2.5 h-2.5 rounded-full bg-primary/30 animate-bounce" style={{animationDelay: "0.4s"}}/>
                    </div>
                </div>

                {/* Текст 404 */}
                <div className="space-y-4">
                    <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        404
                    </h1>

                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Страница не найдена
                    </h2>

                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Похоже, эта страница затерялась в нашем саду знаний. 
                        Но не переживайте — у нас много полезного на главной!
                    </p>
                </div>

                {/* Кнопки навигации */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="h-5 w-5"/>
                            На главную
                        </Link>
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-5 w-5"/>
                        Назад
                    </Button>
                </div>

                {/* Декоративные элементы */}
                <div className="pt-12 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-4">
                        Или перейдите в один из разделов:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/services/nutrition">Услуги</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/materials/articles">Статьи</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/materials/videos">Видео</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
