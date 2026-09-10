import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductIcon } from "@/components/product-icon";
import { SubsidyCard } from "@/components/subsidy-card";
import { LinkButton } from "@/components/ui/button";
import { EXAMPLE_PRODUCTS, getProductBySlug, RISK_CATEGORIES } from "@/lib/products";

export function generateStaticParams() {
  return EXAMPLE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — EQUIPVENTION`,
    description: product.blurb,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = RISK_CATEGORIES.find((c) => c.id === product.category);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <span className="rounded-full bg-navy-soft px-3 py-1 font-mono text-xs uppercase tracking-wide text-navy">
          Exemple — sourcing en cours
        </span>

        <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <ProductIcon icon={product.icon} className="h-72 w-full" />
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
              {category?.label}
            </span>
            <h1 className="mt-2 text-balance font-display text-3xl font-bold text-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-ink-soft">{product.blurb}</p>

            <div className="mt-6">
              <SubsidyCard amountHT={product.priceHT} compact />
            </div>

            <LinkButton href="/simulateur" className="mt-4 w-full justify-center" size="lg">
              Vérifier mon éligibilité
            </LinkButton>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-faint">
              Caractéristiques
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {product.features.map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-faint">
              Professions concernées
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {product.professions.map((p) => (
                <li key={p}>— {p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-faint">
              Conformité &amp; documents
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              Référence en cours de vérification contre le cahier des charges
              technique publié sur ameli.fr. Attestation fournisseur générée
              automatiquement à la commande une fois la conformité validée.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
