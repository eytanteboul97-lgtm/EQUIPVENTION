import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { CatalogueBrowser } from "@/components/catalogue-browser";

export const metadata: Metadata = {
  title: "Équipements professionnels — EQUIPVENTION",
  description: "Catalogue d'équipements professionnels : prix HT, aide potentielle et reste à charge estimé sur chaque produit.",
};

export default function CataloguePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">Catalogue</span>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-3xl font-bold text-ink md:text-4xl">
          Nos équipements professionnels
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Catalogue en cours de constitution : chaque référence est notée puis
          vérifiée contre le cahier des charges technique Ameli avant mise en
          ligne réelle. Les fiches ci-dessous sont des exemples de structure.
        </p>
        <SearchBar className="mt-6 max-w-md" />

        <div className="mt-10">
          <Suspense fallback={null}>
            <CatalogueBrowser />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
