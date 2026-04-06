import { MetadataRoute } from 'next';

/**
 * Robots.txt для поисковых систем
 */

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/_next/',
                    '/*.json$',
                ],
            },
            {
                userAgent: 'Yandex',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/_next/',
                ],
                crawlDelay: 1, // Для Яндекса
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/_next/',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
