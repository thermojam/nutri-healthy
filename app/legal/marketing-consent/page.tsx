import type {Metadata} from "next";
import {Mail} from "lucide-react";
import LegalPageLayout from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
    title: "Согласие на рассылку | Ксения Каменская",
    description: "Согласие на получение информационных и маркетинговых рассылок",
};

export default function MarketingConsentPage() {
    return (
        <LegalPageLayout
            title="Согласие на рассылку"
            description="Информационные письма только по делу и с пользой"
            version="2.0"
            icon={<Mail className="h-6 w-6 sm:h-7 sm:w-7"/>}
        >
            <section>
                <h2>1. Общие положения</h2>
                <p>
                    Настоящим я даю свое согласие ИП Каменская Ксения (далее — «Оператор») на 
                    получение мной рекламных и информационных материалов (рассылок) в соответствии 
                    с Федеральным законом от 13.03.2006 № 38-ФЗ «О рекламе» и ФЗ «О связи».
                </p>
                <div className="bg-primary/5 border-l-4 border-primary p-4 my-4">
                    <p className="text-sm text-muted mb-0">
                        <strong>Важно:</strong> Согласие на рассылку является добровольным. 
                        Вы можете отписаться в любой момент без объяснения причин.
                    </p>
                </div>
            </section>

            <section>
                <h2>2. Каналы коммуникации</h2>
                <p>
                    Я согласен получать рассылку через следующие каналы связи (отметьте нужные):
                </p>
                <div className="grid sm:grid-cols-2 gap-4 my-6">
                    <div className="border border-border rounded-xl p-4 bg-card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg">📧</span>
                            </div>
                            <h3 className="font-semibold">Email</h3>
                        </div>
                        <p className="text-sm text-muted">
                            Письма на электронную почту с полезными материалами, анонсами и 
                            специальными предложениями.
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-4 bg-card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <span className="text-lg">📱</span>
                            </div>
                            <h3 className="font-semibold">SMS</h3>
                        </div>
                        <p className="text-sm text-muted">
                            Короткие уведомления о важных событиях, напоминания о консультациях 
                            и акциях.
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-4 bg-card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg">✈️</span>
                            </div>
                            <h3 className="font-semibold">Telegram</h3>
                        </div>
                        <p className="text-sm text-muted">
                            Сообщения в мессенджер Telegram с новостями, статьями и анонсами 
                            мероприятий.
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-4 bg-card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <span className="text-lg">💬</span>
                            </div>
                            <h3 className="font-semibold">WhatsApp</h3>
                        </div>
                        <p className="text-sm text-muted">
                            Персональные сообщения в WhatsApp с информацией о услугах и 
                            специальных предложениях.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2>3. Содержание рассылки</h2>
                <p>Я согласен получать следующие типы материалов:</p>
                <ul>
                    <li><strong>Информационные письма</strong> — статьи, советы, рекомендации по здоровью</li>
                    <li><strong>Анонсы мероприятий</strong> — вебинары, марафоны, курсы</li>
                    <li><strong>Специальные предложения</strong> — скидки, акции, бонусы</li>
                    <li><strong>Персональные рекомендации</strong> — подборки материалов по интересам</li>
                    <li><strong>Напоминания</strong> — о консультациях, оплате, начале программ</li>
                </ul>
                <div className="bg-accent/5 border-l-4 border-accent p-4 my-4">
                    <p className="text-sm text-muted mb-0">
                        <strong>Обещаем:</strong> Не спамить! Только полезные материалы 1-2 раза в 
                        неделю. Никаких ежедневных писем «купи-купи».
                    </p>
                </div>
            </section>

            <section>
                <h2>4. Частота рассылок</h2>
                <p>
                    Рассылка осуществляется с следующей периодичностью:
                </p>
                <ul>
                    <li><strong>Email</strong> — не чаще 2 раз в неделю</li>
                    <li><strong>SMS</strong> — не чаще 1 раза в неделю (только важное)</li>
                    <li><strong>Telegram / WhatsApp</strong> — не чаще 3 раз в неделю</li>
                </ul>
                <p>
                    В период проведения акций или марафонов частота может быть увеличена, о чем 
                    сообщается заранее.
                </p>
            </section>

            <section>
                <h2>5. Срок действия согласия</h2>
                <p>
                    Настоящее согласие действует <strong>бессрочно</strong> с момента заполнения 
                    формы до момента его отзыва.
                </p>
                <p>
                    Продление срока действия согласия не требуется. Рассылка продолжается до тех 
                    пор, пока вы не отпишетесь.
                </p>
            </section>

            <section>
                <h2>6. Отзыв согласия (отписка)</h2>
                <p>
                    Я вправе отозвать согласие на рассылку в любое время.
                </p>
                <h3>6.1. Способы отписки:</h3>
                <div className="space-y-4 my-6">
                    <div className="border border-border rounded-xl p-4 bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-lg">⚡️</span>
                            Быстрая отписка
                        </h4>
                        <p className="text-sm text-muted">
                            Нажмите на ссылку «Отписаться» в любом письме. Это мгновенно удалит 
                            вас из списка рассылки.
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-4 bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-lg">✉️</span>
                            Через email
                        </h4>
                        <p className="text-sm text-muted">
                            Напишите на <a href="mailto:info@yoursite.ru" className="text-primary hover:underline">info@yoursite.ru</a> 
                            с темой «Отписка от рассылки». Обработаем в течение 24 часов.
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-4 bg-card">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-lg">📱</span>
                            Через мессенджер
                        </h4>
                        <p className="text-sm text-muted">
                            Напишите «СТОП» в ответ на любое сообщение в Telegram или WhatsApp. 
                            Бот автоматически отпишет вас.
                        </p>
                    </div>
                </div>
                <div className="bg-primary/5 border-l-4 border-primary p-4 my-4">
                    <p className="text-sm text-muted mb-0">
                        <strong>Гарантия:</strong> После отписки вы перестанете получать рассылку 
                        в течение 24 часов. Данные удаляются из базы в течение 30 дней.
                    </p>
                </div>
            </section>

            <section>
                <h2>7. Передача данных третьим лицам</h2>
                <p>
                    Оператор <strong>не передает</strong> данные подписчиков третьим лицам для 
                    маркетинговых целей.
                </p>
                <p>
                    Исключения:
                </p>
                <ul>
                    <li><strong>Сервисы email-рассылок</strong> (например, SendPulse, Unisender) — 
                    техническая отправка писем</li>
                    <li><strong>CRM-системы</strong> — учет подписчиков и сегментация</li>
                    <li><strong>Государственные органы</strong> — по официальному запросу</li>
                </ul>
                <p>
                    Все третьи лица обязаны соблюдать конфиденциальность и требования законодательства.
                </p>
            </section>

            <section>
                <h2>8. Персональные данные в рассылке</h2>
                <p>
                    Для персонализации рассылок Оператор может использовать следующие данные:
                </p>
                <ul>
                    <li>Имя (для обращения в письме)</li>
                    <li>Email (для отправки писем)</li>
                    <li>История заказов (для подбора рекомендаций)</li>
                    <li>Интересы (для сегментации базы)</li>
                </ul>
                <p>
                    Обработка данных для рассылки осуществляется в соответствии с 152-ФЗ «О 
                    персональных данных».
                </p>
            </section>

            <section>
                <h2>9. Права подписчика</h2>
                <p>Я имею право:</p>
                <ul>
                    <li>Получать только те письма, на которые подписывался</li>
                    <li>Изменить каналы рассылки (например, оставить только email)</li>
                    <li>Изменить частоту получения писем</li>
                    <li>Полностью отписаться от рассылки</li>
                    <li>Потребовать удалить мои данные из базы</li>
                </ul>
            </section>

            <section>
                <h2>10. Ответственность</h2>
                <p>
                    Оператор обязуется:
                </p>
                <ul>
                    <li>Не рассылать спам и материалы, не соответствующие тематике сайта</li>
                    <li>Соблюдать частоту рассылок, указанную в Согласии</li>
                    <li>Предоставить возможность быстрой отписки</li>
                    <li>Не передавать данные третьим лицам для маркетинга</li>
                </ul>
                <p>
                    В случае нарушения подписчик вправе обратиться с жалобой в ФАС (Федеральная 
                    антимонопольная служба) и Роскомнадзор.
                </p>
            </section>

            <section>
                <h2>11. Заключительные положения</h2>
                <p>
                    Настоящее Согласие вступает в силу с момента заполнения формы подписки на 
                    Сайте и действует до момента отзыва.
                </p>
                <p>
                    Оператор вправе вносить изменения в настоящее Согласие. Новая редакция 
                    вступает в силу с момента размещения на Сайте.
                </p>
                <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-primary/20 rounded-xl p-6 my-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="text-xl">🎁</span>
                        Бонус за подписку
                    </h3>
                    <p className="text-sm text-muted mb-3">
                        Подписавшись на рассылку, вы получаете полезный бонус:
                    </p>
                    <ul className="text-sm space-y-2">
                        <li>• Чек-лист «5 шагов к здоровому питанию»</li>
                        <li>• Гайд «Микробиом и энергия»</li>
                        <li>• Доступ к закрытым материалам</li>
                        <li>• Персональные рекомендации</li>
                    </ul>
                </div>
            </section>

            <section>
                <h2>12. Контакты</h2>
                <p>
                    По всем вопросам рассылки обращайтесь:
                </p>
                <div className="bg-card border border-border rounded-xl p-6 my-4">
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
                        <p className="text-sm text-muted mt-3">
                            Срок ответа на запрос: <strong>24 часа</strong>
                        </p>
                    </div>
                </div>
            </section>
        </LegalPageLayout>
    );
}
