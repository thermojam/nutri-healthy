/**
 * Schema.org JSON-LD разметка
 * Улучшает отображение в поисковой выдаче
 */

export interface OrganizationSchema {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
    contactPoint?: {
        "@type": string;
        contactType: string;
        email?: string;
        telephone?: string;
        availableLanguage?: string[];
    }[];
}

export interface PersonSchema {
    "@context": string;
    "@type": string;
    name: string;
    jobTitle: string;
    url: string;
    sameAs?: string[];
}

export interface ServiceSchema {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    provider: {
        "@type": string;
        name: string;
    };
    offers?: {
        "@type": string;
        priceCurrency: string;
        price: string;
        availability: string;
    }[];
}

export interface ArticleSchema {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    image?: string;
    author: {
        "@type": string;
        name: string;
    };
    datePublished: string;
    dateModified?: string;
    publisher?: {
        "@type": string;
        name: string;
    };
}

/**
 * Разметка для организации
 */
export function generateOrganizationSchema(
    name: string,
    url: string,
    email?: string,
    phone?: string
): OrganizationSchema {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url,
        logo: `${url}/logo.png`,
        sameAs: [
            "https://instagram.com/username",
            "https://t.me/username",
            "https://youtube.com/@username",
        ],
        contactPoint: [
            {
                "@type": "ContactPoint",
                contactType: "customer service",
                email,
                telephone: phone,
                availableLanguage: ["Russian"],
            },
        ],
    };
}

/**
 * Разметка для персоны (нутрициолог)
 */
export function generatePersonSchema(
    name: string,
    jobTitle: string,
    url: string
): PersonSchema {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name,
        jobTitle,
        url,
        sameAs: [
            "https://instagram.com/username",
            "https://t.me/username",
        ],
    };
}

/**
 * Разметка для услуги
 */
export function generateServiceSchema(
    name: string,
    description: string,
    providerName: string,
    price?: number,
    currency: string = "RUB"
): ServiceSchema {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        provider: {
            "@type": "Person",
            name: providerName,
        },
        offers: price
            ? [
                  {
                      "@type": "Offer",
                      priceCurrency: currency,
                      price: price.toString(),
                      availability: "https://schema.org/InStock",
                  },
              ]
            : undefined,
    };
}

/**
 * Разметка для статьи
 */
export function generateArticleSchema(
    headline: string,
    description: string,
    author: string,
    datePublished: string,
    image?: string
): ArticleSchema {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        image,
        author: {
            "@type": "Person",
            name: author,
        },
        datePublished,
        dateModified: datePublished,
        publisher: {
            "@type": "Person",
            name: author,
        },
    };
}

/**
 * Компонент для добавления Schema.org разметки
 */
export function SchemaScript({schema}: {schema: object}) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
        />
    );
}
