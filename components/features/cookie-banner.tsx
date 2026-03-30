"use client";

import { useState, useEffect } from "react";
import { X, Cookie, Settings, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * CookieBanner - GDPR/152-ФЗ совместимый баннер согласия на cookies
 * С системой контроля версий политики
 * 
 * Требования:
 * - GDPR (EU) 2016/679
 * - 152-ФЗ "О персональных данных" (Россия)
 * - ePrivacy Directive 2002/58/EC
 */

/**
 * ВЕРСИЯ ПОЛИТИКИ COOKIES
 * Обновляйте timestamp при изменении политики конфиденциальности
 * Формат: миллисекунды Unix (Date.now())
 * 
 * Пример обновления:
 * const LATEST_POLICY_DATE = new Date("2026-01-15").getTime(); // 1768435200000
 */
const LATEST_POLICY_DATE = 1767225600000; // 2026-01-01T00:00:00Z

interface CookieConsent {
    necessary: boolean;      // Всегда true (технические cookies)
    analytics: boolean;      // Аналитика (Google Analytics, Yandex Metrica)
    marketing: boolean;      // Маркетинг (рекламные cookies)
    policyTimestamp: number; // Версия политики, с которой получено согласие
    timestamp: number;       // Время получения согласия
}

interface CookieBannerProps {
    /** Callback при принятии всех cookies - инициализация аналитики */
    onAcceptAll?: () => void;
    /** Callback при принятии только обязательных */
    onAcceptNecessary?: () => void;
    /** Callback при кастомном выборе */
    onAcceptCustom?: (consent: CookieConsent) => void;
    /** Ссылка на политику использования cookies */
    policyUrl?: string;
}

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Очистка старых cookie-записей перед сохранением новых
 */
function clearOldCookies(): void {
    // Очищаем localStorage
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    
    // Очищаем cookie (устанавливаем expired date)
    document.cookie = `${COOKIE_CONSENT_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    console.log("🧹 Old cookie records cleared");
}

/**
 * Установка cookie с правильными параметрами безопасности
 */
function setCookieConsent(consent: CookieConsent): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
    
    // Сохраняем в localStorage для быстрого доступа
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    
    // Дублируем в cookie для серверных проверок
    document.cookie = `${COOKIE_CONSENT_KEY}=${JSON.stringify(consent)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
}

/**
 * Получение текущего согласия из localStorage
 */
function getCookieConsent(): CookieConsent | null {
    if (typeof window === "undefined") return null;
    
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
        return JSON.parse(stored) as CookieConsent;
    }
    
    // Пробуем получить из cookie
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === COOKIE_CONSENT_KEY) {
            return JSON.parse(decodeURIComponent(value)) as CookieConsent;
        }
    }
    
    return null;
}

/**
 * Проверка актуальности согласия
 * Возвращает true если согласие устарело или отсутствует
 */
function isConsentOutdated(consent: CookieConsent | null): boolean {
    if (!consent) return true;
    return consent.policyTimestamp < LATEST_POLICY_DATE;
}

/**
 * Типы для глобальных объектов аналитики
 */
interface GtagCommand {
    command: string;
    targetId: string;
    config?: Record<string, string>;
}

interface WindowWithAnalytics extends Window {
    gtag?: (
        command: string,
        targetId: string,
        config?: Record<string, string>
    ) => void;
    ym?: (
        counterId: number | string,
        command: string,
        params?: Record<string, boolean>
    ) => void;
}

/**
 * Инициализация скриптов аналитики после получения согласия
 */
function initializeAnalytics(): void {
    const win = window as WindowWithAnalytics;
    
    // Google Analytics
    if (typeof window !== "undefined" && win.gtag) {
        win.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
        });
    }

    // Yandex Metrica
    if (typeof window !== "undefined" && win.ym) {
        win.ym(0, "click", {
            analytics: true,
        });
    }

    console.log("✅ Analytics initialized");
}

/**
 * Отключение аналитики
 */
function disableAnalytics(): void {
    const win = window as WindowWithAnalytics;
    
    if (typeof window !== "undefined" && win.gtag) {
        win.gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
        });
    }

    console.log("🚫 Analytics disabled");
}

export function CookieBanner({
    onAcceptAll,
    onAcceptNecessary,
    onAcceptCustom,
    policyUrl = "/legal/privacy-policy",
}: CookieBannerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasPolicyUpdate, setHasPolicyUpdate] = useState(false);
    const [customConsent, setCustomConsent] = useState<CookieConsent>({
        necessary: true,
        analytics: false,
        marketing: false,
        policyTimestamp: LATEST_POLICY_DATE,
        timestamp: 0, // Будет установлено при взаимодействии пользователя
    });

    useEffect(() => {
        // Проверяем согласие после монтирования
        const consent = getCookieConsent();
        const outdated = isConsentOutdated(consent);

        if (outdated) {
            // Если согласие устарело — показываем баннер
            setHasPolicyUpdate(consent !== null); // Показываем индикатор если было старое согласие
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        // Очищаем старые записи перед сохранением новых
        clearOldCookies();

        const consent: CookieConsent = {
            necessary: true,
            analytics: true,
            marketing: true,
            policyTimestamp: LATEST_POLICY_DATE,
            timestamp: Date.now(),
        };

        setCookieConsent(consent);
        initializeAnalytics();
        setIsVisible(false);

        // Вызываем кастомный callback если есть
        onAcceptAll?.();

        console.log("✅ User accepted all cookies");
        console.log(`📋 Policy version: ${new Date(LATEST_POLICY_DATE).toISOString().split('T')[0]}`);
    };

    const handleAcceptNecessary = () => {
        // Очищаем старые записи перед сохранением новых
        clearOldCookies();

        const consent: CookieConsent = {
            necessary: true,
            analytics: false,
            marketing: false,
            policyTimestamp: LATEST_POLICY_DATE,
            timestamp: Date.now(),
        };

        setCookieConsent(consent);
        disableAnalytics();
        setIsVisible(false);

        // Вызываем кастомный callback если есть
        onAcceptNecessary?.();

        console.log("✅ User accepted necessary cookies only");
        console.log(`📋 Policy version: ${new Date(LATEST_POLICY_DATE).toISOString().split('T')[0]}`);
    };

    const handleCustomize = () => {
        setIsExpanded(true);
    };

    const handleSaveCustom = () => {
        // Очищаем старые записи перед сохранением новых
        clearOldCookies();

        const consent: CookieConsent = {
            ...customConsent,
            policyTimestamp: LATEST_POLICY_DATE,
            timestamp: Date.now(),
        };

        setCookieConsent(consent);

        if (consent.analytics || consent.marketing) {
            initializeAnalytics();
        } else {
            disableAnalytics();
        }

        setIsVisible(false);
        onAcceptCustom?.(consent);

        console.log("✅ User saved custom cookies settings");
        console.log(`📋 Policy version: ${new Date(LATEST_POLICY_DATE).toISOString().split('T')[0]}`);
    };

    const toggleAnalytics = () => {
        setCustomConsent(prev => ({ ...prev, analytics: !prev.analytics }));
    };

    const toggleMarketing = () => {
        setCustomConsent(prev => ({ ...prev, marketing: !prev.marketing }));
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50",
                "bg-background/95 backdrop-blur-md border-t border-border",
                "shadow-lg shadow-black/5",
                "transition-all duration-300 ease-in-out",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}
            role="dialog"
            aria-labelledby="cookie-banner-title"
            aria-describedby="cookie-banner-description"
        >
            <div className="container max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                {!isExpanded ? (
                    // Компактная версия
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Cookie className="h-5 w-5 text-primary" />
                                <h3 id="cookie-banner-title" className="font-semibold text-sm sm:text-base">
                                    Мы используем cookies
                                </h3>
                                {hasPolicyUpdate && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-medium">
                                        <RefreshCcw className="h-3 w-3" />
                                        <span className="hidden sm:inline">Обновлено</span>
                                    </div>
                                )}
                            </div>
                            <p id="cookie-banner-description" className="text-xs sm:text-sm text-muted leading-relaxed">
                                {hasPolicyUpdate ? (
                                    <>
                                        <strong className="text-foreground">Политика обновлена!</strong> Мы обновили 
                                        правила использования cookies. Пожалуйста, просмотрите и подтвердите свой 
                                        выбор. Подробности в{" "}
                                        <a
                                            href={policyUrl}
                                            className="text-primary hover:underline font-medium"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Политике конфиденциальности
                                        </a>.
                                    </>
                                ) : (
                                    <>
                                        Используем cookies для анализа трафика, персонализации контента и улучшения 
                                        работы сайта. Это помогает нам делать сервис лучше. Подробности в{" "}
                                        <a
                                            href={policyUrl}
                                            className="text-primary hover:underline font-medium"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Политике конфиденциальности
                                        </a>.
                                    </>
                                )}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCustomize}
                                className="text-xs sm:text-sm"
                            >
                                <Settings className="h-4 w-4 mr-1" />
                                Настроить
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAcceptNecessary}
                                className="text-xs sm:text-sm"
                            >
                                Только обязательные
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleAcceptAll}
                                className="text-xs sm:text-sm"
                            >
                                Принять все
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClose}
                                className="h-8 w-8 sm:hidden"
                                aria-label="Закрыть"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Расширенная версия с настройками
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Cookie className="h-5 w-5 text-primary" />
                                <h3 id="cookie-banner-title" className="font-semibold text-sm sm:text-base">
                                    Настройки cookies
                                </h3>
                                {hasPolicyUpdate && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-medium">
                                        <RefreshCcw className="h-3 w-3" />
                                        <span className="hidden sm:inline">Политика обновлена</span>
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsExpanded(false)}
                                className="h-8 w-8 shrink-0"
                                aria-label="Свернуть"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {hasPolicyUpdate && (
                            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
                                <RefreshCcw className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-accent mb-1">Обновление политики</h4>
                                    <p className="text-xs text-muted">
                                        Мы обновили политику использования cookies. Пожалуйста, подтвердите свой выбор 
                                        для продолжения работы сайта.
                                    </p>
                                </div>
                            </div>
                        )}

                        <p className="text-xs sm:text-sm text-muted leading-relaxed">
                            Выберите, какие cookies вы разрешаете использовать. Вы можете изменить свой выбор в любое время.
                        </p>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {/* Обязательные cookies */}
                            <div className="border border-border rounded-xl p-4 bg-card opacity-60">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg">🔒</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Обязательные</h4>
                                            <p className="text-xs text-muted">Всегда активны</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-6 bg-primary rounded-full relative cursor-not-allowed">
                                        <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow"/>
                                    </div>
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                    Необходимы для работы сайта: авторизация, безопасность, корзина покупок.
                                    Без них сайт не будет функционировать.
                                </p>
                            </div>

                            {/* Аналитические cookies */}
                            <div className={cn(
                                "border rounded-xl p-4 bg-card transition-all",
                                customConsent.analytics ? "border-accent bg-accent/5" : "border-border"
                            )}>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                            <span className="text-lg">📊</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Аналитика</h4>
                                            <p className="text-xs text-muted">На ваше усмотрение</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleAnalytics}
                                        className={cn(
                                            "w-10 h-6 rounded-full relative transition-colors",
                                            customConsent.analytics ? "bg-accent" : "bg-muted"
                                        )}
                                        role="switch"
                                        aria-checked={customConsent.analytics}
                                        aria-label="Включить аналитику"
                                    >
                                        <div className={cn(
                                            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                                            customConsent.analytics ? "right-0.5" : "left-0.5"
                                        )}/>
                                    </button>
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                    Google Analytics, Яндекс.Метрика. Помогают понять, как вы используете сайт,
                                    чтобы сделать его удобнее.
                                </p>
                            </div>

                            {/* Маркетинговые cookies */}
                            <div className={cn(
                                "border rounded-xl p-4 bg-card transition-all",
                                customConsent.marketing ? "border-primary bg-primary/5" : "border-border"
                            )}>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg">📢</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Маркетинг</h4>
                                            <p className="text-xs text-muted">На ваше усмотрение</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleMarketing}
                                        className={cn(
                                            "w-10 h-6 rounded-full relative transition-colors",
                                            customConsent.marketing ? "bg-primary" : "bg-muted"
                                        )}
                                        role="switch"
                                        aria-checked={customConsent.marketing}
                                        aria-label="Включить маркетинг"
                                    >
                                        <div className={cn(
                                            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                                            customConsent.marketing ? "right-0.5" : "left-0.5"
                                        )}/>
                                    </button>
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                    Рекламные cookies для показа релевантных предложений.
                                    Могут использоваться третьими лицами (рекламные сети).
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveCustom}
                                className="text-xs sm:text-sm"
                            >
                                Сохранить выбор
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleAcceptAll}
                                className="text-xs sm:text-sm"
                            >
                                Принять все
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * CookieBannerWrapper - обертка для глобального использования
 * Автоматически инициализирует аналитику при согласии
 */
export function CookieBannerWrapper() {
    return (
        <CookieBanner
            onAcceptAll={() => {
                // Здесь можно добавить дополнительную логику
                console.log("🎯 All cookies accepted - initializing services");
            }}
            onAcceptNecessary={() => {
                console.log("🔒 Only necessary cookies accepted");
            }}
            policyUrl="/legal/privacy-policy"
        />
    );
}

export default CookieBanner;
