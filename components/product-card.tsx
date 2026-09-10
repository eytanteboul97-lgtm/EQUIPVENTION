import Link from "next/link";
import type { Product } from "@/lib/products";
import { ProductIcon } from "@/components/product-icon";
import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const result = calculateSubsidy(product.priceHT);

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-paper-raised shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        <ProductIcon icon={product.icon} />
        <span className="absolute left-3 top-3 rounded-full bg-paper-raised/90 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wide text-ink-faint">
          Exemple — sourcing en cours
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-base font-semibold text-ink group-hover:text-navy">
          {product.name}
        </h3>
        <p className="text-sm text-ink-soft">{product.blurb}</p>
        <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
          <div>
            <div className="font-mono text-xs text-ink-faint">{formatEUR(product.priceHT)} HT</div>
            {result.eligible ? (
              <div className="font-mono text-sm font-semibold text-green">
                Reste potentiel {formatEUR(result.remainingCostHT)}
              </div>
            ) : (
              <div className="font-mono text-xs text-navy">Seuil non atteint seul</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
