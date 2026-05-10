import {
    Briefcase,
    Clock,
    Cookie,
    FileText,
    Globe,
    HeartPulse,
    Mail,
    Percent,
    Scale,
    Shield,
    UserCheck,
    type LucideIcon,
} from "lucide-react";

/**
 * Маппинг строкового icon из frontmatter в компонент lucide-react.
 * Расширяй здесь при добавлении новых иконок в .md.
 */
const ICON_MAP: Record<string, LucideIcon> = {
    "file-text": FileText,
    shield: Shield,
    "user-check": UserCheck,
    mail: Mail,
    percent: Percent,
    clock: Clock,
    cookie: Cookie,
    globe: Globe,
    "heart-pulse": HeartPulse,
    briefcase: Briefcase,
    scale: Scale,
};

/**
 * Дефолт иконка по slug документа если icon не задан
 */
const SLUG_ICON_MAP: Record<string, LucideIcon> = {
    contract: Briefcase,
    "privacy-policy": Shield,
    "personal-data-consent": UserCheck,
    "marketing-consent": Mail,
    "delivery-terms": Clock,
    "return-policy": Percent,
};

export function getLegalIcon(name: string | undefined, slug?: string): LucideIcon {
    if (name) return ICON_MAP[name] ?? FileText;
    if (slug) return SLUG_ICON_MAP[slug] ?? Scale;
    return FileText;
}
