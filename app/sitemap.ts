import { MetadataRoute } from 'next';

/**
 * Sitemap для поисковых систем
 * Генерируется динамически при каждом запросе
 */

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// Статические страницы
const STATIC_PAGES = [
    '',
    '/about',
    '/services',
    '/cases',
    '/materials',
    '/materials/articles',
    '/materials/videos',
    '/materials/webinars',
    '/legal/privacy-policy',
    '/legal/personal-data-consent',
    '/legal/marketing-consent',
    '/legal/contract',
    '/payment/success',
    '/payment/cancel',
];

// Приоритеты для разных типов страниц
const PAGE_PRIORITIES: Record<string, number> = {
    '': 1.0, // Главная
    '/about': 0.9,
    '/services': 0.9,
    '/cases': 0.8,
    '/materials': 0.8,
    '/materials/articles': 0.7,
    '/materials/videos': 0.7,
    '/materials/webinars': 0.7,
    '/legal': 0.5,
    '/payment': 0.3,
};

// Частота обновления
const CHANGE_FREQUENCIES: Record<string, 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'> = {
    '': 'weekly',
    '/about': 'monthly',
    '/services': 'weekly',
    '/cases': 'weekly',
    '/materials': 'daily',
    '/legal': 'yearly',
    '/payment': 'never',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Базовые статические страницы
    const staticUrls = STATIC_PAGES.map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: CHANGE_FREQUENCIES[route.split('/')[1] || ''] || 'monthly',
        priority: PAGE_PRIORITIES[route] ?? 0.5,
    }));

    // Динамические страницы (услуги, статьи, видео, вебинары, кейсы)
    const dynamicUrls = await getDynamicUrls();

    return [...staticUrls, ...dynamicUrls];
}

/**
 * Получить динамические URL из БД
 */
async function getDynamicUrls(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = BASE_URL;
    const urls: MetadataRoute.Sitemap = [];

    try {
        // Услуги
        const services = await fetch(`${baseUrl}/api/services`).then(res => res.json());
        if (services.data) {
            services.data.forEach((service: any) => {
                urls.push({
                    url: `${baseUrl}/services/${service.slug}`,
                    lastModified: new Date(service.updatedAt),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                });
            });
        }

        // Статьи
        const articles = await fetch(`${baseUrl}/api/articles`).then(res => res.json());
        if (articles.data) {
            articles.data.forEach((article: any) => {
                urls.push({
                    url: `${baseUrl}/materials/articles/${article.slug}`,
                    lastModified: new Date(article.updatedAt),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                });
            });
        }

        // Видео
        const videos = await fetch(`${baseUrl}/api/videos`).then(res => res.json());
        if (videos.data) {
            videos.data.forEach((video: any) => {
                urls.push({
                    url: `${baseUrl}/materials/videos/${video.slug}`,
                    lastModified: new Date(video.updatedAt),
                    changeFrequency: 'monthly' as const,
                    priority: 0.6,
                });
            });
        }

        // Вебинары
        const webinars = await fetch(`${baseUrl}/api/webinars`).then(res => res.json());
        if (webinars.data) {
            webinars.data.forEach((webinar: any) => {
                urls.push({
                    url: `${baseUrl}/materials/webinars/${webinar.slug}`,
                    lastModified: new Date(webinar.updatedAt),
                    changeFrequency: 'monthly' as const,
                    priority: 0.6,
                });
            });
        }

        // Кейсы
        const cases = await fetch(`${baseUrl}/api/cases`).then(res => res.json());
        if (cases.data) {
            cases.data.forEach((caseItem: any) => {
                urls.push({
                    url: `${baseUrl}/cases/${caseItem.slug}`,
                    lastModified: new Date(caseItem.updatedAt),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                });
            });
        }
    } catch (error) {
        console.error('Error fetching dynamic URLs for sitemap:', error);
    }

    return urls;
}
