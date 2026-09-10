import type { Metadata } from "next";
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
      <main className="mx-auto max-w-5xl px-5 py-16">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
          Simulateur d&apos;éligibilité
        </span>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-3xl font-bold text-ink md:text-4xl">
          Estimez votre aide potentielle en 30 secondes
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Résultat indicatif calculé à partir du taux et du seuil en vigueur.
          L&apos;attribution réelle dépend de l&apos;éligibilité de votre
          entreprise et de l&apos;acceptation du dossier par l&apos;organisme
          compétent.
        </p>
        <div className="mt-10">
          <Simulator />
        </div>
      </main>
      <Footer />
    </>
  );
}
