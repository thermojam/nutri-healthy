"use client";

import {useState, useId} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {CreditCard, Smartphone, Building, CheckCircle, AlertCircle, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {LegalConsentCheckboxes} from "@/components/features/legal-consent-checkboxes";
import {cn} from "@/lib/utils";
import {FadeIn} from "@/components/motion/fade-in";

// Схема валидации формы заказа
const orderFormSchema = z.object({
    firstName: z.string().min(2, "Имя должно содержать не менее 2 символов"),
    lastName: z.string().min(2, "Фамилия должна содержать не менее 2 символов"),
    patronymic: z.string().optional().or(z.literal("")),
    email: z.string().email("Некорректный email адрес"),
    phone: z.string().min(10, "Введите корректный номер телефона").optional().or(z.literal("")),
    personalDataConsent: z.boolean().refine((val) => val === true, {
        message: "Необходимо согласие на обработку персональных данных",
    }),
    contractAcceptance: z.boolean().refine((val) => val === true, {
        message: "Необходимо принять условия договора оферты",
    }),
    marketingConsent: z.boolean().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface PaymentFormProps {
    serviceId: string;
    serviceName: string;
    tariff: "base" | "premium" | "vip";
    price: number;
    onSuccess?: (orderId: string) => void;
    onError?: (error: string) => void;
}

interface PaymentMethod {
    id: "card" | "yookassa" | "cloudpayments" | "yandex_split" | "dolemi" | "paykeeper";
    name: string;
    description: string;
    icon: React.ReactNode;
    installment?: boolean;
}

export default function PaymentForm({
                                        serviceId,
                                        serviceName,
                                        tariff,
                                        price,
                                        onSuccess,
                                        onError,
                                    }: PaymentFormProps) {
    const id = useId();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "yookassa" | "cloudpayments" | "yandex_split" | "dolemi" | "paykeeper">("paykeeper");
    const [installmentCount, setInstallmentCount] = useState<number>(4);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {errors},
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            patronymic: "",
            email: "",
            phone: "",
            personalDataConsent: false,
            contractAcceptance: false,
            marketingConsent: false,
        },
    });

    const personalDataConsent = watch("personalDataConsent");
    const contractAcceptance = watch("contractAcceptance");
    const marketingConsent = watch("marketingConsent");

    // Методы оплаты
    const paymentMethods: PaymentMethod[] = [
        {
            id: "card",
            name: "Банковская карта",
            description: "Visa, Mastercard, МИР",
            icon: <CreditCard className="h-5 w-5"/>,
        },
        {
            id: "yookassa",
            name: "ЮKassa",
            description: "Быстрая оплата онлайн",
            icon: <Building className="h-5 w-5"/>,
        },
        {
            id: "cloudpayments",
            name: "CloudPayments",
            description: "Рекуррентные платежи",
            icon: <CreditCard className="h-5 w-5"/>,
        },
        {
            id: "paykeeper",
            name: "PayKeeper",
            description: "Надежная платежная система",
            icon: <CreditCard className="h-5 w-5"/>,
        },
        {
            id: "yandex_split",
            name: "Яндекс Рассрочка",
            description: "Оплата частями без процентов",
            icon: <Smartphone className="h-5 w-5"/>,
            installment: true,
        },
        {
            id: "dolemi",
            name: "Долими",
            description: "4 платежа без переплат",
            icon: <Smartphone className="h-5 w-5"/>,
            installment: true,
        },
    ];

    // Расчет рассрочки
    const installmentAmount = Math.round(price / installmentCount);

    const onSubmit = async (data: OrderFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    serviceId,
                    tariff,
                    paymentMethod: selectedPaymentMethod,
                    installments: installmentCount,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Ошибка при создании заказа");
            }

            // Если есть URL для оплаты - перенаправляем
            if (result.payment_url) {
                window.location.href = result.payment_url;
            } else {
                onSuccess?.(result.order.id);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Произошла ошибка";
            onError?.(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Информация о заказе */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold">{serviceName}</h3>
                            <p className="text-sm text-muted capitalize">{tariff === "base" ? "Базовый" : tariff === "premium" ? "Оптимальный" : "VIP"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{new Intl.NumberFormat("ru-RU", {
                                style: "currency",
                                currency: "RUB",
                                minimumFractionDigits: 0,
                            }).format(price)}</p>
                            {selectedPaymentMethod.includes("split") || selectedPaymentMethod.includes("dolemi") ? (
                                <p className="text-xs text-muted">
                                    {installmentCount} платежа по {new Intl.NumberFormat("ru-RU", {
                                        style: "currency",
                                        currency: "RUB",
                                        minimumFractionDigits: 0,
                                    }).format(installmentAmount)}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Имя и Фамилия */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                            <label htmlFor={`${id}-lastName`} className="text-xs sm:text-sm font-medium">
                                Фамилия <span className="text-error">*</span>
                            </label>
                            <Input
                                id={`${id}-lastName`}
                                placeholder="Иванова"
                                {...register("lastName")}
                                className={errors.lastName ? "border-error" : ""}
                            />
                            {errors.lastName && (
                                <p className="text-xs text-error">{errors.lastName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={`${id}-firstName`} className="text-xs sm:text-sm font-medium">
                                Имя <span className="text-error">*</span>
                            </label>
                            <Input
                                id={`${id}-firstName`}
                                placeholder="Ирина"
                                {...register("firstName")}
                                className={errors.firstName ? "border-error" : ""}
                            />
                            {errors.firstName && (
                                <p className="text-xs text-error">{errors.firstName.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Отчество */}
                    <div className="space-y-2">
                        <label htmlFor={`${id}-patronymic`} className="text-sm font-medium">
                            Отчество
                        </label>
                        <Input
                            id={`${id}-patronymic`}
                            placeholder="Ивановна"
                            {...register("patronymic")}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor={`${id}-email`} className="text-sm font-medium">
                            Email <span className="text-error">*</span>
                        </label>
                        <Input
                            id={`${id}-email`}
                            type="email"
                            placeholder="example@mail.ru"
                            {...register("email")}
                            className={errors.email ? "border-error" : ""}
                        />
                        {errors.email && (
                            <p className="text-xs text-error">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Телефон */}
                    <div className="space-y-2">
                        <label htmlFor={`${id}-phone`} className="text-sm font-medium">
                            Телефон
                        </label>
                        <Input
                            id={`${id}-phone`}
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                            {...register("phone")}
                            className={errors.phone ? "border-error" : ""}
                        />
                        {errors.phone && (
                            <p className="text-xs text-error">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Выбор способа оплаты */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Способ оплаты</h3>
                        <div className="grid gap-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                                        selectedPaymentMethod === method.id
                                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            selectedPaymentMethod === method.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {method.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{method.name}</p>
                                        <p className="text-sm text-muted">{method.description}</p>
                                    </div>
                                    {selectedPaymentMethod === method.id && (
                                        <CheckCircle className="h-5 w-5 text-primary"/>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Выбор рассрочки */}
                    {(selectedPaymentMethod === "yandex_split" || selectedPaymentMethod === "dolemi") && (
                        <FadeIn>
                            <div className="space-y-3 p-4 bg-accent/5 rounded-xl border border-accent/20">
                                <h4 className="font-semibold">График платежей</h4>
                                <div className="flex gap-2">
                                    {[4, 6, 12].map((count) => (
                                        <button
                                            key={count}
                                            type="button"
                                            onClick={() => setInstallmentCount(count)}
                                            className={cn(
                                                "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                                                installmentCount === count
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            {count} {count === 4 ? "платежа" : count === 6 ? "платежей" : "платежей"}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-center p-3 bg-background rounded-lg">
                                    <p className="text-sm text-muted">Ежемесячный платеж:</p>
                                    <p className="text-lg font-bold text-primary">
                                        {new Intl.NumberFormat("ru-RU", {
                                            style: "currency",
                                            currency: "RUB",
                                            minimumFractionDigits: 0,
                                        }).format(installmentAmount)}
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    )}

                    {/* Юридические согласия */}
                    <div className="pt-2">
                        <LegalConsentCheckboxes
                            personalDataConsent={personalDataConsent}
                            contractAcceptance={contractAcceptance}
                            marketingConsent={marketingConsent}
                            onPersonalDataChange={(checked) => setValue("personalDataConsent", checked)}
                            onContractChange={(checked) => setValue("contractAcceptance", checked)}
                            onMarketingChange={(checked) => setValue("marketingConsent", checked)}
                        />
                    </div>

                    {/* Кнопка отправки */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting || !personalDataConsent || !contractAcceptance}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                Обработка...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4"/>
                                Оплатить {new Intl.NumberFormat("ru-RU", {
                                    style: "currency",
                                    currency: "RUB",
                                    minimumFractionDigits: 0,
                                }).format(price)}
                            </span>
                        )}
                    </Button>

                    <p className="text-xs text-muted text-center">
                        <span className="text-error">*</span> — обязательные поля
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
