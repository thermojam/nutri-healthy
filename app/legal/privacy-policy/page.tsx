import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Политика конфиденциальности | Ксения Каменская",
    description:
        "Политика обработки персональных данных в соответствии с Федеральным законом № 152-ФЗ",
    robots: {index: true, follow: true},
};

export default function PrivacyPolicyPage() {
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
                        Политика конфиденциальности
                    </h1>

                    <p className="text-muted text-lg mb-8">
                        Политика обработки персональных данных в соответствии с Федеральным законом от 27.07.2006 №
                        152-ФЗ «О персональных данных»
                    </p>

                    <p className="text-sm text-muted mb-12">
                        <strong>Версия:</strong> 1.0 | <strong>Дата:</strong> {new Date().toLocaleDateString("ru-RU")}
                    </p>

                    <section>
                        <h2>1. Общие положения</h2>
                        <p>
                            Настоящая политика обработки персональных данных (далее — Политика) действует в отношении
                            всей информации,
                            которую сайт «Ксения Каменская» (далее — Сайт), расположенный по доменному имени
                            https://yoursite.ru,
                            может получить о пользователе во время использования Сайта.
                        </p>
                        <p>
                            Мы уважаем ваши права и обязуемся обрабатывать ваши персональные данные в соответствии с
                            Федеральным законом
                            от 27.07.2006 № 152-ФЗ «О персональных данных» (далее — 152-ФЗ).
                        </p>
                    </section>

                    <section>
                        <h2>2. Цели обработки персональных данных</h2>
                        <p>Мы обрабатываем персональные данные для следующих целей:</p>
                        <ul>
                            <li>Предоставление услуг нутрициологии и health-коучинга</li>
                            <li>Заключение и исполнение договоров с клиентами</li>
                            <li>Отправка чеков и документов об оплате (54-ФЗ)</li>
                            <li>Информирование о услугах и специальных предложениях (с согласия)</li>
                            <li>Улучшение качества услуг и Сайта</li>
                            <li>Выполнение требований законодательства РФ</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Персональные данные, которые мы обрабатываем</h2>
                        <p>Мы можем обрабатывать следующие персональные данные:</p>
                        <ul>
                            <li>Фамилия, имя, отчество</li>
                            <li>Адрес электронной почты</li>
                            <li>Номер телефона</li>
                            <li>Дата рождения</li>
                            <li>Данные о заказах и оплатах</li>
                            <li>IP-адрес, данные cookies, информация о браузере</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Правовые основания обработки</h2>
                        <p>Мы обрабатываем персональные данные на следующих основаниях:</p>
                        <ul>
                            <li>Ваше согласие на обработку персональных данных</li>
                            <li>Заключение и исполнение договора</li>
                            <li>Выполнение требований законодательства (54-ФЗ, 152-ФЗ)</li>
                            <li>Осуществление правосудия и исполнение судебных актов</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Условия обработки и передачи данных</h2>
                        <p>
                            Обработка персональных данных осуществляется на территории Российской Федерации с
                            соблюдением
                            требований законодательства РФ о локализации данных.
                        </p>
                        <p>Мы не передаем персональные данные третьим лицам, за исключением случаев:</p>
                        <ul>
                            <li>Получения вашего согласия</li>
                            <li>Требований законодательства (налоговые органы, правоохранительные органы)</li>
                            <li>Необходимости для предоставления услуг (платежные системы, ОФД)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Меры защиты персональных данных</h2>
                        <p>
                            Мы принимаем необходимые технические и организационные меры для защиты персональных данных
                            от
                            неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования,
                            предоставления,
                            распространения.
                        </p>
                    </section>

                    <section>
                        <h2>7. Права субъекта персональных данных</h2>
                        <p>Вы имеете право:</p>
                        <ul>
                            <li>Получить информацию об обработке ваших персональных данных</li>
                            <li>Требовать уточнения, блокирования или уничтожения данных</li>
                            <li>Отозвать согласие на обработку персональных данных</li>
                            <li>Обжаловать действия оператора в уполномоченный орган (Роскомнадзор)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Отзыв согласия</h2>
                        <p>
                            Вы можете отозвать согласие на обработку персональных данных в любое время, направив
                            уведомление
                            на электронную почту <a href="mailto:info@yoursite.ru"
                                                    className="text-primary">info@yoursite.ru</a> или
                            через форму обратной связи на Сайте.
                        </p>
                    </section>

                    <section>
                        <h2>9. Контакты</h2>
                        <p>
                            По вопросам обработки персональных данных вы можете обратиться:
                        </p>
                        <ul>
                            <li>Email: <a href="mailto:info@yoursite.ru" className="text-primary">info@yoursite.ru</a>
                            </li>
                            <li>Телефон: <a href="tel:+79991234567" className="text-primary">+7 (999) 123-45-67</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2>10. Заключительные положения</h2>
                        <p>
                            Политика публикуется в сети Интернет по адресу: https://yoursite.ru/legal/privacy-policy
                        </p>
                        <p>
                            Актуальная версия Политики всегда доступна на Сайте. Мы оставляем за собой право вносить
                            изменения
                            в Политику. Новая редакция вступает в силу с момента размещения на Сайте.
                        </p>
                    </section>

                    <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
                        <h3 className="text-lg font-semibold mb-4">Реквизиты оператора</h3>
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
                            <Link href="/legal/personal-data-consent">
                                <Button variant="outline" size="sm">
                                    Согласие на ПДн
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
