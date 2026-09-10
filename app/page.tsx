import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { PopularProducts } from "@/components/popular-products";
import { CataloguePreview } from "@/components/catalogue-preview";
import { FinancialExample } from "@/components/financial-example";
import { HowItWorks } from "@/components/how-it-works";
import { TrustBadges } from "@/components/trust-badges";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PopularProducts />
        <CataloguePreview />
        <FinancialExample />
        <HowItWorks />
        <TrustBadges />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
