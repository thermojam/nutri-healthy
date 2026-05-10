/**
 * Zod-схема frontmatter для legal-документов в /content/legal/*.md
 *
 * Любая опечатка/пропуск в YAML-шапке падает на парсинге loader-ом,
 * а не в проде — это критично для юридического контента.
 */

import {z} from "zod";

export const LEGAL_CATEGORIES = ["contract", "privacy", "consent", "policy", "info", "legal"] as const;
export type LegalCategory = (typeof LEGAL_CATEGORIES)[number];

export const CONSENT_REQUIREMENTS = [
    "personal_data",
    "health_data",
    "cross_border",
    "marketing",
    "contract",
    "cookies",
] as const;
export type ConsentRequirement = (typeof CONSENT_REQUIREMENTS)[number];

const dateLike = z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Дата должна быть в формате YYYY-MM-DD"),
    z.date().transform((d) => d.toISOString().slice(0, 10)),
]);

export const legalFrontmatterSchema = z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/, "slug: только нижний регистр, цифры и дефис"),
    title: z.string().min(1),
    description: z.string().min(1),
    seoTitle: z.string().min(1).optional(),
    seoDescription: z.string().min(1).optional(),

    version: z.string().regex(/^\d+\.\d+$/, "version: например 3.0"),
    effectiveDate: dateLike,
    lastUpdated: dateLike,

    icon: z.string().min(1).optional(),
    category: z.enum(LEGAL_CATEGORIES),

    order: z.number().int().nonnegative().default(100),
    requiresConsent: z.enum(CONSENT_REQUIREMENTS).nullable().default(null),

    showInFooter: z.boolean().default(true),
    showInIndex: z.boolean().default(true),

    documentType: z.string().min(1).optional(),
    legalBasis: z.array(z.string()).default([]),
    relatedDocuments: z.array(z.string()).default([]),
});

export type LegalFrontmatter = z.infer<typeof legalFrontmatterSchema>;
