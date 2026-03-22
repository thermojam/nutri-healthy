import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Согласие на обработку персональных данных | Нутрициолог [Имя]",
    description:
        "Согласие на обработку персональных данных в соответствии с Федеральным законом № 152-ФЗ",
    robots: {index: true, follow: true},
};

export default function PersonalDataConsentPage() {
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
                        Согласие на обработку персональных данных
                    </h1>

                    <p className="text-muted text-lg mb-8">
                        В соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»
                    </p>

                    <p className="text-sm text-muted mb-12">
                        <strong>Версия:</strong> 1.0 | <strong>Дата:</strong> {new Date().toLocaleDateString("ru-RU")}
                    </p>

                    <section>
                        <h2>1. Субъект персональных данных</h2>
                        <p>
                            Настоящим я, далее «Субъект», даю свое согласие ИП [ФИО] (далее «Оператор») на обработку
                            моих персональных данных, указанных при регистрации путем заполнения веб-формы на сайте
                            https://yoursite.ru и направляемых (заполненных) с использованием Сайта.
                        </p>
                    </section>

                    <section>
                        <h2>2. Персональные данные</h2>
                        <p>Под персональными данными я понимаю:</p>
                        <ul>
                            <li>Фамилию, имя, отчество;</li>
                            <li>Адрес электронной почты;</li>
                            <li>Номер телефона;</li>
                            <li>Дату рождения;</li>
                            <li>Фотографию (при предоставлении);</li>
                            <li>Информацию о заказах и предпочтениях;</li>
                            <li>IP-адрес, cookies, информацию о браузере;</li>
                            <li>Иные данные, предоставленные мной добровольно.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Цели обработки</h2>
                        <p>Я даю согласие на обработку персональных данных для следующих целей:</p>
                        <ul>
                            <li>Регистрация и идентификация на Сайте;</li>
                            <li>Предоставление услуг нутрициологии и health-коучинга;</li>
                            <li>Заключение и исполнение договоров;</li>
                            <li>Отправка уведомлений, чеков, документов;</li>
                            <li>Обратная связь и поддержка;</li>
                            <li>Маркетинговые коммуникации (при отдельном согласии);</li>
                            <li>Аналитика и улучшение качества услуг;</li>
                            <li>Выполнение требований законодательства РФ.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Действия с персональными данными</h2>
                        <p>
                            Я согласен на совершение следующих действий с моими персональными данными:
                        </p>
                        <ul>
                            <li>Сбор;</li>
                            <li>Запись;</li>
                            <li>Систематизация;</li>
                            <li>Накопление;</li>
                            <li>Хранение;</li>
                            <li>Уточнение (обновление, изменение);</li>
                            <li>Извлечение;</li>
                            <li>Использование;</li>
                            <li>Передача (предоставление, доступ);</li>
                            <li>Обезличивание;</li>
                            <li>Блокирование;</li>
                            <li>Удаление;</li>
                            <li>Уничтожение.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Способы обработки</h2>
                        <p>
                            Обработка может осуществляться как автоматизированным способом (с использованием
                            информационных систем и баз данных), так и без использования средств автоматизации.
                        </p>
                    </section>

                    <section>
                        <h2>6. Срок действия согласия</h2>
                        <p>
                            Настоящее согласие действует с момента его предоставления до достижения целей обработки
                            или до момента его отзыва мной. Срок хранения персональных данных — 3 (три) года с момента
                            последнего взаимодействия с Оператором, если иное не установлено законодательством РФ.
                        </p>
                    </section>

                    <section>
                        <h2>7. Передача данных третьим лицам</h2>
                        <p>
                            Я согласен на передачу персональных данных следующим третьим лицам:
                        </p>
                        <ul>
                            <li>Платежным системам (ЮKassa, CloudPayments) — для обработки платежей;</li>
                            <li>Операторам фискальных данных (Атол ОФД) — для формирования чеков (54-ФЗ);</li>
                            <li>Сервисам email-рассылок (Resend, SendGrid) — для отправки уведомлений;</li>
                            <li>Хостинг-провайдерам — для размещения Сайта и баз данных;</li>
                            <li>Государственным органам — по требованию законодательства.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Локализация данных</h2>
                        <p>
                            Я уведомлен и согласен с тем, что обработка персональных данных осуществляется на
                            территории Российской Федерации с соблюдением требований статьи 18 152-ФЗ о локализации
                            данных.
                        </p>
                    </section>

                    <section>
                        <h2>9. Отзыв согласия</h2>
                        <p>
                            Я имею право отозвать настоящее согласие в любое время путем направления письменного
                            уведомления на электронную почту <a href="mailto:info@yoursite.ru"
                                                                className="text-primary">info@yoursite.ru</a> или
                            через форму обратной связи на Сайте.
                        </p>
                        <p>
                            После отзыва согласия Оператор вправе продолжить обработку персональных данных без
                            моего согласия при наличии оснований, указанных в пунктах 2–11 части 1 статьи 6,
                            части 2 статьи 10 и части 2 статьи 11 Федерального закона № 152-ФЗ.
                        </p>
                    </section>

                    <section>
                        <h2>10. Права субъекта</h2>
                        <p>
                            Я имею право требовать от Оператора:
                        </p>
                        <ul>
                            <li>Доступа к своим персональным данным;</li>
                            <li>Уточнения данных (обновления, изменения);</li>
                            <li>Блокирования или уничтожения данных;</li>
                            <li>Защиты своих прав и законных интересов.</li>
                        </ul>
                    </section>

                    <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
                        <h3 className="text-lg font-semibold mb-4">Реквизиты Оператора</h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted">Форма:</dt>
                                <dd>ИП</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted">ФИО:</dt>
                                <dd>Иванов Иван Иванович</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted">ИНН:</dt>
                                <dd>123456789012</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted">Адрес:</dt>
                                <dd>123456, г. Москва, ул. Примерная, д. 1, кв. 1</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted">Email:</dt>
                                <dd><a href="mailto:info@yoursite.ru" className="text-primary">info@yoursite.ru</a></dd>
                            </div>
                        </dl>
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
                            <Link href="/legal/contract">
                                <Button variant="outline" size="sm">
                                    Договор оферты
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
