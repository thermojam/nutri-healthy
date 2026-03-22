import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Согласие на рассылку | Нутрициолог [Имя]",
    description:
        "Согласие на получение маркетинговых и информационных рассылок в соответствии с ФЗ «О рекламе»",
    robots: {index: true, follow: true},
};

export default function MarketingConsentPage() {
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
                        Согласие на получение рассылок
                    </h1>

                    <p className="text-muted text-lg mb-8">
                        В соответствии с Федеральным законом «О рекламе» от 13.03.2006 № 38-ФЗ
                    </p>

                    <p className="text-sm text-muted mb-12">
                        <strong>Версия:</strong> 1.0 | <strong>Дата:</strong> {new Date().toLocaleDateString("ru-RU")}
                    </p>

                    <section>
                        <h2>1. Общие положения</h2>
                        <p>
                            Настоящим я даю свое согласие ИП [ФИО] (далее — «Оператор») на получение мной
                            рекламных и информационных материалов (рассылок) в соответствии с Федеральным
                            законом от 13.03.2006 № 38-ФЗ «О рекламе».
                        </p>
                    </section>

                    <section>
                        <h2>2. Каналы коммуникации</h2>
                        <p>
                            Я согласен получать рассылку через следующие каналы связи (нужное отметить):
                        </p>
                        <ul>
                            <li><strong>Email</strong> — на адрес электронной почты, указанный при регистрации;</li>
                            <li><strong>SMS</strong> — на номер телефона, указанный при регистрации;</li>
                            <li><strong>Telegram</strong> — в мессенджер Telegram;</li>
                            <li><strong>WhatsApp</strong> — в мессенджер WhatsApp.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Содержание рассылки</h2>
                        <p>Рассылка может содержать:</p>
                        <ul>
                            <li>Полезные материалы по нутрициологии и здоровому образу жизни;</li>
                            <li>Информацию о новых услугах и продуктах;</li>
                            <li>Специальные предложения и скидки;</li>
                            <li>Приглашения на вебинары, мастер-классы и мероприятия;</li>
                            <li>Новости и обновления Сайта;</li>
                            <li>Персональные рекомендации.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Частота рассылок</h2>
                        <p>
                            Я уведомлен, что рассылка осуществляется не чаще:
                        </p>
                        <ul>
                            <li>Email — 2 раза в неделю;</li>
                            <li>SMS — 1 раза в неделю;</li>
                            <li>Telegram/WhatsApp — 3 раза в неделю.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Использование персональных данных</h2>
                        <p>
                            Для осуществления рассылки Оператор вправе использовать следующие мои персональные данные:
                        </p>
                        <ul>
                            <li>Фамилию, имя;</li>
                            <li>Адрес электронной почты;</li>
                            <li>Номер телефона;</li>
                            <li>Историю заказов и предпочтений (для персонализации).</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Отзыв согласия</h2>
                        <p>
                            Я имею право отозвать настоящее согласие в любое время:
                        </p>
                        <ul>
                            <li>Через ссылку «Отписаться» в каждом email-письме;</li>
                            <li>Через форму обратной связи на Сайте;</li>
                            <li>Направив уведомление на email <a href="mailto:info@yoursite.ru"
                                                                 className="text-primary">info@yoursite.ru</a>.
                            </li>
                        </ul>
                        <p>
                            Отзыв согласия влечет прекращение рассылки в течение 3 (трех) рабочих дней.
                        </p>
                    </section>

                    <section>
                        <h2>7. Передача данных третьим лицам</h2>
                        <p>
                            Оператор не передает персональные данные третьим лицам для целей рассылки,
                            за исключением случаев:
                        </p>
                        <ul>
                            <li>Использования специализированных сервисов email-рассылок (Resend, SendGrid);</li>
                            <li>Требований законодательства РФ.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Срок действия</h2>
                        <p>
                            Настоящее согласие действует с момента его предоставления до момента отзыва.
                            После отзыва Оператор обязан прекратить рассылку и удалить мои данные из
                            списков рассылки в течение 30 (тридцати) дней.
                        </p>
                    </section>

                    <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
                        <h3 className="text-lg font-semibold mb-4">Управление подпиской</h3>
                        <p className="mb-4">
                            Вы можете управлять своей подпиской в любое время:
                        </p>
                        <ul className="space-y-2">
                            <li>📧 Email: <a href="mailto:info@yoursite.ru" className="text-primary">info@yoursite.ru</a>
                            </li>
                            <li>📱 Телефон: <a href="tel:+79991234567" className="text-primary">+7 (999) 123-45-67</a>
                            </li>
                            <li>💬 Форма обратной связи на Сайте</li>
                        </ul>
                    </div>

                    <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
                        <h3 className="text-lg font-semibold mb-2 text-primary">Важно</h3>
                        <p className="text-sm">
                            Мы уважаем ваше право на приватность и не отправляем спам. Каждая рассылка
                            содержит ссылку для отписки. Мы не передаем ваши данные третьим лицам для
                            маркетинговых целей.
                        </p>
                    </div>
                </article>
            </main>

            {/* Footer CTA */}
            <footer className="border-t border-border py-8">
                <div className="container">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted">
                            Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
                        </p>
                        <div className="flex gap-4">
                            <Link href="/legal/privacy-policy">
                                <Button variant="outline" size="sm">
                                    Политика конфиденциальности
                                </Button>
                            </Link>
                            <Link href="/legal/personal-data-consent">
                                <Button variant="outline" size="sm">
                                    Согласие на ПДн
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
