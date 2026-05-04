import {cache} from "react";
import {Suspense} from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import FAQSection from "@/components/sections/faq-section";
import ContactSection from "@/components/sections/contact-section";
import {serviceRepository} from "@/lib/db/repositories/service.repository";
import {caseRepository} from "@/lib/db/repositories/case.repository";
import {Skeleton, CasesCarouselSkeleton} from "@/components/ui/skeleton";
import {ProductsSection} from "@/components/sections/products-section";
import {MaterialsSection} from "@/components/sections/materials-section";
import {CasesSection} from "@/components/sections/cases-section";

// Кэшируем запросы в рамках одного request
const getServices = cache(async () => {
    try {
        const services = await serviceRepository.findAll();
        // Преобразуем mongoose документы в обычные объекты
        return services.map(s => s.toJSON());
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return [];
    }
});

const getCases = cache(async () => {
    try {
        const cases = await caseRepository.findAll();
        return cases.map(c => c.toJSON());
    } catch (error) {
        console.error("Failed to fetch cases:", error);
        return [];
    }
});

// Wrapper компоненты для Suspense
async function ProductsSectionWrapper() {
    const services = await getServices();
    return <ProductsSection services={services}/>;
}

async function CasesSectionWrapper() {
    const cases = await getCases();
    return <CasesSection cases={cases}/>;
}

// Skeletons
function ProductsSectionSkeleton() {
    return (
        <section className="py-16 sm:py-24" id="services">
            <div className="container px-3 sm:px-4 md:px-6">
                <div className="text-center mb-8 sm:mb-12">
                    <Skeleton className="h-8 w-20 mx-auto mb-3 rounded-full" />
                    <Skeleton className="h-10 sm:h-12 w-72 mx-auto mb-4 rounded-lg" />
                    <Skeleton className="h-5 w-full max-w-3xl mx-auto rounded-lg" />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="px-5 py-2 rounded-full border border-border bg-muted h-10 w-24 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4 p-4 sm:p-6 border border-border rounded-lg bg-gradient-to-br from-background to-muted/20">
                            <Skeleton className="h-6 w-3/4 rounded-lg" />
                            <Skeleton className="h-4 w-full rounded-lg" />
                            <Skeleton className="h-4 w-full rounded-lg" />
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-8 w-full rounded-lg" />
                                <Skeleton className="h-8 w-full rounded-lg" />
                                <Skeleton className="h-8 w-full rounded-lg" />
                            </div>
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CasesSectionSkeleton() {
    return (
        <section id="cases" className="py-16 sm:py-24 bg-card">
            <div className="container px-3 sm:px-4 md:px-6">
                <div className="text-center mb-8 sm:mb-12">
                    <Skeleton className="h-8 w-20 mx-auto mb-3 rounded-full" />
                    <Skeleton className="h-10 sm:h-12 w-64 mx-auto mb-4 rounded-lg" />
                    <Skeleton className="h-5 w-96 mx-auto rounded-lg" />
                </div>
                <CasesCarouselSkeleton count={1} />
            </div>
        </section>
    );
}


export default async function Home() {
    return (
        <>
            <Header/>

            <main className="flex-1">
                <HeroSection/>
                <AboutSection/>

                {/* Suspense boundaries для потоковой загрузки */}
                <Suspense fallback={<ProductsSectionSkeleton/>}>
                    <ProductsSectionWrapper/>
                </Suspense>

                <Suspense fallback={<CasesSectionSkeleton/>}>
                    <CasesSectionWrapper/>
                </Suspense>

                <MaterialsSection/>
                <FAQSection/>
                <ContactSection/>
            </main>

            <Footer/>
        </>
    );
}
