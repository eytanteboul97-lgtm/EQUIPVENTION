import Link from "next/link";
import type { Product } from "@/lib/products";
import { ProductIcon } from "@/components/product-icon";
import { ProductPrice } from "@/components/product-price";
import { FundingBadge } from "@/components/funding-badge";
import { calculateSubsidy } from "@/lib/subventions";

export function ProductCard({ product }: { product: Product }) {
  const simulatorHref = `/simulateur?montant=${product.priceHT}&categorie=${product.category}&produit=${encodeURIComponent(product.name)}`;
  const eligibleAlone = calculateSubsidy(product.priceHT).eligible;

  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-line bg-paper-raised shadow-card transition-shadow hover:shadow-lg">
      <Link href={`/produits/${product.slug}`} className="group relative block">
        <ProductIcon icon={product.icon} />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {eligibleAlone && <FundingBadge variant="eligible" />}
          <span className="rounded-full bg-paper-raised/90 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wide text-ink-faint">
            Exemple — sourcing en cours
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-display text-base font-semibold text-ink hover:text-navy">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-ink-soft">{product.blurb}</p>

        <div className="mt-auto pt-2">
          <ProductPrice amountHT={product.priceHT} compact />
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Link
            href={`/produits/${product.slug}`}
            className="rounded-full bg-navy py-2.5 text-center font-display text-sm font-semibold text-white hover:bg-navy-deep"
          >
            Voir le produit
          </Link>
          <Link
            href={simulatorHref}
            className="text-center font-mono text-xs text-ink-faint hover:text-navy"
          >
            Calculer mon reste à charge →
          </Link>
        </div>
      </div>
    </div>
  );
}
