import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Simulator } from "@/components/simulator";

export const metadata: Metadata = {
  title: "Simulateur d'éligibilité — EQUIPVENTION",
  description: "Estimez en 30 secondes l'aide potentielle sur votre projet d'équipement professionnel.",
};

export default function SimulateurPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <Suspense fallback={null}>
          <Simulator />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
