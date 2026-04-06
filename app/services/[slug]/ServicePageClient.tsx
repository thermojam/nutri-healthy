"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {ArrowLeft, Check, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import OrderModal from "@/components/features/order-modal";

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

export default function ServicePageClient({service}: { service: Service }) {
    const [selectedTariff, setSelectedTariff] = useState<"base" | "premium" | "vip" | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTariffSelect = (tariff: "base" | "premium" | "vip") => {
        setSelectedTariff(tariff);
        setIsModalOpen(true);
    };

    const handleOrderSuccess = (orderId: string) => {
        console.log("Order created:", orderId);
        setIsModalOpen(false);
        window.location.href = "/payment/success";
    };

    const handleOrderError = (error: string) => {
        console.error("Order error:", error);
    };

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
                                    {/* Доверие - реальные фото клиентов */}
                                    <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8">
                                        <div className="flex -space-x-2 sm:-space-x-3">
                                            {[
                                                { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", alt: "Анна" },
                                                { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", alt: "Мария" },
                                                { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", alt: "Елена" },
                                                { url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face", alt: "Ольга" },
                                                { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", alt: "Наталья" },
                                            ].map((person, i) => (
                                                <div
                                                    key={i}
                                                    className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 border-background overflow-hidden shadow-md"
                                                >
                                                    <Image
                                                        src={person.url}
                                                        alt={person.alt}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex-1 max-w-xs text-left">
                                            <div className="flex items-center gap-1 mb-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className="w-3 h-3 sm:w-4 sm:h-4 fill-accent"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted">
                                                <span className="font-semibold text-foreground">500+</span>{" "}
                                                довольных клиентов
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Изображение */}
                            {service.image?.url ? (
                                <div className="relative aspect-video rounded-2xl overflow-hidden">
                                    <Image
                                        src={service.image.url}
                                        alt={service.image.alt || service.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-8xl">{service.icon || "✨"}</span>
                                    </div>
                                </div>
                            )}
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
                            <Card className="hover:shadow-lg transition-shadow flex flex-col">
                                <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">Базовый</h3>
                                        <p className="text-4xl font-bold text-primary">
                                            {formatPrice(service.pricing.base)}
                                        </p>
                                        <p className="text-sm text-muted mt-2">
                                            {formatDuration(service.duration.base)}
                                        </p>
                                    </div>

                                    <ul className="space-y-3 flex-1">
                                        {service.features.base.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-success shrink-0 mt-0.5"/>
                                                <span className="text-muted">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className="w-full mt-auto"
                                        size="lg"
                                        onClick={() => handleTariffSelect("base")}
                                    >
                                        Выбрать тариф
                                    </Button>

                                    {service.pricing.base >= 3000 && (
                                        <p className="text-center text-xs text-muted">
                                            Или в рассрочку от{" "}
                                            <span className="font-semibold text-primary">
                                                {formatPrice(Math.round(service.pricing.base / 4))}
                                            </span>{" "}
                                            / мес
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Премиум */}
                            <Card className={`border-primary border-2 shadow-lg relative ${service.popular ? "" : ""} flex flex-col`}>
                                {service.popular && (
                                    <div className="absolute top-0 right-0">
                                        <Badge className="rounded-bl-xl rounded-tr-none bg-primary">
                                            <Star className="h-3 w-3 mr-1"/>
                                            Популярный
                                        </Badge>
                                    </div>
                                )}

                                <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">Оптимальный</h3>
                                        <p className="text-4xl font-bold text-primary">
                                            {formatPrice(service.pricing.premium)}
                                        </p>
                                        <p className="text-sm text-muted mt-2">
                                            {formatDuration(service.duration.premium)}
                                        </p>
                                    </div>

                                    <ul className="space-y-3 flex-1">
                                        {service.features.premium.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5"/>
                                                <span className="text-muted">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className="w-full mt-auto"
                                        size="lg"
                                        onClick={() => handleTariffSelect("premium")}
                                    >
                                        Выбрать тариф
                                    </Button>

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
                            <Card className="hover:shadow-lg transition-shadow flex flex-col">
                                <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-2">VIP</h3>
                                        <p className="text-4xl font-bold text-primary">
                                            {formatPrice(service.pricing.vip)}
                                        </p>
                                        <p className="text-sm text-muted mt-2">
                                            {formatDuration(service.duration.vip)}
                                        </p>
                                    </div>

                                    <ul className="space-y-3 flex-1">
                                        {service.features.vip.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-success shrink-0 mt-0.5"/>
                                                <span className="text-muted">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className="w-full mt-auto"
                                        size="lg"
                                        onClick={() => handleTariffSelect("vip")}
                                    >
                                        Выбрать тариф
                                    </Button>

                                    {service.pricing.vip >= 3000 && (
                                        <p className="text-center text-xs text-muted">
                                            Или в рассрочку от{" "}
                                            <span className="font-semibold text-primary">
                                                {formatPrice(Math.round(service.pricing.vip / 4))}
                                            </span>{" "}
                                            / мес
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA - призыв к действию */}
                <section className="py-24 bg-background">
                    <div className="container">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Остались вопросы?
                            </h2>
                            <p className="text-lg text-muted">
                                Свяжитесь со мной любым удобным способом — я помогу выбрать оптимальную программу
                            </p>
                            <Link href="/#contact">
                                <Button size="lg">
                                    Написать мне →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>

            {/* Модальное окно с формой заказа */}
            {selectedTariff && (
                <OrderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    serviceId={service._id}
                    serviceName={service.title}
                    tariff={selectedTariff}
                    price={service.pricing[selectedTariff]}
                    onSuccess={handleOrderSuccess}
                    onError={handleOrderError}
                />
            )}
        </>
    );
}
