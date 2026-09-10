import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductIcon } from "@/components/product-icon";
import { ProductPrice } from "@/components/product-price";
import { MiniSimulator } from "@/components/mini-simulator";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { QuoteCTA } from "@/components/quote-cta";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { ProductCard } from "@/components/product-card";
import { EXAMPLE_PRODUCTS, getProductBySlug, getRelatedProducts, RISK_CATEGORIES } from "@/lib/products";

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
  const related = getRelatedProducts(product);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-16 pb-28 md:pb-16">
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

            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-ink-faint">
              <div><dt className="inline text-ink-soft">Disponibilité — </dt><dd className="inline">{product.availability}</dd></div>
              <div><dt className="inline text-ink-soft">Livraison estimée — </dt><dd className="inline">{product.deliveryEstimate}</dd></div>
            </dl>

            <div className="mt-6">
              <ProductPrice amountHT={product.priceHT} />
            </div>

            <div className="mt-4 hidden flex-col gap-3 md:flex">
              {product.sellMode === "panier" ? (
                <AddToCartButton slug={product.slug} className="w-full" />
              ) : (
                <QuoteCTA productName={product.name} className="w-full">
                  Demander un devis
                </QuoteCTA>
              )}
              <Link
                href={`/simulateur?montant=${product.priceHT}&categorie=${product.category}&produit=${encodeURIComponent(product.name)}`}
                className="rounded-full border border-line py-3.5 text-center font-display font-semibold text-ink hover:border-navy/40"
              >
                Calculer mon reste à charge
              </Link>
            </div>

            <p className="mt-4 text-sm text-ink-faint">
              Une question ?{" "}
              <QuoteCTA productName={product.name} variant="link" className="font-normal">
                Parlez à un conseiller
              </QuoteCTA>
            </p>
          </div>
        </div>

        <div className="mt-10">
          <MiniSimulator amountHT={product.priceHT} />
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

        {related.length > 0 && (
          <div className="mt-16 border-t border-line pt-12">
            <h2 className="font-display text-xl font-bold text-ink">
              Vous pourriez aussi avoir besoin de
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <StickyMobileCta product={product} />
      <Footer />
    </>
  );
}
