import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPopularProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export function PopularProducts() {
  const products = getPopularProducts();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
            Boutique
          </span>
          <h2 className="mt-3 max-w-xl text-balance font-display text-3xl font-bold text-ink">
            Nos équipements les plus demandés
          </h2>
        </div>
        <Link
          href="/catalogue"
          className="flex items-center gap-2 font-display text-sm font-semibold text-navy hover:underline"
        >
          Tout le catalogue <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
