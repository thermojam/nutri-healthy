/**
 * Реестр всех legal-документов.
 *
 * Используется для:
 *   - generateStaticParams() в /app/legal/[slug]/page.tsx
 *   - индекс-страницы /legal
 *   - sitemap
 *   - футера (фильтр по showInFooter)
 */

import {listLegalSlugs, loadLegalDocument, type LegalDocument} from "./loader";

let cache: LegalDocument[] | null = null;

export async function getAllLegalDocuments(): Promise<LegalDocument[]> {
    if (cache) return cache;

    const slugs = await listLegalSlugs();
    const docs = await Promise.all(slugs.map((slug) => loadLegalDocument(slug)));

    cache = docs.sort((a, b) => {
        if (a.frontmatter.order !== b.frontmatter.order) {
            return a.frontmatter.order - b.frontmatter.order;
        }
        return a.frontmatter.title.localeCompare(b.frontmatter.title, "ru");
    });

    return cache;
}

export async function getFooterLegalDocuments(): Promise<LegalDocument[]> {
    const docs = await getAllLegalDocuments();
    return docs.filter((d) => d.frontmatter.showInFooter);
}

export async function getIndexLegalDocuments(): Promise<LegalDocument[]> {
    const docs = await getAllLegalDocuments();
    return docs.filter((d) => d.frontmatter.showInIndex);
}
