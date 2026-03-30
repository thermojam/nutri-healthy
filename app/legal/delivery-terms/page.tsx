import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft, Clock, MapPin, CheckCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Порядок оказания услуг | Ксения Каменская",
    description: "Сроки, формат и порядок оказания услуг нутрициологии и health-коучинга",
    robots: {index: true, follow: true},
};

export default function DeliveryTermsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container py-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4"/>
                            На главную
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="container py-12">
                <article className="prose dark:prose-invert max-w-4xl mx-auto">
                    <h1 className="mb-8">
                        Порядок оказания услуг
                    </h1>

                    <p className="text-muted text-lg mb-8">
                        Сроки, формат и условия оказания услуг нутрициологии и health-коучинга
                    </p>

                    <p className="text-sm text-muted mb-12">
                        <strong>Версия:</strong> 1.0 | <strong>Дата:</strong> {new Date().toLocaleDateString("ru-RU")}
                    </p>

                    <section>
                        <h2>1. Формат оказания услуг</h2>
                        <div className="grid md:grid-cols-2 gap-4 my-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Онлайн</h3>
                                            <p className="text-sm text-muted">
                                                Консультации по видеосвязи (Zoom, Skype, WhatsApp). 
                                                Материалы отправляются в электронном виде.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                            <MapPin className="h-6 w-6 text-accent"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Офлайн</h3>
                                            <p className="text-sm text-muted">
                                                Личная встреча в г. Москва (по предварительной записи). 
                                                Бумажные материалы выдаются на руки.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section>
                        <h2>2. Сроки оказания услуг</h2>
                        <div className="overflow-x-auto my-6">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-semibold">Услуга</th>
                                        <th className="text-left py-3 px-4 font-semibold">Срок начала</th>
                                        <th className="text-left py-3 px-4 font-semibold">Длительность</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border">
                                        <td className="py-3 px-4">Консультация нутрициолога</td>
                                        <td className="py-3 px-4">В течение 24 часов</td>
                                        <td className="py-3 px-4">60-90 минут</td>
                                    </tr>
                                    <tr className="border-b border-border">
                                        <td className="py-3 px-4">План питания (Base)</td>
                                        <td className="py-3 px-4">2-3 рабочих дня</td>
                                        <td className="py-3 px-4">7 дней сопровождения</td>
                                    </tr>
                                    <tr className="border-b border-border">
                                        <td className="py-3 px-4">План питания (Premium)</td>
                                        <td className="py-3 px-4">2-3 рабочих дня</td>
                                        <td className="py-3 px-4">14 дней сопровождения</td>
                                    </tr>
                                    <tr className="border-b border-border">
                                        <td className="py-3 px-4">Health-коучинг</td>
                                        <td className="py-3 px-4">В течение 48 часов</td>
                                        <td className="py-3 px-4">1-3 месяца</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4">Славянская гимнастика</td>
                                        <td className="py-3 px-4">Мгновенный доступ</td>
                                        <td className="py-3 px-4">Бессрочно</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2>3. Порядок работы</h2>
                        <div className="space-y-4 my-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">1</div>
                                <div>
                                    <h3 className="font-semibold mb-1">Оплата заказа</h3>
                                    <p className="text-sm text-muted">
                                        После оплаты вы получаете подтверждение на email с инструкцией по дальнейшим шагам.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">2</div>
                                <div>
                                    <h3 className="font-semibold mb-1">Заполнение анкеты</h3>
                                    <p className="text-sm text-muted">
                                        В течение 24 часов вам приходит анкета для сбора информации о здоровье, питании и целях.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">3</div>
                                <div>
                                    <h3 className="font-semibold mb-1">Консультация / Разработка плана</h3>
                                    <p className="text-sm text-muted">
                                        Проводим консультацию или разрабатываем индивидуальный план питания в соответствии с вашими данными.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">4</div>
                                <div>
                                    <h3 className="font-semibold mb-1">Получение материалов</h3>
                                    <p className="text-sm text-muted">
                                        Вы получаете все материалы в удобном формате (PDF, Google Docs, видео).
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">5</div>
                                <div>
                                    <h3 className="font-semibold mb-1">Сопровождение</h3>
                                    <p className="text-sm text-muted">
                                        В течение срока программы вы получаете поддержку в чате и коррекцию плана при необходимости.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>4. Что входит в услуги</h2>
                        <div className="grid md:grid-cols-2 gap-4 my-6">
                            <div className="border border-border rounded-xl p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-success"/>
                                    Нутрициология
                                </h3>
                                <ul className="text-sm space-y-2 text-muted">
                                    <li>✓ Анализ текущего рациона</li>
                                    <li>✓ Выявление дефицитов</li>
                                    <li>✓ Индивидуальный план питания</li>
                                    <li>✓ Список продуктов</li>
                                    <li>✓ Рецепты и меню</li>
                                    <li>✓ Рекомендации по добавкам</li>
                                    <li>✓ Чат поддержки</li>
                                </ul>
                            </div>

                            <div className="border border-border rounded-xl p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-success"/>
                                    Health-коучинг
                                </h3>
                                <ul className="text-sm space-y-2 text-muted">
                                    <li>✓ Глубокий анализ здоровья</li>
                                    <li>✓ Постановка целей</li>
                                    <li>✓ План действий</li>
                                    <li>✓ Работа с привычками</li>
                                    <li>✓ Поддержка мотивации</li>
                                    <li>✓ Регулярные созвоны</li>
                                    <li>✓ Чат поддержки 24/7</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>5. Технические требования</h2>
                        <div className="bg-card border border-border p-6 rounded-xl my-6">
                            <h3 className="font-semibold mb-4">Для онлайн-консультаций:</h3>
                            <ul className="text-sm space-y-2 text-muted">
                                <li>• Стабильное интернет-соединение</li>
                                <li>• Устройство с камерой и микрофоном (компьютер, планшет, смартфон)</li>
                                <li>• Установленное приложение Zoom / Skype / WhatsApp</li>
                                <li>• Тихое место для проведения консультации</li>
                            </ul>
                        </div>

                        <div className="bg-card border border-border p-6 rounded-xl my-6">
                            <h3 className="font-semibold mb-4">Для получения материалов:</h3>
                            <ul className="text-sm space-y-2 text-muted">
                                <li>• Email для получения файлов</li>
                                <li>• PDF-ридер или Google Docs</li>
                                <li>• Доступ в интернет для просмотра видео-материалов</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2>6. Регионы оказания услуг</h2>
                        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl my-6">
                            <p className="mb-4">
                                <strong>Онлайн-услуги</strong> оказываются по всему миру без ограничений.
                            </p>
                            <p className="mb-4">
                                <strong>Офлайн-услуги</strong> доступны в следующих городах:
                            </p>
                            <ul className="text-sm space-y-1 text-muted">
                                <li>• г. Москва (основной город)</li>
                                <li>• г. Санкт-Петербург (по предварительной записи)</li>
                                <li>• Другие города (индивидуально)</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2>7. Перенос и отмена консультаций</h2>
                        <div className="space-y-4 my-6">
                            <div className="border-l-4 border-success pl-4">
                                <p className="text-sm">
                                    <strong className="text-success">Бесплатный перенос</strong> возможен не позднее чем за 24 часа до назначенного времени.
                                </p>
                            </div>
                            <div className="border-l-4 border-warning pl-4">
                                <p className="text-sm">
                                    <strong className="text-warning">Перенос менее чем за 24 часа</strong> — предоставляется один раз бесплатно, далее оплачивается 50% стоимости консультации.
                                </p>
                            </div>
                            <div className="border-l-4 border-error pl-4">
                                <p className="text-sm">
                                    <strong className="text-error">Отмена в день консультации</strong> — не возвращается, консультация считается проведенной.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="mt-12 p-6 bg-accent/5 border border-accent/20 rounded-xl">
                        <h3 className="text-lg font-semibold mb-2">📞 Остались вопросы?</h3>
                        <p className="text-sm text-muted mb-4">
                            Свяжитесь с нами для уточнения деталей оказания услуг.
                        </p>
                        <Link href="/#contact">
                            <Button>Связаться со мной</Button>
                        </Link>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="container">
                    <p className="text-sm text-muted text-center">
                        © {new Date().getFullYear()} Ксения Каменская. Все права защищены.
                    </p>
                </div>
            </footer>
        </div>
    );
}
