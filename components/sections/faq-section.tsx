"use client";

import {Button} from "@/components/ui/button";
import {FadeIn} from "@/components/motion/fade-in";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
    data?: {
        title: string;
        subtitle: string;
        faqs?: {
            id: string;
            question: string;
            answer: string;
            category?: "general" | "nutrition" | "coaching" | "gymnastics" | "payment";
        }[];
    };
}

export default function FAQSection({data}: FAQSectionProps) {
    const faqData = data || {
        title: "Частые вопросы",
        subtitle: "Ответы на популярные вопросы о моих услугах и подходе",
        faqs: [
            {
                id: "1",
                question: "Как проходит первая консультация?",
                answer:
                    "Первая консультация длится 60-90 минут. Мы знакомимся, я задаю вопросы о вашем здоровье, образе жизни, питании и целях. После этого я составляю индивидуальный план рекомендаций. В течение недели после консультации вы получаете письменный план с рекомендациями и доступ к чату поддержки.",
                category: "general",
            },
            {
                id: "2",
                question: "Нужно ли сдавать анализы перед консультацией?",
                answer:
                    "Желательно иметь свежие анализы (общий анализ крови, биохимия, гормоны щитовидной железы, витамин D, ферритин). Если анализов нет, я подскажу, какие именно нужно сдать и где это можно сделать недорого.",
                category: "nutrition",
            },
            {
                id: "3",
                question: "Сколько времени занимает программа?",
                answer:
                    "Минимальный срок работы — 1 месяц. За это время можно сформировать базовые привычки и увидеть первые результаты. Для устойчивых изменений рекомендую работать 3-6 месяцев. VIP-сопровождение рассчитано на 3 месяца.",
                category: "general",
            },
            {
                id: "4",
                question: "Работаете ли вы онлайн или только очно?",
                answer:
                    "Основной формат работы — онлайн (видеоконсультации через Zoom, Skype или Telegram). Это удобно для вас и для меня. При необходимости возможен очный формат в г. Москве (обсуждается индивидуально).",
                category: "general",
            },
            {
                id: "5",
                question: "Гарантируете ли вы результат?",
                answer:
                    "Я гарантирую профессиональный подход, индивидуальный план и поддержку. Однако результат зависит от многих факторов, включая вашу готовность следовать рекомендациям. Большинство клиентов достигают поставленных целей при соблюдении рекомендаций.",
                category: "general",
            },
            {
                id: "6",
                question: "Можно ли оплатить услугу в рассрочку?",
                answer:
                    "Да, доступна рассрочка от партнеров: Яндекс.Рассрочка, Долями, Тинькофф Рассрочка. Вы можете разделить платеж на 2-12 частей без процентов и переплат. Условия зависят от выбранного сервиса и суммы.",
                category: "payment",
            },
            {
                id: "7",
                question: "Что делать, если мне не подойдет программа?",
                answer:
                    "Если после первой консультации вы поймете, что формат вам не подходит, я верну полную стоимость за вычетом фактически оказанных услуг. Возврат осуществляется в течение 10 рабочих дней.",
                category: "payment",
            },
            {
                id: "8",
                question: "Как записаться на славянскую гимнастику?",
                answer:
                    "Занятия по славянской гимнастике проходят по расписанию. После оплаты вы получаете доступ к видео-урокам и приглашение в закрытый чат участников. Групповые созвоны проводятся 1-2 раза в месяц.",
                category: "gymnastics",
            },
            {
                id: "9",
                question: "Работаете ли вы с мужчинами?",
                answer:
                    "Да, я работаю как с женщинами, так и с мужчинами. Подход адаптируется под ваши особенности и цели. Мужчины часто обращаются по вопросам энергии, веса и здоровья ЖКТ.",
                category: "general",
            },
            {
                id: "10",
                question: "Можно ли получить чек об оплате?",
                answer:
                    "Да, все чеки формируются автоматически в соответствии с 54-ФЗ и отправляются на ваш email в течение 24 часов после оплаты. Чек содержит все необходимые данные для отчетности.",
                category: "payment",
            },
        ],
    };

    return (
        <section id="faq" className="py-16 sm:py-24 bg-card">
            <div className="container px-3 sm:px-4 md:px-6">
                <FadeIn className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        Ответы на ваши вопросы
                    </h2>
                    <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                        Честные ответы на популярные вопросы о моих услугах и подходе.
                        Если не нашли ответ — напишите мне, я отвечу в течение 24 часов.
                    </p>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
                            {faqData.faqs?.map((faq, index) => (
                                <AccordionItem
                                    key={faq.id}
                                    value={faq.id}
                                    className="border border-border rounded-xl sm:rounded-2xl px-4 sm:px-6"
                                >
                                    <AccordionTrigger className="text-left py-4 sm:py-5 hover:no-underline">
                                        <span className="font-medium text-sm sm:text-base pr-2">{faq.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4 sm:pb-5 pt-0">
                                        <p className="text-muted text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={0.4}>
                    <div className="mt-8 sm:mt-12 text-center">
                        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary/20">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">
                                Остались вопросы?
                            </h3>
                            <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
                                Задайте вопрос прямо сейчас — я отвечу в течение 24 часов.
                                Это бесплатно и ни к чему не обязывает.
                            </p>
                            <a href="#contact" className="block w-full max-w-xs mx-auto">
                                <Button size="lg" className="w-full">
                                    Задать вопрос →
                                </Button>
                            </a>
                        </div>
                    </div>
                </FadeIn>

                {/* Дополнительная информация */}
                <FadeIn delay={0.5}>
                    <div className="mt-8 sm:mt-12 max-w-3xl mx-auto">
                        <div className="p-4 sm:p-6 bg-primary/5 rounded-xl sm:rounded-2xl border border-primary/20">
                            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <span className="text-lg sm:text-xl">💡</span>
                                Важно знать
                            </h3>
                            <ul className="space-y-2 text-xs sm:text-sm text-muted">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>
                                        Все консультации конфиденциальны. Я не передаю информацию
                                        третьим лицам.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>
                                        Вы можете отменить или перенести консультацию не позднее чем
                                        за 24 часа.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>
                                        После каждой консультации вы получаете запись встречи и
                                        письменные рекомендации.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
