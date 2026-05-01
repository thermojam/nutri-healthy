"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import {FadeIn} from "@/components/motion/fade-in";
import {Check, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {InfoBlockWithBadges} from "@/components/ui/info-block";
import {Spinner} from "@/components/ui/spinner";
import OrderModal from "@/components/features/order-modal";
import {Carousel, CarouselItem} from "@/components/ui/carousel";
import {cn} from "@/lib/utils";
import type {ObjectId} from "mongoose";

// Fallback изображения для услуг с Unsplash
const serviceImageFallbacks = [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",  // Нутрициология
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",  // Health-коучинг
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",  // Гимнастика
];

interface Service {
    _id: string | ObjectId;
    slug: string;
    title: string;
    description: string;
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
    const [activeTariffs, setActiveTariffs] = useState<Record<string, "base" | "premium" | "vip">>({});
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

    const handleTariffSelect = (service: Service, tariff: "base" | "premium" | "vip") => {
        setSelectedService({
            serviceId: service._id.toString(),
            serviceName: service.title,
            tariff,
            price: service.pricing[tariff],
        });
        setIsModalOpen(true);
    };

    const handleOrderSuccess = (orderId: string) => {
        console.log("Order created:", orderId);
        // Модалка закроется автоматически после редиректа на платежную систему
        // Не показываем успех здесь - пользователь будет перенаправлен на платежную страницу
    };

    const handleOrderError = (error: string) => {
        console.error("Order error:", error);
        // Показываем ошибку пользователю через toast или alert
        if (typeof window !== "undefined") {
            alert(`Ошибка при создании заказа: ${error}`);
        }
    };

    const getTariffData = (service: Service, tariff: "base" | "premium" | "vip") => {
        const prices = {
            base: service.pricing.base,
            premium: service.pricing.premium,
            vip: service.pricing.vip,
        };
        const features = {
            base: service.features.base,
            premium: service.features.premium,
            vip: service.features.vip,
        };
        const labels = {
            base: "Базовый",
            premium: "Оптимальный",
            vip: "VIP",
        };
        return {
            price: prices[tariff],
            features: features[tariff],
            label: labels[tariff],
        };
    };

    // Если нет данных из БД
    if (services.length === 0) {
        return (
            <section id="services" className="py-16 sm:py-24 bg-background">
                <div className="container">
                    <FadeIn className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                            Услуги и тарифы
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

                    <Carousel showDots={true} showArrows={false}>
                        {services.map((service, index) => {
                            const activeTariff = activeTariffs[service._id.toString()] || "premium";
                            const tariffData = getTariffData(service, activeTariff);

                            return (
                                <CarouselItem key={service._id.toString()}>
                                    <Card
                                        className={cn(
                                            "relative h-full overflow-hidden transition-all duration-300",
                                            service.popular ? "border-primary border-2 shadow-lg" : "hover:shadow-lg"
                                        )}
                                    >
                                        {service.popular && (
                                            <div className="absolute top-0 right-0 z-10">
                                                <Badge className="rounded-bl-xl rounded-tr-none bg-primary">
                                                    <Star className="h-3 w-3 mr-1"/>
                                                    Популярный
                                                </Badge>
                                            </div>
                                        )}

                                        <CardContent className="p-0">
                                            {/* Изображение услуги */}
                                            {(service.image?.url || serviceImageFallbacks[index]) && (
                                                <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                                                    <Image
                                                        src={service.image?.url || serviceImageFallbacks[index]}
                                                        alt={service.image?.alt || service.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-4 sm:p-6 space-y-4">
                                                {/* Заголовок */}
                                                <div className="text-center space-y-2">
                                                    <h3 className="text-lg sm:text-xl font-bold">{service.title}</h3>
                                                    <p className="text-xs sm:text-sm text-muted">{service.description}</p>
                                                </div>

                                                {/* Вкладки тарифов */}
                                                <div className="flex p-1 bg-muted/50 rounded-xl">
                                                    {(["base", "premium", "vip"] as const).map((tariff) => {
                                                        const isActive = activeTariff === tariff;
                                                        const data = getTariffData(service, tariff);
                                                        return (
                                                            <button
                                                                key={tariff}
                                                                onClick={() => setActiveTariffs(prev => ({
                                                                    ...prev,
                                                                    [service._id.toString()]: tariff
                                                                }))}
                                                                className={cn(
                                                                    "flex-1 px-2 py-3 rounded-lg text-xs font-medium transition-all duration-200",
                                                                    isActive
                                                                        ? "bg-white dark:bg-card text-foreground shadow-sm"
                                                                        : "text-muted hover:text-foreground hover:bg-muted/50"
                                                                )}
                                                            >
                                                                <div
                                                                    className="font-semibold whitespace-nowrap">{data.label}</div>
                                                                <div className={cn(
                                                                    "text-xs mt-1 font-semibold",
                                                                    isActive ? "text-primary" : "text-muted"
                                                                )}>
                                                                    {formatPrice(data.price)}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Контент активного тарифа */}
                                                <div className="space-y-3 min-h-[280px]">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{tariffData.label}</span>
                                                        <span className="text-xl sm:text-2xl font-bold text-primary">
                                                        {formatPrice(tariffData.price)}
                                                    </span>
                                                    </div>

                                                    <ul className="space-y-2">
                                                        {tariffData.features.slice(0, 5).map((feature, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                                <Check className={cn(
                                                                    "h-4 w-4 shrink-0 mt-0.5",
                                                                    activeTariff === "premium" ? "text-primary" : "text-success"
                                                                )}/>
                                                                <span className="text-muted">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <Button
                                                        className="w-full text-sm"
                                                        variant={activeTariff === "premium" ? "default" : "outline"}
                                                        onClick={() => handleTariffSelect(service, activeTariff as "base" | "premium" | "vip")}
                                                    >
                                                        {activeTariff === "premium" ? "Выбрать" : `Выбрать (${tariffData.label})`}
                                                    </Button>

                                                    {/* Рассрочка */}
                                                    {tariffData.price >= 3000 && (
                                                        <div className="text-center pt-2 border-t border-border">
                                                            <p className="text-xs text-muted">
                                                                Или в рассрочку от{" "}
                                                                <span className="font-semibold text-primary">
                                                                {formatPrice(Math.round(tariffData.price / 4))}
                                                            </span>{" "}
                                                                / мес
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="pt-3 border-t border-border">
                                                        <Link
                                                            href={`/services/${service.slug}`}
                                                            className="text-xs sm:text-sm text-primary hover:underline flex items-center justify-center gap-1"
                                                        >
                                                            Подробнее об услуге →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            );
                        })}
                    </Carousel>

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
                            className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary/20">
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
