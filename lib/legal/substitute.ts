/**
 * Mustache-подобная подстановка переменных в Markdown legal-документах.
 *
 * Шаблон в .md:   `{{BUSINESS_INN}}`, `{{BUSINESS_EMAIL}}`, ...
 * Источник:       объект BUSINESS из ./business.ts (env-переменные)
 *
 * Один проход регуляркой, без зависимостей. Если переменной нет — оставляем
 * шаблон как есть (видно в UI, проще диагностировать пропущенный env).
 */

import {BUSINESS, type BusinessInfo} from "./business";

const BUSINESS_VAR_PREFIX = "BUSINESS_";

function snakeToCamel(snake: string): string {
    return snake
        .toLowerCase()
        .replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

export function substituteVars(input: string, vars: BusinessInfo = BUSINESS): string {
    return input.replace(/\{\{([A-Z][A-Z0-9_]*)\}\}/g, (match, key: string) => {
        if (!key.startsWith(BUSINESS_VAR_PREFIX)) return match;

        const camelKey = snakeToCamel(key.slice(BUSINESS_VAR_PREFIX.length));
        const value = (vars as unknown as Record<string, unknown>)[camelKey];

        if (value === undefined || value === null || value === "") return match;
        return String(value);
    });
}
