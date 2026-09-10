import Link from "next/link";
import { RISK_CATEGORIES, getProductsByCategory } from "@/lib/products";
import { ArrowRight } from "lucide-react";

export function CataloguePreview() {
  return (
    <section className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
          Catalogue
        </span>
        <h2 className="mt-3 max-w-xl text-balance font-display text-3xl font-bold text-ink">
          Un catalogue organisé par risque, pas par produit
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {RISK_CATEGORIES.map((cat) => {
            const count = getProductsByCategory(cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/catalogue#${cat.id}`}
                className="flex flex-col justify-between rounded-card border border-line bg-paper p-5 transition-colors hover:border-navy"
              >
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink">{cat.label}</h3>
                  <p className="mt-2 text-xs text-ink-soft">{cat.description}</p>
                </div>
                <div className="mt-4 font-mono text-[0.7rem] text-ink-faint">
                  {count > 0 ? `${count} référence${count > 1 ? "s" : ""} exemple` : "En cours de sourcing"}
                </div>
              </Link>
            );
          })}
        </div>
        <Link
          href="/catalogue"
          className="mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold text-navy hover:underline"
        >
          Voir tout le catalogue <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
