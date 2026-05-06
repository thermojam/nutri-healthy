"use client";

import * as React from "react";
import Link from "next/link";
import {useTheme} from "next-themes";
import {Moon, Sun, Menu, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Logo} from "@/components/ui/logo";
import {cn} from "@/lib/utils";

const navLinks = [
    {href: "/#about", label: "Обо мне"},
    {href: "/#services", label: "Услуги"},
    {href: "/#cases", label: "Кейсы"},
    {href: "/#materials", label: "Материалы"},
    {href: "/#faq", label: "FAQ"},
];

const legalLinks = [
    {href: "/legal/privacy-policy", label: "Конфиденциальность"},
    {href: "/legal/personal-data-consent", label: "ПДн"},
    {href: "/legal/contract", label: "Оферта"},
];

export default function Header() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, {passive: true});
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-background/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
            )}
        >
            <div className="container">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Logo size="md"/>
                    </Link>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        {mounted && theme && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="rounded-full relative"
                                aria-label="Переключить тему"
                            >
                                <Sun
                                    className={cn(
                                        "h-5 w-5 transition-all duration-300",
                                        theme === "dark" ? "rotate-90 scale-0 absolute opacity-0" : "rotate-0 scale-100 opacity-100"
                                    )}
                                />
                                <Moon
                                    className={cn(
                                        "h-5 w-5 transition-all duration-300",
                                        theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 absolute opacity-0"
                                    )}
                                />
                            </Button>
                        )}

                        {/* CTA Button */}
                        <Link href="/#contact">
                            <Button size="sm" className="hidden sm:inline-flex">
                                Записаться
                            </Button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Меню"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6"/>
                            ) : (
                                <Menu className="h-6 w-6"/>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-background border-b border-border animate-fade-in">
                    <div className="container py-6">
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-base font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-border">
                                <p className="text-sm text-muted mb-2">Юридическая информация:</p>
                                {legalLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block text-sm text-muted hover:text-primary py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href="/#contact"
                                className="mt-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Button className="w-full">Записаться на консультацию</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
