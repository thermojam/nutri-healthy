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

export function getLegalIcon(name: string | undefined): LucideIcon {
    if (!name) return FileText;
    return ICON_MAP[name] ?? FileText;
}
