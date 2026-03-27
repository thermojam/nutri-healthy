"use client";

import {useState} from "react";
import Link from "next/link";
import {FadeIn} from "@/components/motion/fade-in";
import {StaggerChildren, StaggerItem} from "@/components/motion/stagger-children";
import {Check, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import OrderModal from "@/components/features/order-modal";

import type {ObjectId} from "mongoose";

interface Service {
    _id: string | ObjectId;
    slug: string;
    title: string;
    description: string;
    icon?: string;
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
        setIsModalOpen(false);
        window.location.href = "/payment/success";
    };

    const handleOrderError = (error: string) => {
        console.error("Order error:", error);
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
                        <p className="text-sm sm:text-lg text-muted max-w-2xl mx-auto">
                            Загрузка услуг...
                        </p>
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
                            Услуги и тарифы
                        </h2>
                        <p className="text-sm sm:text-lg text-muted max-w-2xl mx-auto">
                            Выберите подходящую программу для достижения ваших целей
                        </p>
                    </FadeIn>

                    <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {services.map((service) => (
                            <StaggerItem key={service._id.toString()}>
                                <Card
                                    className={`relative h-full overflow-hidden ${
                                        service.popular
                                            ? "border-primary border-2 shadow-lg"
                                            : "hover:shadow-lg transition-shadow"
                                    }`}
                                >
                                    {service.popular && (
                                        <div className="absolute top-0 right-0">
                                            <Badge className="rounded-bl-xl rounded-tr-none bg-primary">
                                                <Star className="h-3 w-3 mr-1"/>
                                                Популярный
                                            </Badge>
                                        </div>
                                    )}

                                    <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                        {/* Заголовок */}
                                        <div className="text-center space-y-2">
                                            <span className="text-3xl sm:text-4xl">{service.icon || "✨"}</span>
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{service.title}</h3>
                                            <p className="text-xs sm:text-sm text-muted">{service.description}</p>
                                        </div>

                                        {/* Тарифы */}
                                        <div className="space-y-4">
                                            {/* Базовый */}
                                            <div className="p-4 rounded-xl bg-card border border-border">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium">Базовый</span>
                                                    <span className="text-lg font-bold">
                                                        {formatPrice(service.pricing.base)}
                                                    </span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {service.features.base.slice(0, 3).map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm">
                                                            <Check className="h-4 w-4 text-success shrink-0 mt-0.5"/>
                                                            <span className="text-muted">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Button
                                                    className="w-full mt-3"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTariffSelect(service, "base")}
                                                >
                                                    Выбрать
                                                </Button>
                                            </div>

                                            {/* Премиум */}
                                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-primary">
                                                        Оптимальный
                                                    </span>
                                                    <span className="text-lg font-bold text-primary">
                                                        {formatPrice(service.pricing.premium)}
                                                    </span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {service.features.premium.slice(0, 4).map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm">
                                                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5"/>
                                                            <span className="text-muted">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Button
                                                    className="w-full mt-3"
                                                    size="sm"
                                                    onClick={() => handleTariffSelect(service, "premium")}
                                                >
                                                    Выбрать
                                                </Button>
                                            </div>

                                            {/* VIP */}
                                            <div className="p-4 rounded-xl bg-card border border-border">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium">VIP</span>
                                                    <span className="text-lg font-bold">
                                                        {formatPrice(service.pricing.vip)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted mb-3">
                                                    Максимальная поддержка и результат
                                                </p>
                                                <Button
                                                    className="w-full"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTariffSelect(service, "vip")}
                                                >
                                                    Выбрать
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Рассрочка */}
                                        {service.pricing.premium >= 3000 && (
                                            <div className="text-center">
                                                <p className="text-sm text-muted">
                                                    Или в рассрочку от{" "}
                                                    <span className="font-semibold text-primary">
                                                        {formatPrice(Math.round(service.pricing.premium / 4))}
                                                    </span>{" "}
                                                    / мес
                                                </p>
                                            </div>
                                        )}

                                        {/* Ссылка на подробную страницу */}
                                        <div className="pt-4 border-t border-border">
                                            <Link
                                                href={`/services/${service.slug}`}
                                                className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                                            >
                                                Подробнее об услуге →
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        ))}
                    </StaggerChildren>

                    {/* Примечание */}
                    <FadeIn delay={0.6}>
                        <div className="mt-12 p-6 bg-accent/5 rounded-2xl border border-accent/20 text-center">
                            <p className="text-sm text-muted">
                                💳 Доступны рассрочки от партнеров: Яндекс.Рассрочка, Долями, Тинькофф
                            </p>
                            <p className="text-xs text-muted mt-2">
                                Возможна оплата частями без процентов и переплат
                            </p>
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
