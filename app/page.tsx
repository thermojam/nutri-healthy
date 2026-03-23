import {cache} from "react";
import {Suspense} from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import EducationSection from "@/components/sections/education-section";
import FAQSection from "@/components/sections/faq-section";
import ContactSection from "@/components/sections/contact-section";
import {serviceRepository} from "@/lib/db/repositories/service.repository";
import {caseRepository} from "@/lib/db/repositories/case.repository";
import {testimonialRepository} from "@/lib/db/repositories/testimonial.repository";
import {Skeleton} from "@/components/ui/skeleton";
import {ProductsSection} from "@/components/sections/products-section";
import {MaterialsSection} from "@/components/sections/materials-section";
import {TestimonialsSection} from "@/components/sections/testimonials-section";
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

const getTestimonials = cache(async () => {
    try {
        const testimonials = await testimonialRepository.findAll();
        return testimonials.map(t => t.toJSON());
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
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

async function TestimonialsSectionWrapper() {
    const testimonials = await getTestimonials();
    return <TestimonialsSection testimonials={testimonials}/>;
}

// Skeletons
function ProductsSectionSkeleton() {
    return (
        <section className="py-16 md:py-24" id="services">
            <div className="container">
                <Skeleton className="h-12 w-64 mx-auto mb-12"/>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-2xl"/>
                            <Skeleton className="h-6 w-3/4"/>
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-10 w-32"/>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CasesSectionSkeleton() {
    return (
        <section id="cases" className="py-24 bg-card">
            <div className="container">
                <Skeleton className="h-10 w-64 mx-auto mb-4"/>
                <Skeleton className="h-5 w-96 mx-auto mb-12"/>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl"/>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSectionSkeleton() {
    return (
        <section id="reviews" className="py-24">
            <div className="container">
                <Skeleton className="h-10 w-64 mx-auto mb-4"/>
                <Skeleton className="h-5 w-96 mx-auto mb-12"/>
                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-2xl"/>
                    ))}
                </div>
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
                <EducationSection/>
                
                {/* Suspense boundaries для потоковой загрузки */}
                <Suspense fallback={<ProductsSectionSkeleton/>}>
                    <ProductsSectionWrapper/>
                </Suspense>
                
                <Suspense fallback={<CasesSectionSkeleton/>}>
                    <CasesSectionWrapper/>
                </Suspense>
                
                <MaterialsSection/>
                
                <Suspense fallback={<TestimonialsSectionSkeleton/>}>
                    <TestimonialsSectionWrapper/>
                </Suspense>
                
                <FAQSection/>
                <ContactSection/>
            </main>

            <Footer/>
        </>
    );
}
