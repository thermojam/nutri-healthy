import {Children, isValidElement, type ReactNode} from "react";
import Link from "next/link";
import ReactMarkdown, {type Components} from "react-markdown";
import remarkGfm from "remark-gfm";

import {Callout, detectCalloutVariant} from "./markdown-callout";

interface LegalMarkdownProps {
    content: string;
}

function extractFirstText(node: ReactNode): string {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) {
        for (const child of node) {
            const text = extractFirstText(child);
            if (text) return text;
        }
        return "";
    }
    if (isValidElement<{children?: ReactNode}>(node)) {
        return extractFirstText(node.props.children);
    }
    return "";
}

function stripCalloutMarkerFromTree(node: ReactNode, markerLength: number): ReactNode {
    if (markerLength <= 0) return node;
    if (typeof node === "string") return node.slice(markerLength);
    if (Array.isArray(node)) {
        const out: ReactNode[] = [];
        let remaining = markerLength;
        for (const child of node) {
            if (remaining <= 0) {
                out.push(child);
                continue;
            }
            if (typeof child === "string") {
                if (child.length >= remaining) {
                    out.push(child.slice(remaining));
                    remaining = 0;
                } else {
                    remaining -= child.length;
                }
            } else {
                out.push(child);
            }
        }
        return out;
    }
    return node;
}

const components: Components = {
    a: ({href, children, ...rest}) => {
        const url = href ?? "";
        const isInternal = url.startsWith("/") && !url.startsWith("//");
        if (isInternal) {
            return (
                <Link href={url} className="text-primary underline-offset-4 hover:underline">
                    {children}
                </Link>
            );
        }
        const isExternal = /^https?:\/\//i.test(url);
        return (
            <a
                href={url}
                {...(isExternal ? {target: "_blank", rel: "noopener noreferrer"} : {})}
                className="text-primary underline-offset-4 hover:underline"
                {...rest}
            >
                {children}
            </a>
        );
    },
    blockquote: ({children}) => {
        const childrenArray = Children.toArray(children).filter(
            (c) => !(typeof c === "string" && c.trim() === ""),
        );
        const firstChild = childrenArray[0];
        const firstText = extractFirstText(firstChild);
        const detected = detectCalloutVariant(firstText);

        if (!detected) {
            return (
                <blockquote className="border-l-4 border-border bg-muted/30 px-4 py-3 text-muted-foreground italic">
                    {children}
                </blockquote>
            );
        }

        const markerLength = firstText.length - detected.rest.length;
        const cleanedFirst = stripCalloutMarkerFromTree(firstChild, markerLength);
        const remainingChildren = [cleanedFirst, ...childrenArray.slice(1)];

        return <Callout variant={detected.variant}>{remainingChildren}</Callout>;
    },
    h2: ({children, ...rest}) => (
        <h2
            className="mt-12 mb-6 border-t border-border pt-8 text-xl sm:text-2xl font-bold text-foreground"
            {...rest}
        >
            {children}
        </h2>
    ),
    h3: ({children, ...rest}) => (
        <h3 className="mt-8 mb-4 text-lg font-semibold text-foreground" {...rest}>
            {children}
        </h3>
    ),
    h4: ({children, ...rest}) => (
        <h4 className="mt-6 mb-3 text-base font-semibold text-foreground" {...rest}>
            {children}
        </h4>
    ),
    p: ({children, ...rest}) => (
        <p className="my-4 leading-relaxed text-muted-foreground" {...rest}>
            {children}
        </p>
    ),
    ul: ({children, ...rest}) => (
        <ul className="my-5 list-disc pl-6 space-y-2 text-muted-foreground marker:text-primary" {...rest}>
            {children}
        </ul>
    ),
    ol: ({children, ...rest}) => (
        <ol className="my-5 list-decimal pl-6 space-y-2 text-muted-foreground marker:text-primary" {...rest}>
            {children}
        </ol>
    ),
    li: ({children, ...rest}) => (
        <li className="leading-relaxed" {...rest}>
            {children}
        </li>
    ),
    strong: ({children, ...rest}) => (
        <strong className="font-semibold text-foreground" {...rest}>
            {children}
        </strong>
    ),
    code: ({children, ...rest}) => (
        <code
            className="rounded bg-primary/10 px-1.5 py-0.5 text-sm text-primary font-mono"
            {...rest}
        >
            {children}
        </code>
    ),
    table: ({children, ...rest}) => (
        <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm" {...rest}>
                {children}
            </table>
        </div>
    ),
    th: ({children, ...rest}) => (
        <th className="border border-border bg-muted/50 px-3 py-2 text-left font-semibold" {...rest}>
            {children}
        </th>
    ),
    td: ({children, ...rest}) => (
        <td className="border border-border px-3 py-2 align-top text-muted-foreground" {...rest}>
            {children}
        </td>
    ),
    hr: () => <hr className="my-10 border-border"/>,
};

export function LegalMarkdown({content}: LegalMarkdownProps) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
        </ReactMarkdown>
    );
}
