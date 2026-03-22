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

export default function Home() {
    return (
        <>
            <Header/>

            <main className="flex-1">
                <HeroSection/>
                <AboutSection/>
                <EducationSection/>
                <ProductsSection/>
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
