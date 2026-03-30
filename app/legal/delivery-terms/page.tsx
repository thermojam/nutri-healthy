import type {Metadata} from "next";
import {Clock, MapPin, CheckCircle} from "lucide-react";
import LegalPageLayout from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
    title: "Порядок оказания услуг | Ксения Каменская",
    description: "Сроки, формат и условия оказания услуг нутрициологии",
};

export default function DeliveryTermsPage() {
    return (
        <LegalPageLayout
            title="Порядок оказания услуг"
            description="Как мы будем работать: сроки, формат, условия"
            version="2.0"
            icon={<Clock className="h-6 w-6 sm:h-7 sm:w-7"/>}
        >
            <section>
                <h2>1. Общие положения</h2>
                <p>
                    Настоящий документ описывает порядок, сроки и условия оказания услуг 
                    нутрициологии и health-коучинга ИП Каменская Ксения (далее — Исполнитель).
                </p>
                <p>
                    Услуги оказываются в соответствии с:
                </p>
                <ul>
                    <li>Договором публичной оферты</li>
                    <li>Политикой конфиденциальности (152-ФЗ)</li>
                    <li>Законом «О защите прав потребителей»</li>
                </ul>
            </section>

            <section>
                <h2>2. Формат оказания услуг</h2>
                <div className="grid sm:grid-cols-2 gap-4 my-6">
                    <div className="border border-border rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-background">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Онлайн</h3>
                                <p className="text-sm text-muted">Основной формат работы</p>
                            </div>
                        </div>
                        <ul className="text-sm text-muted space-y-2">
                            <li>• Видеоконсультации (Zoom, Skype, WhatsApp)</li>
                            <li>• Материалы в электронном виде (PDF, Google Docs)</li>
                            <li>• Чат поддержки в мессенджере</li>
                            <li>• Запись консультаций</li>
                            <li>• Удобно для любого города</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-2xl p-6 bg-gradient-to-br from-accent/5 to-background">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                <MapPin className="h-6 w-6 text-accent"/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Офлайн</h3>
                                <p className="text-sm text-muted">По предварительной записи</p>
                            </div>
                        </div>
                        <ul className="text-sm text-muted space-y-2">
                            <li>• Личная встреча в г. Москве</li>
                            <li>• Бумажные материалы выдаются на руки</li>
                            <li>• Обсуждается индивидуально</li>
                            <li>• Возможна дополнительная оплата</li>
                            <li>• Только для резидентов РФ</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2>3. Сроки оказания услуг</h2>
                <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-border">
                                <th className="text-left py-4 px-4 font-semibold">Услуга</th>
                                <th className="text-left py-4 px-4 font-semibold">Срок начала</th>
                                <th className="text-left py-4 px-4 font-semibold">Длительность</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border">
                                <td className="py-4 px-4 font-medium">Консультация нутрициолога</td>
                                <td className="py-4 px-4 text-muted">В течение 24 часов</td>
                                <td className="py-4 px-4 text-muted">60-90 минут</td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-4 px-4 font-medium">План питания (Base)</td>
                                <td className="py-4 px-4 text-muted">2-3 рабочих дня</td>
                                <td className="py-4 px-4 text-muted">7 дней сопровождения</td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-4 px-4 font-medium">План питания (Premium)</td>
                                <td className="py-4 px-4 text-muted">2-3 рабочих дня</td>
                                <td className="py-4 px-4 text-muted">14 дней сопровождения</td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-4 px-4 font-medium">Health-коучинг</td>
                                <td className="py-4 px-4 text-muted">В течение 48 часов</td>
                                <td className="py-4 px-4 text-muted">1-3 месяца</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 font-medium">Славянская гимнастика</td>
                                <td className="py-4 px-4 text-muted">Мгновенный доступ</td>
                                <td className="py-4 px-4 text-muted">Бессрочно</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="bg-primary/5 border-l-4 border-primary p-4 my-4">
                    <p className="text-sm text-muted mb-0">
                        <strong>Важно:</strong> Срок начала отсчитывается с момента оплаты и заполнения 
                        анкеты клиента.
                    </p>
                </div>
            </section>

            <section>
                <h2>4. Пошаговый порядок работы</h2>
                <div className="space-y-4 my-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">1</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Оплата заказа</h3>
                            <p className="text-sm text-muted">
                                После оплаты на Сайте вы получаете подтверждение на email с инструкцией 
                                по дальнейшим шагам и доступом к личному кабинету (если предусмотрен).
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">2</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Заполнение анкеты</h3>
                            <p className="text-sm text-muted">
                                В течение 24 часов вам приходит анкета для сбора информации о здоровье, 
                                питании, образе жизни и целях. Заполнение занимает 15-20 минут.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">3</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Консультация / Разработка плана</h3>
                            <p className="text-sm text-muted">
                                Проводим видеоконсультацию (60-90 минут) или разрабатываем индивидуальный 
                                план питания в соответствии с вашими данными и целями.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">4</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Получение материалов</h3>
                            <p className="text-sm text-muted">
                                Вы получаете все материалы в удобном формате: PDF-файлы, Google Docs, 
                                видео-уроки, аудио-сопровождение. Доступ сохраняется бессрочно.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">5</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Сопровождение</h3>
                            <p className="text-sm text-muted">
                                В течение срока программы вы получаете поддержку в чате, ответы на вопросы 
                                и коррекцию плана при необходимости (согласно выбранному тарифу).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2>5. Что входит в услуги</h2>
                <div className="grid md:grid-cols-2 gap-4 my-6">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-success"/>
                            Нутрициология
                        </h3>
                        <ul className="text-sm space-y-2 text-muted">
                            <li>✓ Анализ текущего рациона</li>
                            <li>✓ Выявление дефицитов нутриентов</li>
                            <li>✓ Индивидуальный план питания</li>
                            <li>✓ Список продуктов</li>
                            <li>✓ Рецепты и меню на неделю</li>
                            <li>✓ Рекомендации по добавкам</li>
                            <li>✓ Чат поддержки (7-30 дней)</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-success"/>
                            Health-коучинг
                        </h3>
                        <ul className="text-sm space-y-2 text-muted">
                            <li>✓ Глубокий анализ здоровья</li>
                            <li>✓ Постановка SMART-целей</li>
                            <li>✓ План действий на месяц</li>
                            <li>✓ Работа с привычками</li>
                            <li>✓ Поддержка мотивации</li>
                            <li>✓ Регулярные созвоны (1-4 в месяц)</li>
                            <li>✓ Чат поддержки 24/7</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-success"/>
                            Славянская гимнастика
                        </h3>
                        <ul className="text-sm space-y-2 text-muted">
                            <li>✓ Доступ к видео-урокам</li>
                            <li>✓ Комплекс из 27 упражнений</li>
                            <li>✓ Аудио-сопровождение</li>
                            <li>✓ Гайд по практике</li>
                            <li>✓ Чат участников</li>
                            <li>✓ Групповые созвоны (1-2 в месяц)</li>
                            <li>✓ Бессрочный доступ</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-success"/>
                            Психосоматика
                        </h3>
                        <ul className="text-sm space-y-2 text-muted">
                            <li>✓ Работа с родовыми сценариями</li>
                            <li>✓ Проживание эмоций</li>
                            <li>✓ Техники саморегуляции</li>
                            <li>✓ Индивидуальные сессии</li>
                            <li>✓ Домашние задания</li>
                            <li>✓ Поддержка в чате</li>
                            <li>✓ Записи сессий</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2>6. Технические требования</h2>
                <div className="bg-card border border-border rounded-xl p-6 my-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="text-xl">💻</span>
                        Для онлайн-консультаций:
                    </h3>
                    <ul className="text-sm space-y-2 text-muted">
                        <li>• Стабильное интернет-соединение (не менее 2 Мбит/с)</li>
                        <li>• Устройство с камерой и микрофоном (компьютер, планшет, смартфон)</li>
                        <li>• Установленное приложение Zoom / Skype / WhatsApp</li>
                        <li>• Тихое место для проведения консультации</li>
                        <li>• Заранее подготовленные вопросы</li>
                    </ul>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 my-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="text-xl">📱</span>
                        Для получения материалов:
                    </h3>
                    <ul className="text-sm space-y-2 text-muted">
                        <li>• Действующий email для получения файлов</li>
                        <li>• PDF-ридер или аккаунт Google Docs</li>
                        <li>• Доступ в интернет для просмотра видео</li>
                        <li>• Устройство для просмотра (смартфон, планшет, компьютер)</li>
                    </ul>
                </div>
            </section>

            <section>
                <h2>7. Регионы оказания услуг</h2>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 my-6">
                    <h3 className="font-semibold mb-3">Онлайн-услуги:</h3>
                    <p className="text-sm text-muted mb-4">
                        Оказываются по всему миру без ограничений. География не имеет значения — 
                        нужна только стабильная видеосвязь.
                    </p>
                    
                    <h3 className="font-semibold mb-3">Офлайн-услуги:</h3>
                    <p className="text-sm text-muted mb-3">Доступны в следующих городах:</p>
                    <ul className="text-sm space-y-1 text-muted">
                        <li>• г. Москва (основной город)</li>
                        <li>• г. Санкт-Петербург (по предварительной записи)</li>
                        <li>• Другие города (индивидуально, обсуждается отдельно)</li>
                    </ul>
                </div>
            </section>

            <section>
                <h2>8. Перенос и отмена консультаций</h2>
                <div className="space-y-4 my-6">
                    <div className="border-l-4 border-success pl-4 py-2">
                        <p className="text-sm">
                            <strong className="text-success">✓ Бесплатный перенос</strong> возможен 
                            не позднее чем за <strong>24 часа</strong> до назначенного времени. 
                            Количество переносов не ограничено.
                        </p>
                    </div>
                    <div className="border-l-4 border-warning pl-4 py-2">
                        <p className="text-sm">
                            <strong className="text-warning">⚠ Перенос менее чем за 24 часа</strong> — 
                            предоставляется один раз бесплатно, далее оплачивается 
                            <strong> 50% стоимости консультации</strong>.
                        </p>
                    </div>
                    <div className="border-l-4 border-error pl-4 py-2">
                        <p className="text-sm">
                            <strong className="text-error">✗ Отмена в день консультации</strong> — 
                            не возвращается, консультация считается проведенной. Исключение — 
                            экстренные случаи (болезнь, ЧП).
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2>9. Гарантии качества</h2>
                <p>Исполнитель гарантирует:</p>
                <ul>
                    <li>Профессиональный подход и индивидуальный план</li>
                    <li>Конфиденциальность данных (152-ФЗ)</li>
                    <li>Своевременное оказание услуг</li>
                    <li>Поддержку в оговоренном объеме</li>
                    <li>Возврат средств в установленных случаях</li>
                </ul>
                <div className="bg-accent/5 border-l-4 border-accent p-4 my-4">
                    <p className="text-sm text-muted mb-0">
                        <strong>Важно:</strong> Исполнитель не гарантирует конкретные результаты 
                        (похудение, набор веса), так как они зависят от индивидуальных особенностей 
                        и соблюдения рекомендаций Заказчиком.
                    </p>
                </div>
            </section>

            <section>
                <h2>10. Контакты</h2>
                <p>
                    По всем вопросам порядка оказания услуг обращайтесь:
                </p>
                <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-primary/20 rounded-xl p-6 my-4">
                    <div className="space-y-3">
                        <p className="mb-2">
                            <strong>ИП Каменская Ксения</strong>
                        </p>
                        <p className="text-sm text-muted">
                            Email: <a href="mailto:info@yoursite.ru" className="text-primary hover:underline">info@yoursite.ru</a>
                        </p>
                        <p className="text-sm text-muted">
                            Телефон: <a href="tel:+79991234567" className="text-primary hover:underline">+7 (999) 123-45-67</a>
                        </p>
                        <p className="text-sm text-muted">
                            Telegram: <a href="https://t.me/username" className="text-primary hover:underline">@username</a>
                        </p>
                        <p className="text-sm text-muted">
                            Адрес: 123317, г. Москва, Пресненская наб., д. 10, стр. 2
                        </p>
                        <p className="text-sm text-muted mt-3">
                            Режим работы: Пн-Пт 9:00-18:00 (МСК)
                        </p>
                        <p className="text-sm text-muted">
                            Среднее время ответа: <strong>24 часа</strong>
                        </p>
                    </div>
                </div>
            </section>
        </LegalPageLayout>
    );
}
