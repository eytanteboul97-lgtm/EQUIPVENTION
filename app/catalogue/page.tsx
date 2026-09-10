import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { RISK_CATEGORIES, getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catalogue par risque — EQUIPVENTION",
  description: "Équipements professionnels organisés par risque : TMS/ergonomie, manutention, chutes, chimique, EPI.",
};

export default function CataloguePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">Catalogue</span>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-3xl font-bold text-ink md:text-4xl">
          Un équipement classé par risque, pas par rayon
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Catalogue en cours de constitution : chaque référence est notée puis
          vérifiée contre le cahier des charges technique Ameli avant mise en
          ligne réelle. Les fiches ci-dessous sont des exemples de structure.
        </p>

        <div className="mt-14 flex flex-col gap-16">
          {RISK_CATEGORIES.map((cat) => {
            const products = getProductsByCategory(cat.id);
            return (
              <div key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-baseline justify-between border-b border-line pb-3">
                  <h2 className="font-display text-xl font-bold text-ink">{cat.label}</h2>
                  <span className="font-mono text-xs text-ink-faint">{cat.description}</span>
                </div>
                {products.length > 0 ? (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-ink-faint">
                    Catégorie en cours de sourcing — aucune référence exemple pour l&apos;instant.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
