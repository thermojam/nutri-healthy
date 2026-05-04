import type {ReactNode} from "react";
import {AlertTriangle, FileText, Info, Mail} from "lucide-react";

import {cn} from "@/lib/utils";

export type CalloutVariant = "important" | "warning" | "example" | "contact";

const VARIANT_STYLES: Record<CalloutVariant, string> = {
    important: "bg-primary/5 border-l-4 border-primary",
    warning: "bg-accent/5 border-l-4 border-accent",
    example: "bg-card border border-border rounded-xl",
    contact: "bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-primary/20 rounded-xl",
};

const VARIANT_ICONS: Record<CalloutVariant, ReactNode> = {
    important: <Info className="h-4 w-4 text-primary"/>,
    warning: <AlertTriangle className="h-4 w-4 text-accent"/>,
    example: <FileText className="h-4 w-4 text-muted-foreground"/>,
    contact: <Mail className="h-4 w-4 text-primary"/>,
};

const VARIANT_LABELS: Record<CalloutVariant, string> = {
    important: "Важно",
    warning: "Внимание",
    example: "Пример",
    contact: "Контакты",
};

interface CalloutProps {
    variant: CalloutVariant;
    children: ReactNode;
}

export function Callout({variant, children}: CalloutProps) {
    return (
        <aside
            className={cn(
                "not-prose my-6 p-4 sm:p-5",
                variant === "important" || variant === "warning" ? "" : "",
                VARIANT_STYLES[variant],
            )}
            data-callout={variant}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background/80 border border-border">
                    {VARIANT_ICONS[variant]}
                </div>
                <div className="flex-1 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                        {VARIANT_LABELS[variant]}
                    </p>
                    <div className="space-y-2 [&>p:last-child]:mb-0 [&>p]:my-0">{children}</div>
                </div>
            </div>
        </aside>
    );
}

const CALLOUT_MARKER_RE = /^\s*\[!(IMPORTANT|WARNING|EXAMPLE|CONTACT|NOTE|TIP|CAUTION)\]\s*/i;

export function detectCalloutVariant(firstText: string): {variant: CalloutVariant; rest: string} | null {
    const match = firstText.match(CALLOUT_MARKER_RE);
    if (!match) return null;

    const marker = match[1].toUpperCase();
    const rest = firstText.slice(match[0].length);

    let variant: CalloutVariant;
    switch (marker) {
        case "IMPORTANT":
        case "NOTE":
            variant = "important";
            break;
        case "WARNING":
        case "CAUTION":
            variant = "warning";
            break;
        case "EXAMPLE":
        case "TIP":
            variant = "example";
            break;
        case "CONTACT":
            variant = "contact";
            break;
        default:
            variant = "important";
    }

    return {variant, rest};
}
