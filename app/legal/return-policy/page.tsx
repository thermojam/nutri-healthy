import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Возврат и обмен | Ксения Каменская",
    description: "Порядок возврата и отказа от услуг нутрициологии и health-коучинга",
    robots: {index: true, follow: true},
};

export default function ReturnPolicyPage() {
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
                        Возврат и отказ от услуг
                    </h1>

                    <p className="text-muted text-lg mb-8">
                        Порядок возврата денежных средств за услуги нутрициологии и health-коучинга
                    </p>

                    <p className="text-sm text-muted mb-12">
                        <strong>Версия:</strong> 1.0 | <strong>Дата:</strong> {new Date().toLocaleDateString("ru-RU")}
                    </p>

                    <section>
                        <h2>1. Общие положения</h2>
                        <p>
                            Настоящий документ регулирует порядок возврата денежных средств за услуги, оказанные ИП Каменская Ксения 
                            (далее — Исполнитель) через сайт https://yoursite.ru (далее — Сайт).
                        </p>
                        <p>
                            Возврат осуществляется в соответствии с:
                        </p>
                        <ul>
                            <li>Законом РФ «О защите прав потребителей» (ст. 29, 31, 32)</li>
                            <li>Гражданским кодексом РФ (ст. 782)</li>
                            <li>Правилами оказания платных услуг (Постановление Правительства РФ № 2463)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Возврат до начала оказания услуг</h2>
                        <p>
                            Заказчик вправе отказаться от исполнения договора в любое время до начала оказания услуг при условии 
                            оплаты Исполнителю фактически понесенных расходов.
                        </p>
                        <p>
                            <strong>Порядок возврата:</strong>
                        </p>
                        <ol>
                            <li>Направьте заявление на возврат на email: <a href="mailto:info@yoursite.ru">info@yoursite.ru</a></li>
                            <li>В заявлении укажите: ФИО, номер заказа, причину возврата, реквизиты для перевода</li>
                            <li>Возврат осуществляется в течение 10 рабочих дней</li>
                            <li>Комиссия платежных систем не возвращается</li>
                        </ol>
                    </section>

                    <section>
                        <h2>3. Возврат после начала оказания услуг</h2>
                        <p>
                            При отказе от услуг после начала их оказания Исполнитель вправе удержать часть стоимости 
                            пропорционально фактически оказанным услугам.
                        </p>
                        <p>
                            <strong>Пример расчета:</strong>
                        </p>
                        <div className="bg-card border border-border p-4 rounded-xl my-4">
                            <p className="text-sm">
                                Стоимость программы: <strong>15 000 ₽</strong><br/>
                                Проведено консультаций: <strong>1 из 3</strong><br/>
                                Стоимость одной консультации: <strong>5 000 ₽</strong><br/>
                                <br/>
                                <strong>К возврату: 10 000 ₽</strong> (15 000 - 5 000)
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2>4. Возврат за цифровые продукты</h2>
                        <p>
                            Возврат за цифровые продукты (планы питания, гайды, чек-листы) возможен только в случае:
                        </p>
                        <ul>
                            <li>Технической неисправности продукта</li>
                            <li>Несоответствия продукта описанию на сайте</li>
                        </ul>
                        <p>
                            Возврат не возможен, если:
                        </p>
                        <ul>
                            <li>Продукт был скачан/активирован</li>
                            <li>Прошло более 7 дней с момента покупки</li>
                            <li>Претензии к содержанию продукта (субъективная оценка)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Сроки возврата</h2>
                        <p>
                            Возврат денежных средств осуществляется в течение:
                        </p>
                        <ul>
                            <li><strong>10 рабочих дней</strong> — для заявлений, поданных до начала оказания услуг</li>
                            <li><strong>30 календарных дней</strong> — для заявлений, поданных после начала оказания услуг</li>
                        </ul>
                        <p>
                            Денежные средства возвращаются тем же способом, которым была произведена оплата:
                        </p>
                        <ul>
                            <li>На банковскую карту — в течение 3-10 рабочих дней</li>
                            <li>Через платежную систему — в течение 1-3 рабочих дней</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Контакты для возврата</h2>
                        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl my-4">
                            <p className="font-semibold mb-2">Для оформления возврата:</p>
                            <ul className="text-sm space-y-1">
                                <li>📧 Email: <a href="mailto:info@yoursite.ru" className="text-primary">info@yoursite.ru</a></li>
                                <li>📱 Телефон: <a href="tel:+79991234567" className="text-primary">+7 (999) 123-45-67</a></li>
                                <li>💬 Telegram: <a href="https://t.me/username" className="text-primary">@username</a></li>
                                <li>⏰ Режим работы: Пн-Пт 9:00-18:00 (МСК)</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2>7. Образец заявления на возврат</h2>
                        <div className="bg-card border border-border p-6 rounded-xl my-4 font-mono text-sm">
                            <p className="mb-4">Директору ИП Каменская Ксения<br/>от [Ваше ФИО]<br/>Email: [ваш email]</p>
                            
                            <p className="mb-4 font-semibold">ЗАЯВЛЕНИЕ НА ВОЗВРАТ</p>
                            
                            <p className="mb-4">
                                Прошу вернуть денежные средства в размере [сумма] ₽ за заказ №[номер] от [дата].<br/>
                                Причина: [укажите причину]
                            </p>
                            
                            <p className="mb-4">
                                Реквизиты для возврата:<br/>
                                Карта: [XXXX XXXX XXXX XXXX]<br/>
                                Банк: [название банка]
                            </p>
                            
                            <p className="mt-8">Дата: ___________</p>
                            <p>Подпись: ___________</p>
                        </div>
                    </section>

                    <div className="mt-12 p-6 bg-accent/5 border border-accent/20 rounded-xl">
                        <h3 className="text-lg font-semibold mb-2">📞 Нужна помощь?</h3>
                        <p className="text-sm text-muted mb-4">
                            Если у вас возникли вопросы по возврату, свяжитесь с нашей службой поддержки.
                        </p>
                        <Link href="/#contact">
                            <Button>Связаться с поддержкой</Button>
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
