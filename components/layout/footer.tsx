import Link from "next/link";
import {Instagram, Send, Youtube, Mail, Phone, MapPin} from "lucide-react";
import {Logo} from "@/components/ui/logo";

const socialLinks = [
    {
        name: "Instagram",
        href: "https://instagram.com/username",
        icon: Instagram,
    },
    {
        name: "Telegram",
        href: "https://t.me/username",
        icon: Send,
    },
    {
        name: "YouTube",
        href: "https://youtube.com/@username",
        icon: Youtube,
    },
];

const legalLinks = [
    {href: "/legal/privacy-policy", label: "Политика конфиденциальности"},
    {href: "/legal/personal-data-consent", label: "Согласие на ПДн"},
    {href: "/legal/marketing-consent", label: "Согласие на рассылку"},
    {href: "/legal/contract", label: "Договор оферты"},
    {href: "/legal/return-policy", label: "Возврат"},
    {href: "/legal/delivery-terms", label: "Порядок оказания услуг"},
];

const contactInfo = [
    {
        icon: Mail,
        label: "Email",
        value: "info@yoursite.ru",
        href: "mailto:info@yoursite.ru",
    },
    {
        icon: Phone,
        label: "Телефон",
        value: "+7 (999) 123-45-67",
        href: "tel:+79991234567",
    },
    {
        icon: MapPin,
        label: "Адрес",
        value: "г. Москва, Россия",
        href: "#",
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border mt-auto rounded-t-[4rem] overflow-hidden">
            <div className="container px-4 md:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Logo size="md"/>
                        </Link>
                        <p className="text-sm text-muted">
                            Индивидуальные консультации по нутрициологии и health-коучингу.
                            Помощь в достижении здоровья и гармонии с телом.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-card-hover flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-5 w-5"/>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Навигация</h3>
                        <ul className="space-y-2">
                            {[
                                {href: "/#about", label: "Обо мне"},
                                {href: "/#services", label: "Услуги и тарифы"},
                                {href: "/#cases", label: "Кейсы и результаты"},
                                {href: "/#materials", label: "Полезные материалы"},
                                {href: "/#reviews", label: "Отзывы"},
                                {href: "/#faq", label: "Частые вопросы"},
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold mb-4">Услуги</h3>
                        <ul className="space-y-2">
                            {[
                                {href: "/services/nutrition", label: "Консультация нутрициолога"},
                                {href: "/services/health-coaching", label: "Health-коучинг"},
                                {href: "/services/slavic-gymnastics", label: "Славянская гимнастика"},
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div>
                        <h3 className="font-semibold mb-4">Контакты</h3>
                        <ul className="space-y-4">
                            {contactInfo.map((contact) => (
                                <li key={contact.label}>
                                    <a
                                        href={contact.href}
                                        className="flex items-start gap-3 text-sm text-muted hover:text-primary transition-colors"
                                    >
                                        <contact.icon className="h-5 w-5 shrink-0 mt-0.5"/>
                                        <div>
                                            <p className="text-xs text-muted">{contact.label}</p>
                                            <p>{contact.value}</p>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Legal & Bottom */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-sm text-muted">
                            © {currentYear} Ксения Каменская. Все права защищены.
                        </p>

                        {/* Legal Links */}
                        <div className="flex flex-wrap gap-4">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <p className="text-xs text-muted text-center">
                            <strong>Важно:</strong> Услуги нутрициолога и health-коуча не являются медицинскими услугами
                            и не заменяют консультацию врача. Перед применением рекомендаций рекомендуется
                            проконсультироваться со специалистом.
                        </p>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg">
                            <span className="text-xs text-muted">Принимаем к оплате:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="/images/payment/visa.svg" alt="Visa" className="h-6" />
                            <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6" />
                            <img src="/images/payment/mir.svg" alt="МИР" className="h-6" />
                            <img src="/images/payment/sbp.svg" alt="СБП" className="h-6" />
                        </div>
                    </div>

                    {/* Legal Info */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted">
                            ИП Каменская Ксения | ИНН 123456789012 | ОГРНИП 123456789012345
                        </p>
                        <p className="text-xs text-muted mt-1">
                            123317, г. Москва, Пресненская наб., д. 10, стр. 2 | info@yoursite.ru
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
