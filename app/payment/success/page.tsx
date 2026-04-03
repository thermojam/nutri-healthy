import {redirect} from "next/navigation";
import {connectDB} from "@/lib/db/connect";
import {Order} from "@/lib/db/models/Order";
import Link from "next/link";
import {CheckCircle, XCircle, ArrowRight, Download, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface PaymentSuccessPageProps {
    searchParams: Promise<{
        order_id?: string;
    }>;
}

export default async function PaymentSuccessPage({searchParams}: PaymentSuccessPageProps) {
    const {order_id} = await searchParams;

    if (!order_id) {
        redirect("/");
    }

    let order = null;
    try {
        await connectDB();
        order = await Order.findById(order_id).lean();
    } catch (error) {
        console.error("Failed to load order:", error);
        // Продолжаем с order = null, покажем ошибку пользователю
    }

    if (!order) {
        // Заказ не найден — показываем страницу с ошибкой
        return (
            <>
                <Header/>
                <main className="flex-1">
                    <section className="py-24 bg-gradient-to-br from-error/10 via-background to-primary/10">
                        <div className="container">
                            <div className="max-w-2xl mx-auto text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-error/20 flex items-center justify-center mx-auto">
                                    <XCircle className="h-12 w-12 text-error"/>
                                </div>
                                <Badge variant="error" className="text-lg px-4 py-2">
                                    Заказ не найден
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold">
                                    Произошла ошибка
                                </h1>
                                <p className="text-xl text-muted">
                                    Не удалось загрузить информацию о заказе. Попробуйте позже или свяжитесь с поддержкой.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button asChild>
                                        <Link href="/">
                                            На главную
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <a href="mailto:info@yoursite.ru">
                                            Написать в поддержку
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer/>
            </>
        );
    }

    // Проверяем статус заказа
    const isPaid = order.status === "paid";
    const isPending = order.status === "pending";

    return (
        <>
            <Header/>

            <main className="flex-1">
                {/* Hero секция */}
                <section className="py-24 bg-gradient-to-br from-success/10 via-background to-primary/10">
                    <div className="container">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <div
                                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                                    isPaid ? "bg-success/20" : isPending ? "bg-warning/20" : "bg-error/20"
                                }`}
                            >
                                {isPaid ? (
                                    <CheckCircle className="h-12 w-12 text-success"/>
                                ) : isPending ? (
                                    <span className="text-4xl">⏳</span>
                                ) : (
                                    <XCircle className="h-12 w-12 text-error"/>
                                )}
                            </div>

                            <Badge
                                variant={isPaid ? "success" : isPending ? "warning" : "error"}
                                className="text-lg px-4 py-2"
                            >
                                {isPaid ? "Оплата успешна" : isPending ? "Ожидается оплата" : "Оплата отклонена"}
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold">
                                {isPaid
                                    ? "Спасибо за оплату!"
                                    : isPending
                                        ? "Заказ создан"
                                        : "Оплата не пройдена"}
                            </h1>

                            <p className="text-xl text-muted">
                                {isPaid
                                    ? "Чек и подробности отправлены на вашу электронную почту."
                                    : isPending
                                        ? "Свяжитесь со мной для оплаты удобным способом."
                                        : "Попробуйте снова или выберите другой способ оплаты."}
                            </p>
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
                                        <h3 className="text-sm font-medium text-muted mb-2">ИНФОРМАЦИЯ О ЗАКАЗЕ</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted">Номер заказа:</span>
                                                <span className="font-medium">{order._id.toString().slice(-8).toUpperCase()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Услуга:</span>
                                                <span className="font-medium">{order.serviceName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Тариф:</span>
                                                <span className="font-medium capitalize">{order.tariff}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Сумма:</span>
                                                <span className="font-medium">
                                                    {new Intl.NumberFormat("ru-RU", {
                                                        style: "currency",
                                                        currency: "RUB",
                                                        minimumFractionDigits: 0,
                                                    }).format(order.price)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted">Статус:</span>
                                                <Badge variant={isPaid ? "success" : isPending ? "warning" : "error"}>
                                                    {isPaid ? "Оплачен" : isPending ? "Ожидается оплата" : "Отклонен"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

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
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">1</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Проверьте почту</h3>
                                                        <p className="text-sm text-muted">
                                                            Письмо с чеком и подтверждением заказа отправлено на
                                                            <span className="font-medium"> {order.client.email}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">2</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Ожидайте звонка</h3>
                                                        <p className="text-sm text-muted">
                                                            Я свяжусь с вами в течение 24 часов для уточнения деталей
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">3</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Заполните анкету</h3>
                                                        <p className="text-sm text-muted">
                                                            Перед консультацией нужно будет заполнить небольшую анкету
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {isPending && (
                                        <>
                                            <div className="text-center space-y-2">
                                                <h2 className="text-2xl font-bold">Как оплатить?</h2>
                                                <p className="text-muted">
                                                    Выберите удобный способ оплаты
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-warning/10 border border-warning/20">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                                                        <span className="text-warning font-bold">!</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Заказ создан</h3>
                                                        <p className="text-sm text-muted">
                                                            Для завершения оплаты свяжитесь со мной удобным способом.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">1</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Оплатите заказ</h3>
                                                        <p className="text-sm text-muted">
                                                            Если вы еще не оплатили, свяжитесь со мной для выбора способа оплаты
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <span className="text-primary font-bold">2</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Получите чек</h3>
                                                        <p className="text-sm text-muted">
                                                            После оплаты чек и подтверждение будут отправлены на вашу почту
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-6 border-t border-border">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {isPaid ? (
                                                <>
                                                    <Button className="flex-1" asChild>
                                                        <Link href="/#services">
                                                            <ArrowRight className="h-4 w-4 mr-2"/>
                                                            Другие услуги
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" className="flex-1" asChild>
                                                        <Link href="/">
                                                            На главную
                                                        </Link>
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button className="flex-1" variant="outline" asChild>
                                                        <a href="https://wa.me/79991234567" target="_blank" rel="noopener noreferrer">
                                                            Написать в WhatsApp
                                                        </a>
                                                    </Button>
                                                    <Button className="flex-1" asChild>
                                                        <a href="mailto:info@yoursite.ru">
                                                            Оплатить по почте
                                                        </a>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Полезные ссылки */}
                            <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <Mail className="h-8 w-8 text-primary"/>
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
                                        <Download className="h-8 w-8 text-primary"/>
                                        <div>
                                            <p className="font-semibold text-sm">Чек об оплате</p>
                                            <p className="text-sm text-muted">
                                                {isPaid ? "Отправлен на вашу почту" : "Будет отправлен после оплаты"}
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
                            <h2 className="text-3xl font-bold">
                                Есть вопросы?
                            </h2>
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
                                    <a href="tel:+79991234567">
                                        Позвонить
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </>
    );
}
