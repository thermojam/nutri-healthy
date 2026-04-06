import {notFound} from "next/navigation";
import ServicePageClient from "./ServicePageClient";
import {serviceRepository} from "@/lib/db/repositories/service.repository";

interface Service {
    _id: string;
    slug: string;
    title: string;
    description: string;
    fullDescription: string;
    category: string;
    icon?: string;
    image?: { url: string; alt: string };
    pricing: {
        base: number;
        premium: number;
        vip: number;
    };
    features: {
        base: string[];
        premium: string[];
        vip: string[];
    };
    duration: {
        base: number;
        premium: number;
        vip: number;
    };
    format: string[];
    popular?: boolean;
}

async function getService(slug: string): Promise<Service | null> {
    try {
        const service = await serviceRepository.findBySlug(slug);
        if (!service) return null;
        return JSON.parse(JSON.stringify(service));
    } catch (error) {
        console.error("Failed to fetch service:", error);
        return null;
    }
}

export default async function ServicePage({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const service = await getService(slug);

    if (!service) {
        notFound();
    }

    return <ServicePageClient service={service}/>;
}
