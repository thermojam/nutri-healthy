/**
 * Компонент аналитики
 * Подключает Яндекс Метрику
 * 
 * Google Analytics удален (не работает в РФ)
 */

'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

interface AnalyticsConfig {
    yandexMetricaId?: string;
}

const config: AnalyticsConfig = {
    yandexMetricaId: process.env.NEXT_PUBLIC_YANDEX_METRICA_ID,
};

/**
 * Инициализация Яндекс Метрики
 */
function initYandexMetrica(id: string) {
    if (typeof window === 'undefined') return;

    // @ts-ignore
    window.yaCounter = window.yaCounter || [];
    
    // @ts-ignore
    window.yaCounter.push(['init', {id}]);

    const script = document.createElement('script');
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`;
    script.async = true;
    document.head.appendChild(script);
}

/**
 * Компонент для отслеживания просмотров страниц
 */
export function AnalyticsProvider({children}: {children: React.ReactNode}) {
    const pathname = usePathname();

    useEffect(() => {
        // Инициализация при первом запуске
        if (config.yandexMetricaId) {
            initYandexMetrica(config.yandexMetricaId);
        }
    }, []);

    useEffect(() => {
        // Отправка просмотра страницы
        if (config.yandexMetricaId) {
            // @ts-ignore
            if (window.yaCounter) {
                // @ts-ignore
                window.yaCounter.push(['hit', pathname]);
            }
        }
    }, [pathname]);

    return <>{children}</>;
}

/**
 * Компонент для отслеживания событий
 */
export function trackEvent(
    eventName: string,
    params?: Record<string, any>
) {
    // Яндекс Метрика
    // @ts-ignore
    if (window.yaCounter && config.yandexMetricaId) {
        // @ts-ignore
        window.yaCounter.push(['reachGoal', eventName, params]);
    }
}

/**
 * Трекинг целей (для кнопок, форм и т.д.)
 */
export const trackGoal = trackEvent;
