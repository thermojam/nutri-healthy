import Link from "next/link";
import {XCircle, ArrowLeft, HelpCircle, MessageCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function PaymentCancelPage() {
    return (
        <>
            <Header/>

            <main className="flex-1">
                {/* Hero секция */}
                <section className="py-24 bg-gradient-to-br from-error/10 via-background to-primary/10">
                    <div className="container">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <div
                                className="w-24 h-24 rounded-full bg-error/20 flex items-center justify-center mx-auto">
                                <XCircle className="h-12 w-12 text-error"/>
                            </div>

                            <Badge variant="outline" className="text-lg px-4 py-2 border-error text-error">
                                Оплата отменена
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold">
                                Оплата не завершена
                            </h1>

                            <p className="text-xl text-muted">
                                Похоже, что-то пошло не так. Не волнуйтесь, вы можете попробовать снова или выбрать
                                другой способ оплаты.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Возможные причины */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-2xl mx-auto">
                            <Card>
                                <CardContent className="p-8 space-y-6">
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold">Возможные причины</h2>
                                        <p className="text-muted">
                                            Проверьте, что могло пойти не так
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-error/5">
                                            <HelpCircle className="h-6 w-6 text-error shrink-0 mt-0.5"/>
                                            <div>
                                                <h3 className="font-semibold mb-1">Недостаточно средств</h3>
                                                <p className="text-sm text-muted">
                                                    Проверьте баланс на карте или выберите другой способ оплаты
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-error/5">
                                            <HelpCircle className="h-6 w-6 text-error shrink-0 mt-0.5"/>
                                            <div>
                                                <h3 className="font-semibold mb-1">Истек срок действия карты</h3>
                                                <p className="text-sm text-muted">
                                                    Используйте другую карту или попробуйте рассрочку
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-error/5">
                                            <HelpCircle className="h-6 w-6 text-error shrink-0 mt-0.5"/>
                                            <div>
                                                <h3 className="font-semibold mb-1">Ошибка банка</h3>
                                                <p className="text-sm text-muted">
                                                    Свяжитесь с банком для уточнения причины отказа
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-error/5">
                                            <HelpCircle className="h-6 w-6 text-error shrink-0 mt-0.5"/>
                                            <div>
                                                <h3 className="font-semibold mb-1">Превышен лимит</h3>
                                                <p className="text-sm text-muted">
                                                    Попробуйте разбить платеж или выберите рассрочку
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button className="flex-1" asChild>
                                                <Link href="/services">
                                                    <ArrowLeft className="h-4 w-4 mr-2"/>
                                                    Выбрать услугу
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

                            {/* Альтернативные варианты */}
                            <div className="mt-8 space-y-4">
                                <h3 className="text-lg font-semibold text-center">Альтернативные варианты</h3>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-lg">💳</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Рассрочка</p>
                                                    <p className="text-xs text-muted">Оплата частями без процентов</p>
                                                </div>
                                            </div>
                                            <Link href="/services">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    Узнать подробнее
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <MessageCircle className="h-10 w-10 text-primary"/>
                                                <div>
                                                    <p className="font-semibold">Связаться со мной</p>
                                                    <p className="text-xs text-muted">Помогу с выбором оплаты</p>
                                                </div>
                                            </div>
                                            <a href="https://t.me/username" target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    Написать в Telegram
                                                </Button>
                                            </a>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Контакты поддержки */}
                <section className="py-16 bg-background">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold">
                                Нужна помощь?
                            </h2>
                            <p className="text-lg text-muted">
                                Если у вас возникли вопросы или проблемы с оплатой, я готова помочь!
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
                                    <a href="mailto:info@yoursite.ru">
                                        Написать на почту
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
