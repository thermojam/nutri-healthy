import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, Check, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface Service {
    _id: string;
    slug: string;
    title: string;
    description: string;
    fullDescription: string;
    category: string;
    icon?: string;
    image?: { url: string; alt: string };
    pricing: {
        base: number;
        premium: number;
        vip: number;
    };
    features: {
        base: string[];
        premium: string[];
        vip: string[];
    };
    duration: {
        base: number;
        premium: number;
        vip: number;
    };
    format: string[];
    popular?: boolean;
}

async function getService(slug: string): Promise<Service | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/services/${slug}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data || null;
    } catch (error) {
        console.error("Failed to fetch service:", error);
        return null;
    }
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function formatDuration(minutes: number): string {
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} ч ${mins} мин`;
    }
    return `${minutes} мин`;
}

const categoryLabels: Record<string, string> = {
    nutrition: "Нутрициология",
    health_coaching: "Health-коучинг",
    slavic_gymnastics: "Славянская гимнастика",
    other: "Другое",
};

export default async function ServicePage({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const service = await getService(slug);

    if (!service) {
        notFound();
    }

    return (
        <>
            <Header/>

            <main className="flex-1">
                {/* Hero секция */}
                <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="container">
                        <Link href="/#services">
                            <Button variant="ghost" size="sm" className="mb-6 gap-2">
                                <ArrowLeft className="h-4 w-4"/>
                                Назад к услугам
                            </Button>
                        </Link>

                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Контент */}
                            <div className="space-y-6">
                                <Badge variant="outline" className="text-sm">
                                    {categoryLabels[service.category] || "Услуга"}
                                </Badge>

                                <h1 className="text-4xl md:text-5xl font-bold">
                                    {service.title}
                                </h1>

                                <p className="text-xl text-muted">
                                    {service.description}
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                                            >
                                                <span className="text-xs">👤</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted">
                                        <span className="font-semibold text-foreground">500+</span>{" "}
                                        довольных клиентов
                                    </p>
                                </div>
                            </div>

                            {/* Изображение */}
                            <div
                                className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl">{service.icon || "✨"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Описание */}
                <section className="py-24 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <h2 className="text-3xl font-bold">Описание услуги</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                {service.fullDescription.split("\n").map((paragraph, index) => (
                                    <p key={index} className="text-muted leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Тарифы */}
                <section className="py-24 bg-card">
                    <div className="container">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Тарифы
                        </h2>

                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Базовый */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">Базовый</h3>
                                        <p className="text-4xl font-bold text-primary">
                                            {formatPrice(service.pricing.base)}
                                        </p>
                                        <p className="text-sm text-muted mt-2">
                                            {formatDuration(service.duration.base)}
                                        </p>
                                    </div>

                                    <ul className="space-y-3">
                                        {service.features.base.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-success shrink-0 mt-0.5"/>
                                                <span className="text-muted">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/#contact" className="block">
                                        <Button className="w-full" size="lg">
                                            Выбрать тариф
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Премиум */}
                            <Card className={`border-primary border-2 shadow-lg relative ${service.popular ? "" : ""}`}>
                                {service.popular && (
                                    <div className="absolute top-0 right-0">
                                        <Badge className="rounded-bl-xl rounded-tr-none bg-primary">
                                            <Star className="h-3 w-3 mr-1"/>
                                            Популярный
                                        </Badge>
                                    </div>
                                )}

                                <CardContent className="p-6 space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">Оптимальный</h3>
                                        <p className="text-4xl font-bold text-primary">
                                            {formatPrice(service.pricing.premium)}
                                        </p>
                                        <p className="text-sm text-muted mt-2">
                                            {formatDuration(service.duration.premium)}
                                        </p>
                                    </div>

                                    <ul className="space-y-3">
                                        {service.features.premium.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5"/>
                                                <span className="text-muted">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/#contact" className="block">
                                        <Button className="w-full" size="lg">
                                            Выбрать тариф
                                        </Button>
                                    </Link>

                                    {service.pricing.premium >= 3000 && (
                                        <p className="text-center text-sm text-muted">
                                            Или в рассрочку от{" "}
                                            <span className="font-semibold text-primary">
                        {formatPrice(Math.round(service.pricing.premium / 4))}
                      </span>{" "}
                                            / мес
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* VIP */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">VIP</h3>
                                        <p className="text-4xl font-bold text-primary">
                                            {formatPrice(service.pricing.vip)}
                                        </p>
                                        <p className="text-sm text-muted mt-2">
                                            {formatDuration(service.duration.vip)}
                                        </p>
                                    </div>

                                    <ul className="space-y-3">
                                        {service.features.vip.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-success shrink-0 mt-0.5"/>
                                                <span className="text-muted">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/#contact" className="block">
                                        <Button className="w-full" size="lg">
                                            Выбрать тариф
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Формат работы */}
                <section className="py-24 bg-background">
                    <div className="container">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Формат работы
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {service.format.map((format, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6 text-center">
                                        <div
                                            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">
                        {format === "online" ? "💻" : format === "offline" ? "🏢" : "🔄"}
                      </span>
                                        </div>
                                        <h3 className="font-semibold mb-2">
                                            {format === "online" ? "Онлайн" : format === "offline" ? "Офлайн" : "Гибридный"}
                                        </h3>
                                        <p className="text-sm text-muted">
                                            {format === "online"
                                                ? "Видеоконсультации через Zoom/Skype"
                                                : format === "offline"
                                                    ? "Личные встречи в офисе"
                                                    : "Комбинация онлайн и офлайн"}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 bg-card">
                    <div className="container">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Готовы начать?
                            </h2>
                            <p className="text-lg text-muted">
                                Запишитесь на консультацию и получите индивидуальный план действий
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
