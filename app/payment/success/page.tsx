"use client";

import {useState, useEffect, useCallback} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Link from "next/link";
import {CheckCircle, XCircle, ArrowRight, Download, Mail, Loader2, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface OrderData {
    id: string;
    status: "pending" | "paid" | "cancelled" | "refunded";
    serviceName: string;
    tariff: string;
    price: number;
    paymentMethod?: string;
    paymentId?: string;
    client?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const orderId = searchParams.get("order_id");
    
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [polling, setPolling] = useState(false);
    const [pollCount, setPollCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const MAX_POLL_ATTEMPTS = 15; // 30 секунд (каждые 2 секунды)
    const POLL_INTERVAL = 2000;

    // Проверка статуса заказа
    const checkStatus = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/payment/status/${id}`);
            const result = await response.json();

            if (result.success && result.order) {
                setOrder(result.order);
                // Если оплачен — прекращаем polling
                if (result.order.status === "paid") {
                    setPolling(false);
                    setLoading(false);
                }
            }
        } catch (err) {
            console.error("Failed to check order status:", err);
        }
    }, []);

    // Начальная загрузка
    useEffect(() => {
        if (!orderId) {
            // Нет order_id — показываем ошибку вместо редиректа
            setError("order_id отсутствует в URL");
            setLoading(false);
            return;
        }

        const init = async () => {
            await checkStatus(orderId);
            setLoading(false);
        };

        init();
    }, [orderId, checkStatus]);

    // Polling для pending заказов
    useEffect(() => {
        if (!orderId || !polling || pollCount >= MAX_POLL_ATTEMPTS) return;

        const interval = setInterval(async () => {
            setPollCount((prev) => prev + 1);
            await checkStatus(orderId);
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [orderId, polling, pollCount, checkStatus]);

    // Остановить polling по таймауту
    useEffect(() => {
        if (pollCount >= MAX_POLL_ATTEMPTS && polling) {
            setPolling(false);
        }
    }, [pollCount, polling]);

    // Форматирование цены
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Форматирование ID заказа
    const formatOrderId = (id: string) => {
        return id.toString().slice(-8).toUpperCase();
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="flex-1">
                    <section className="py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                        <div className="container">
                            <div className="max-w-xl mx-auto text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                </div>
                                <h2 className="text-2xl font-bold">Проверяем оплату...</h2>
                                <p className="text-muted">
                                    Подождите, мы получаем информацию о платеже
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Заказ не найден
    if (!order) {
        return (
            <>
                <Header />
                <main className="flex-1">
                    <section className="py-24 bg-gradient-to-br from-error/10 via-background to-primary/10">
                        <div className="container">
                            <div className="max-w-2xl mx-auto text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-error/20 flex items-center justify-center mx-auto">
                                    <XCircle className="h-12 w-12 text-error" />
                                </div>
                                <Badge variant="error" className="text-lg px-4 py-2">
                                    Заказ не найден
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold">Произошла ошибка</h1>
                                <p className="text-xl text-muted">
                                    Не удалось загрузить информацию о заказе. Попробуйте позже или свяжитесь с поддержкой.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button asChild>
                                        <Link href="/">На главную</Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <a href="mailto:info@yoursite.ru">Написать в поддержку</a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Определяем статус
    const isPaid = order.status === "paid";
    const isPending = order.status === "pending";
    const isCancelled = order.status === "cancelled";
    const pollingTimedOut = pollCount >= MAX_POLL_ATTEMPTS && isPending;

    return (
        <>
            <Header />

            <main className="flex-1">
                {/* Hero секция */}
                <section className="py-24 bg-gradient-to-br from-success/10 via-background to-primary/10">
                    <div className="container">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <div
                                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                                    isPaid
                                        ? "bg-success/20"
                                        : isPending
                                        ? "bg-warning/20"
                                        : "bg-error/20"
                                }`}
                            >
                                {isPaid ? (
                                    <CheckCircle className="h-12 w-12 text-success" />
                                ) : isPending ? (
                                    pollingTimedOut ? (
                                        <XCircle className="h-12 w-12 text-warning" />
                                    ) : (
                                        <Loader2 className="h-12 w-12 text-warning animate-spin" />
                                    )
                                ) : (
                                    <XCircle className="h-12 w-12 text-error" />
                                )}
                            </div>

                            <Badge
                                variant={isPaid ? "success" : isPending ? "warning" : "error"}
                                className="text-lg px-4 py-2"
                            >
                                {isPaid
                                    ? "✅ Оплата успешна"
                                    : isPending
                                    ? pollingTimedOut
                                        ? "⏳ Оплата не подтверждена"
                                        : "⏳ Проверяем платеж..."
                                    : "❌ Оплата отклонена"}
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold">
                                {isPaid
                                    ? "Спасибо за оплату!"
                                    : isPending
                                    ? pollingTimedOut
                                        ? "Оплата ещё обрабатывается"
                                        : "Ждём подтверждение от банка"
                                    : "Оплата не пройдена"}
                            </h1>

                            <p className="text-xl text-muted max-w-lg mx-auto">
                                {isPaid
                                    ? "Чек и подробности отправлены на вашу электронную почту."
                                    : isPending
                                    ? pollingTimedOut
                                        ? "Платеж может занять до 5 минут. Проверьте статус позже или свяжитесь с нами."
                                        : `Обычно это занимает несколько секунд. Мы проверим статус автоматически...`
                                    : "Попробуйте снова или выберите другой способ оплаты."}
                            </p>

                            {/* Polling индикатор */}
                            {isPending && !pollingTimedOut && (
                                <div className="flex items-center justify-center gap-3 text-sm text-muted">
                                    <RefreshCw className={`h-4 w-4 ${polling ? "animate-spin" : ""}`} />
                                    <span>
                                        Проверка {pollCount}/{MAX_POLL_ATTEMPTS}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Информация о заказе */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-2xl mx-auto">
                            <Card>
                                <CardContent className="p-8 space-y-6">
                                    {/* Информация о заказе */}
                                    <div className="border-b border-border pb-4">
                                        <h3 className="text-sm font-medium text-muted mb-2">
                                            ИНФОРМАЦИЯ О ЗАКАЗЕ
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted">Номер заказа:</span>
                                                <span className="font-medium">
                                                    {formatOrderId(order.id)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Услуга:</span>
                                                <span className="font-medium">
                                                    {order.serviceName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Тариф:</span>
                                                <span className="font-medium capitalize">
                                                    {order.tariff}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Сумма:</span>
                                                <span className="font-medium">
                                                    {formatPrice(order.price)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Статус:</span>
                                                <Badge
                                                    variant={
                                                        isPaid
                                                            ? "success"
                                                            : isPending
                                                            ? "warning"
                                                            : "error"
                                                    }
                                                >
                                                    {isPaid
                                                        ? "Оплачен"
                                                        : isPending
                                                        ? "Ожидается оплата"
                                                        : "Отклонен"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Оплачен */}
                                    {isPaid && (
                                        <>
                                            <div className="text-center space-y-2">
                                                <h2 className="text-2xl font-bold">Что дальше?</h2>
                                                <p className="text-muted">
                                                    В течение 24 часов я свяжусь с вами для согласования деталей
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">1</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Проверьте почту</h3>
                                                        <p className="text-sm text-muted">
                                                            Письмо с чеком и подтверждением заказа отправлено на{" "}
                                                            <span className="font-medium">
                                                                {order.client?.email}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">2</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Ожидайте связи</h3>
                                                        <p className="text-sm text-muted">
                                                            Я свяжусь с вами в течение 24 часов для уточнения деталей
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">3</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Подготовка</h3>
                                                        <p className="text-sm text-muted">
                                                            Перед консультацией нужно будет заполнить небольшую анкету
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Ожидание (polling timeout) */}
                                    {isPending && pollingTimedOut && (
                                        <>
                                            <div className="text-center space-y-2">
                                                <h2 className="text-2xl font-bold">Что делать?</h2>
                                                <p className="text-muted">
                                                    Платеж ещё обрабатывается банком
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-warning/10 border border-warning/20">
                                                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                                                        <span className="text-warning font-bold">!</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Подождите</h3>
                                                        <p className="text-sm text-muted">
                                                            Платежи YooKassa обычно занимают до 5 минут. 
                                                            Страница обновится автоматически при подтверждении.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">1</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Обновите страницу</h3>
                                                        <p className="text-sm text-muted">
                                                            Если прошло более 5 минут — обновите страницу для проверки статуса
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">2</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Проверьте email</h3>
                                                        <p className="text-sm text-muted">
                                                            После подтверждения оплаты чек придёт на{" "}
                                                            <span className="font-medium">{order.client?.email}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => {
                                                        setPollCount(0);
                                                        setPolling(true);
                                                        if (orderId) checkStatus(orderId);
                                                    }}
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Проверить снова
                                                </Button>
                                                <Button variant="outline" className="flex-1" asChild>
                                                    <a href="https://wa.me/79991234567" target="_blank" rel="noopener noreferrer">
                                                        Написать в WhatsApp
                                                    </a>
                                                </Button>
                                            </div>
                                        </>
                                    )}

                                    {/* Кнопки для оплаченного заказа */}
                                    {isPaid && (
                                        <div className="pt-6 border-t border-border">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button className="flex-1" asChild>
                                                    <Link href="/#services">
                                                        <ArrowRight className="h-4 w-4 mr-2" />
                                                        Другие услуги
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" className="flex-1" asChild>
                                                    <Link href="/">На главную</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Полезные ссылки */}
                            <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <Mail className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="font-semibold text-sm">Написать мне</p>
                                            <a
                                                href="mailto:info@yoursite.ru"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                info@yoursite.ru
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <Download className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="font-semibold text-sm">Чек об оплате</p>
                                            <p className="text-sm text-muted">
                                                {isPaid
                                                    ? "Отправлен на вашу почту"
                                                    : "Будет отправлен после оплаты"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold">Есть вопросы?</h2>
                            <p className="text-lg text-muted">
                                Я всегда на связи и готова помочь! Напишите мне в любой мессенджер
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Button variant="outline" asChild>
                                    <a href="https://t.me/username" target="_blank" rel="noopener noreferrer">
                                        Telegram
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="https://wa.me/79991234567" target="_blank" rel="noopener noreferrer">
                                        WhatsApp
                                    </a>
                                </Button>
                                <Button asChild>
                                    <a href="tel:+79991234567">Позвонить</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
