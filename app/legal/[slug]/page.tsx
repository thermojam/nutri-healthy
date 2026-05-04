import type {Metadata} from "next";
import {notFound} from "next/navigation";

import LegalPageLayout from "@/components/legal/legal-page-layout";
import {getLegalIcon} from "@/components/legal/icon-map";
import {LegalMarkdown} from "@/components/legal/markdown-renderer";
import {listLegalSlugs, loadLegalDocument} from "@/lib/legal/loader";

interface PageParams {
    params: Promise<{slug: string}>;
}

export async function generateStaticParams() {
    const slugs = await listLegalSlugs();
    return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageParams): Promise<Metadata> {
    const {slug} = await params;
    try {
        const doc = await loadLegalDocument(slug);
        return {
            title: doc.frontmatter.seoTitle ?? doc.frontmatter.title,
            description: doc.frontmatter.seoDescription ?? doc.frontmatter.description,
            robots: {index: true, follow: true},
        };
    } catch {
        return {title: "Документ не найден"};
    }
}

export const dynamicParams = false;

export default async function LegalDocumentPage({params}: PageParams) {
    const {slug} = await params;

    let doc;
    try {
        doc = await loadLegalDocument(slug);
    } catch {
        notFound();
    }

    const Icon = getLegalIcon(doc.frontmatter.icon);

    return (
        <LegalPageLayout
            title={doc.frontmatter.title}
            description={doc.frontmatter.description}
            version={doc.frontmatter.version}
            icon={<Icon className="h-6 w-6 sm:h-7 sm:w-7"/>}
            lastUpdated={new Date(doc.frontmatter.lastUpdated)}
            effectiveDate={new Date(doc.frontmatter.effectiveDate)}
        >
            <LegalMarkdown content={doc.content}/>
        </LegalPageLayout>
    );
}
