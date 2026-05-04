/**
 * Загрузчик legal-документов из /content/legal/*.md
 *
 * - читает файл с диска
 * - парсит frontmatter через gray-matter
 * - валидирует frontmatter Zod-схемой
 * - подставляет {{BUSINESS_*}} в тело и в строковые поля frontmatter
 *
 * Используется как Server Component'ами (динамический роут /legal/[slug]),
 * так и при сборке sitemap / индекс-страницы /legal.
 */

import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import {legalFrontmatterSchema, type LegalFrontmatter} from "./frontmatter";
import {substituteVars} from "./substitute";

export const LEGAL_CONTENT_DIR = path.join(process.cwd(), "content", "legal");

export interface LegalDocument {
    frontmatter: LegalFrontmatter;
    content: string; // markdown с уже подставленными {{BUSINESS_*}}
    rawContent: string; // markdown без подстановки (для архивов)
}

function substituteFrontmatterStrings<T>(value: T): T {
    if (typeof value === "string") return substituteVars(value) as T;
    if (Array.isArray(value)) return value.map(substituteFrontmatterStrings) as T;
    if (value !== null && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = substituteFrontmatterStrings(v);
        }
        return out as T;
    }
    return value;
}

export async function loadLegalDocument(slug: string): Promise<LegalDocument> {
    const filePath = path.join(LEGAL_CONTENT_DIR, `${slug}.md`);

    let raw: string;
    try {
        raw = await fs.readFile(filePath, "utf8");
    } catch (err) {
        throw new Error(`Legal document not found: ${slug} (${filePath})`, {cause: err});
    }

    const parsed = matter(raw);
    const frontmatterResult = legalFrontmatterSchema.safeParse(parsed.data);

    if (!frontmatterResult.success) {
        throw new Error(
            `Invalid frontmatter in ${slug}.md:\n${JSON.stringify(frontmatterResult.error.issues, null, 2)}`,
        );
    }

    const frontmatter = substituteFrontmatterStrings(frontmatterResult.data);
    const content = substituteVars(parsed.content);

    if (frontmatter.slug !== slug) {
        throw new Error(
            `Slug mismatch in ${slug}.md: frontmatter.slug = "${frontmatter.slug}", filename = "${slug}"`,
        );
    }

    return {frontmatter, content, rawContent: parsed.content};
}

export async function listLegalSlugs(): Promise<string[]> {
    const entries = await fs.readdir(LEGAL_CONTENT_DIR, {withFileTypes: true});
    return entries
        .filter((e) => e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("_"))
        .map((e) => e.name.replace(/\.md$/, ""));
}
