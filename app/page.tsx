import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import EducationSection from "@/components/sections/education-section";
import ProductsSection from "@/components/sections/products-section";
import CasesSection from "@/components/sections/cases-section";
import MaterialsSection from "@/components/sections/materials-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import FAQSection from "@/components/sections/faq-section";
import ContactSection from "@/components/sections/contact-section";

async function getServices() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/services`, {
            cache: "no-store",
        });
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return [];
    }
}

export default async function Home() {
    const services = await getServices();

    return (
        <>
            <Header/>

            <main className="flex-1">
                <HeroSection/>
                <AboutSection/>
                <EducationSection/>
                <ProductsSection services={services}/>
                <CasesSection/>
                <MaterialsSection/>
                <TestimonialsSection/>
                <FAQSection/>
                <ContactSection/>
            </main>

            <Footer/>
        </>
    );
}
