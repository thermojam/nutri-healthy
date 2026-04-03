import {MetadataRoute} from 'next';
import {serviceRepository} from '@/lib/db/repositories/service.repository';
import {articleRepository} from '@/lib/db/repositories/article.repository';
import {videoRepository} from '@/lib/db/repositories/video.repository';
import {webinarRepository} from '@/lib/db/repositories/webinar.repository';
import {caseRepository} from '@/lib/db/repositories/case.repository';

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
 * Получить динамические URL из БД напрямую (без HTTP запросов)
 */
async function getDynamicUrls(): Promise<MetadataRoute.Sitemap> {
    const urls: MetadataRoute.Sitemap = [];

    try {
        // Услуги
        const services = await serviceRepository.findAll(100);
        services.forEach((service) => {
            urls.push({
                url: `${BASE_URL}/services/${service.slug}`,
                lastModified: new Date(service.updatedAt || service.createdAt),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            });
        });

        // Статьи
        const articles = await articleRepository.findPublished(100);
        articles.forEach((article) => {
            urls.push({
                url: `${BASE_URL}/materials/articles/${article.slug}`,
                lastModified: new Date(article.updatedAt || article.createdAt),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            });
        });

        // Видео
        const videos = await videoRepository.findPublished(100);
        videos.forEach((video) => {
            urls.push({
                url: `${BASE_URL}/materials/videos/${video.slug}`,
                lastModified: new Date(video.updatedAt || video.createdAt),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            });
        });

        // Вебинары
        const webinars = await webinarRepository.findPublished(100);
        webinars.forEach((webinar) => {
            urls.push({
                url: `${BASE_URL}/materials/webinars/${webinar.slug}`,
                lastModified: new Date(webinar.updatedAt || webinar.createdAt),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            });
        });

        // Кейсы
        const cases = await caseRepository.findAll(100);
        cases.forEach((caseItem) => {
            urls.push({
                url: `${BASE_URL}/cases/${caseItem.slug}`,
                lastModified: new Date(caseItem.updatedAt || caseItem.createdAt),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            });
        });
    } catch (error) {
        console.error('Error fetching dynamic URLs for sitemap:', error);
    }

    return urls;
}
