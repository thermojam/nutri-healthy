import Link from "next/link";
import {CheckCircle, ArrowRight, Download, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function PaymentSuccessPage() {
    return (
        <>
            <Header/>

            <main className="flex-1">
                {/* Hero секция */}
                <section className="py-24 bg-gradient-to-br from-success/10 via-background to-primary/10">
                    <div className="container">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <div
                                className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                                <CheckCircle className="h-12 w-12 text-success"/>
                            </div>

                            <Badge variant="success" className="text-lg px-4 py-2">
                                Оплата успешна
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold">
                                Спасибо за оплату!
                            </h1>

                            <p className="text-xl text-muted">
                                Ваш заказ подтвержден. Мы отправили чек и подробности на вашу электронную почту.
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
                                                    Письмо с чеком и подтверждением заказа уже отправлено
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

                                    <div className="pt-6 border-t border-border">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button className="flex-1" asChild>
                                                <Link href="/dashboard/orders">
                                                    <ArrowRight className="h-4 w-4 mr-2"/>
                                                    Мои заказы
                                                </Link>
                                            </Button>
                                            <Button variant="outline" className="flex-1" asChild>
                                                <Link href="/">
                                                    На главную
                                                </Link>
                                            </Button>
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
                                            <p className="font-semibold text-sm">Скачать чек</p>
                                            <button className="text-sm text-primary hover:underline">
                                                Будет доступен в личном кабинете
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-card">
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
