"use client";

import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import PaymentForm from "@/components/features/payment-form";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceId: string;
    serviceName: string;
    tariff: "base" | "premium" | "vip";
    price: number;
    onSuccess?: (orderId: string) => void;
    onError?: (error: string) => void;
}

export default function OrderModal({
                                       isOpen,
                                       onClose,
                                       serviceId,
                                       serviceName,
                                       tariff,
                                       price,
                                       onSuccess,
                                       onError,
                                   }: OrderModalProps) {
    if (!isOpen) return null;

    const handleSuccess = (orderId: string) => {
        onSuccess?.(orderId);
    };

    const handleError = (error: string) => {
        onError?.(error);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-lg my-8 bg-background rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
                role="dialog"
                aria-modal="true"
            >
                {/* Header - Sticky */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 bg-background border-b border-border rounded-t-2xl">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Оформление заказа</h2>
                        <p className="text-xs sm:text-sm text-muted mt-0.5">Заполните данные для оплаты</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full shrink-0 ml-2"
                        aria-label="Закрыть"
                    >
                        <X className="h-5 w-5"/>
                    </Button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-4 sm:p-6">
                    {/* Информация о заказе - Compact */}
                    <div className="p-3 sm:p-4 bg-primary/5 rounded-xl border border-primary/20 mb-4">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{serviceName}</h3>
                                <p className="text-xs sm:text-sm text-muted capitalize">
                                    {tariff === "base" ? "Базовый" : tariff === "premium" ? "Оптимальный" : "VIP"}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-lg sm:text-xl font-bold text-primary">
                                    {new Intl.NumberFormat("ru-RU", {
                                        style: "currency",
                                        currency: "RUB",
                                        minimumFractionDigits: 0,
                                    }).format(price)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <PaymentForm
                        serviceId={serviceId}
                        serviceName={serviceName}
                        tariff={tariff}
                        price={price}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                </div>

                {/* Footer - Sticky */}
                <div className="sticky bottom-0 p-4 sm:p-6 bg-muted/50 border-t border-border rounded-b-2xl">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted shrink-0">
                            🔒 Безопасная оплата
                        </p>
                        <Button
                            variant="link"
                            onClick={onClose}
                            className="shrink-0"
                            size="sm"
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
