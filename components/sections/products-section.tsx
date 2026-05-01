"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {FadeIn} from "@/components/motion/fade-in";
import {Button} from "@/components/ui/button";
import {ServiceCardButton} from "@/components/ui/service-card-button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {InfoBlockWithBadges} from "@/components/ui/info-block";
import {Spinner} from "@/components/ui/spinner";
import OrderModal from "@/components/features/order-modal";
import {SECTION_BADGES} from "@/lib/constants/section-badges";
import {cn} from "@/lib/utils";
import type {ObjectId} from "mongoose";

const TABS = [
    {key: "nutrition", label: "Короткие"},
    {key: "health_coaching", label: "Длительные"},
    {key: "slavic_gymnastics", label: "Гимнастика"},
] as const;

const GRID_COLS = {
    nutrition: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    health_coaching: "grid-cols-1",
    slavic_gymnastics: "grid-cols-1 sm:grid-cols-2",
} as const;

type Category = "nutrition" | "health_coaching" | "slavic_gymnastics" | "other";

interface Service {
    _id: string | ObjectId;
    slug: string;
    title: string;
    description: string;
    category?: Category;
    icon?: string;
    image?: {
        url: string;
        alt: string;
    };
    pricing: {
        base: number;
        premium: number;
        vip: number;
    };
    duration?: {
        base?: number;
        premium?: number;
        vip?: number;
    };
    features: {
        base: string[];
        premium: string[];
        vip: string[];
    };
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
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.round((minutes / 60) * 10) / 10;
    return hours === Math.floor(hours) ? `${Math.floor(hours)} ч` : `${hours} ч`;
}

interface ProductsSectionProps {
    services: Service[];
}

export function ProductsSection({services}: ProductsSectionProps) {
    const [selectedService, setSelectedService] = useState<{
        serviceId: string;
        serviceName: string;
        tariff: "base" | "premium" | "vip";
        price: number;
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Category>("nutrition");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Проверка возврата с платежной системы
    useEffect(() => {
        const orderId = searchParams.get("order_id");
        const payment = searchParams.get("payment");

        // Если есть order_id и payment - пользователь вернулся с платежной системы
        if (orderId && payment) {
            // Перенаправляем на страницу успеха
            router.push(`/payment/success?order_id=${orderId}`);
        }
    }, [searchParams, router]);

    const handleOrderSuccess = (orderId: string) => {
        console.log("Order created:", orderId);
    };

    const handleOrderError = (error: string) => {
        console.error("Order error:", error);
        if (typeof window !== "undefined") {
            alert(`Ошибка при создании заказа: ${error}`);
        }
    };

    // Фильтруем услуги по активной вкладке
    const filteredServices = services.filter(
        (service) => (service.category || "nutrition") === activeTab
    );

    // Если нет данных из БД
    if (services.length === 0) {
        return (
            <section id="services" className="py-16 sm:py-24 bg-background">
                <div className="container">
                    <FadeIn className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                            Услуги и программы
                        </h2>
                        <div className="flex justify-center items-center">
                            <Spinner size="lg" />
                        </div>
                    </FadeIn>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="services" className="py-16 sm:py-24 bg-background">
                <div className="container">
                    <FadeIn className="text-center mb-8 sm:mb-12">
                        <Badge variant="secondary" className="mb-3 uppercase tracking-wide text-xs">
                            {SECTION_BADGES.products}
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                            Услуги и программы
                        </h2>
                        <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto leading-relaxed">
                            Тело кричит о помощи, а вы не слышите? Хроническая усталость, лишний вес,
                            гормональные сбои — это сигналы, что пора действовать.
                            <strong className="text-foreground"> Я помогу найти истинную причину</strong> и
                            восстановить здоровье через работу с психосоматикой и биохимией тела.
                        </p>
                    </FadeIn>

                    {/* Таб-навигация */}
                    <FadeIn delay={0.2} className="mb-8 sm:mb-12">
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as Category)}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                        activeTab === tab.key
                                            ? "bg-primary text-primary-foreground"
                                            : "border border-border text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Сетка карточек */}
                    <FadeIn delay={0.3}>
                        <div
                            className={cn(
                                "grid gap-5 sm:gap-6 w-full",
                                GRID_COLS[activeTab as keyof typeof GRID_COLS]
                            )}
                        >
                            {filteredServices.map((service) => (
                                <Card
                                    key={service._id.toString()}
                                    className={cn(
                                        "relative overflow-hidden transition-all duration-300",
                                        service.popular
                                            ? "border-warning border-2 shadow-md hover:shadow-lg"
                                            : "border-border hover:shadow-md"
                                    )}
                                >
                                    {/* Badge "ПОПУЛЯРНОЕ" */}
                                    {service.popular && (
                                        <Badge
                                            variant="default"
                                            className="absolute top-3 right-3 z-10 uppercase text-xs tracking-wide bg-orange-400 text-white hover:bg-orange-500"
                                        >
                                            Популярное
                                        </Badge>
                                    )}

                                    <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                                        {/* Заголовок и описание */}
                                        <div className="space-y-1 mb-4 flex-grow">
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                                {service.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-2">
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Информация и цена */}
                                        <div className="flex items-center justify-between text-sm border-t border-b border-border py-3 mb-4">
                                            <span className="text-muted text-xs">
                                                {service.duration?.base
                                                    ? formatDuration(service.duration.base)
                                                    : "по запросу"}
                                            </span>
                                            <span className="text-lg sm:text-xl font-bold text-primary">
                                                от {formatPrice(service.pricing.base)}
                                            </span>
                                        </div>

                                        {/* Кнопка "Выбрать" */}
                                        <ServiceCardButton
                                            isPopular={service.popular}
                                            onClick={() => {
                                                setSelectedService({
                                                    serviceId: service._id.toString(),
                                                    serviceName: service.title,
                                                    tariff: "premium",
                                                    price: service.pricing.premium,
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Выбрать
                                        </ServiceCardButton>

                                        {/* Рассрочка */}
                                        {service.pricing.base >= 3000 && (
                                            <p className="text-xs text-muted text-center mt-2">
                                                или от{" "}
                                                <span className="font-semibold text-primary">
                                                    {formatPrice(Math.round(service.pricing.base / 4))}
                                                </span>{" "}
                                                / мес
                                            </p>
                                        )}

                                        {/* Ссылка на подробнее */}
                                        <Link
                                            href={`/services/${service.slug}`}
                                            className="text-xs sm:text-sm text-primary hover:underline flex items-center justify-center mt-3"
                                        >
                                            Подробнее об услуге →
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Рассрочки и оплата */}
                    <FadeIn delay={0.6}>
                        <InfoBlockWithBadges
                            variant="accent"
                            icon="💳"
                            title="Оплата частями без переплат"
                            badges={["Яндекс.Рассрочка", "Долями", "Тинькофф", "Сплит"]}
                            className="mt-12"
                        >
                            <p className="text-sm">
                                Заботьтесь о здоровье уже сейчас — платите постепенно.
                                Оформление онлайн за 5 минут без справок и поручителей.
                            </p>
                        </InfoBlockWithBadges>
                    </FadeIn>

                    {/* CTA блок */}
                    <FadeIn delay={0.7} className="mt-12">
                        <div
                            className="bg-linear-to-br from-primary/10 via-background to-accent/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary/20">
                            <div className="text-center space-y-3 sm:space-y-4">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold px-2">
                                    💫 Не знаете, с чего начать?
                                </h3>
                                <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto px-2">
                                    Запишитесь на бесплатную 15-минутную консультацию.
                                    Я помогу определить вашу главную проблему и подберу оптимальную программу.
                                </p>
                                <Link href="/#contact" className="block w-full max-w-xs mx-auto">
                                    <Button size="lg" className="w-full">
                                        Бесплатная консультация
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Модальное окно с формой заказа */}
            {selectedService && (
                <OrderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    serviceId={selectedService.serviceId}
                    serviceName={selectedService.serviceName}
                    tariff={selectedService.tariff}
                    price={selectedService.price}
                    onSuccess={handleOrderSuccess}
                    onError={handleOrderError}
                />
            )}
        </>
    );
}
