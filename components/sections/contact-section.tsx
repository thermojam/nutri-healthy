"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Send, CheckCircle, AlertCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {FadeIn} from "@/components/motion/fade-in";
import {LegalConsentCheckboxes} from "@/components/features/legal-consent-checkboxes";
import {contactFormSchema} from "@/lib/validations";

type FormData = z.infer<typeof contactFormSchema>;

interface ContactSectionProps {
    data?: {
        title: string;
        subtitle: string;
        description: string;
        bonus?: string;
    };
}

export default function ContactSection({data}: ContactSectionProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const contactData = data || {
        title: "Записаться на консультацию",
        subtitle: "Начните свой путь к здоровью уже сегодня",
        description:
            "Оставьте заявку, и я свяжусь с вами в течение 24 часов для обсуждения деталей и подбора подходящей программы.",
        bonus:
            "🎁 Бонус за подписку: чек-лист «5 шагов к здоровому питанию» сразу на email!",
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            patronymic: "",
            email: "",
            phone: "",
            personalDataConsent: false,
            contractAcceptance: false,
            marketingConsent: false,
        },
    });

    const personalDataConsent = watch("personalDataConsent");
    const contractAcceptance = watch("contractAcceptance");
    const marketingConsent = watch("marketingConsent");

    const onSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/send-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Ошибка при отправке");
            }

            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Произошла ошибка");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section id="contact" className="py-24 bg-background">
                <div className="container">
                    <FadeIn>
                        <Card className="max-w-md mx-auto">
                            <CardContent className="p-8 text-center space-y-4">
                                <div
                                    className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                                    <CheckCircle className="h-8 w-8 text-success"/>
                                </div>
                                <h3 className="text-2xl font-bold">Заявка отправлена!</h3>
                                <p className="text-muted">
                                    Спасибо! Я свяжусь с вами в течение 24 часов.
                                </p>
                                <p className="text-sm text-muted">
                                    Проверьте почту — там уже ждет ваш бонусный чек-лист 🎁
                                </p>
                            </CardContent>
                        </Card>
                    </FadeIn>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-24 bg-background">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Левая часть - Информация */}
                    <FadeIn direction="right">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    {contactData.title}
                                </h2>
                                <p className="text-lg text-muted">
                                    {contactData.description}
                                </p>
                            </div>

                            {/* Бонус */}
                            {contactData.bonus && (
                                <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
                                    <p className="text-base">{contactData.bonus}</p>
                                </div>
                            )}

                            {/* Преимущества */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">Что вы получите:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Индивидуальный план действий",
                                        "Анализ текущего рациона и образа жизни",
                                        "Рекомендации по питанию и добавкам",
                                        "Поддержку в чате во время программы",
                                        "Доступ к полезным материалам",
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div
                                                className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <span className="text-primary text-sm">✓</span>
                                            </div>
                                            <span className="text-muted">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Контакты */}
                            <div className="pt-6 border-t border-border">
                                <h3 className="font-semibold mb-3">Или свяжитесь напрямую:</h3>
                                <div className="space-y-2 text-muted">
                                    <p>
                                        📧{" "}
                                        <a
                                            href="mailto:info@yoursite.ru"
                                            className="hover:text-primary transition-colors"
                                        >
                                            info@yoursite.ru
                                        </a>
                                    </p>
                                    <p>
                                        📱{" "}
                                        <a
                                            href="tel:+79991234567"
                                            className="hover:text-primary transition-colors"
                                        >
                                            +7 (999) 123-45-67
                                        </a>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span>💬</span>
                                        <a
                                            href="https://t.me/username"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary transition-colors"
                                        >
                                            Написать в Telegram
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Правая часть - Форма */}
                    <FadeIn direction="left" delay={0.2}>
                        <Card>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Имя и Фамилия */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="lastName"
                                                className="text-sm font-medium"
                                            >
                                                Фамилия <span className="text-error">*</span>
                                            </label>
                                            <Input
                                                id="lastName"
                                                placeholder="Иванова"
                                                {...register("lastName")}
                                                className={errors.lastName ? "border-error" : ""}
                                            />
                                            {errors.lastName && (
                                                <p className="text-xs text-error">
                                                    {errors.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="firstName"
                                                className="text-sm font-medium"
                                            >
                                                Имя <span className="text-error">*</span>
                                            </label>
                                            <Input
                                                id="firstName"
                                                placeholder="Ирина"
                                                {...register("firstName")}
                                                className={errors.firstName ? "border-error" : ""}
                                            />
                                            {errors.firstName && (
                                                <p className="text-xs text-error">
                                                    {errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Отчество */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="patronymic"
                                            className="text-sm font-medium"
                                        >
                                            Отчество
                                        </label>
                                        <Input
                                            id="patronymic"
                                            placeholder="Ивановна"
                                            {...register("patronymic")}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            Email <span className="text-error">*</span>
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="example@mail.ru"
                                            {...register("email")}
                                            className={errors.email ? "border-error" : ""}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-error">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Телефон */}
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium">
                                            Телефон
                                        </label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+7 (999) 123-45-67"
                                            {...register("phone")}
                                            className={errors.phone ? "border-error" : ""}
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-error">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    {/* Юридические согласия */}
                                    <div className="pt-2">
                                        <LegalConsentCheckboxes
                                            personalDataConsent={personalDataConsent}
                                            contractAcceptance={contractAcceptance}
                                            marketingConsent={marketingConsent}
                                            onPersonalDataChange={(checked) =>
                                                setValue("personalDataConsent", checked)
                                            }
                                            onContractChange={(checked) =>
                                                setValue("contractAcceptance", checked)
                                            }
                                            onMarketingChange={(checked) =>
                                                setValue("marketingConsent", checked)
                                            }
                                        />
                                    </div>

                                    {/* Ошибка формы */}
                                    {error && (
                                        <div
                                            className="flex items-center gap-2 text-error text-sm bg-error/10 p-3 rounded-xl">
                                            <AlertCircle className="h-4 w-4 shrink-0"/>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {/* Кнопка отправки */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                        <span className="animate-pulse">Отправка...</span>
                      </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                        <Send className="h-4 w-4"/>
                        Отправить заявку
                      </span>
                                        )}
                                    </Button>

                                    <p className="text-xs text-muted text-center">
                                        <span className="text-error">*</span> — обязательные поля
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
