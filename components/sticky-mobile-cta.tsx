"use client";

import { useCart } from "@/lib/cart-context";
import { QuoteCTA } from "@/components/quote-cta";
import type { Product } from "@/lib/products";

/** Barre d'action fixée en bas d'écran sur mobile — reste accessible pendant le scroll de la fiche produit. */
export function StickyMobileCta({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper-raised p-3 shadow-card md:hidden">
      {product.sellMode === "panier" ? (
        <button
          onClick={() => addItem(product.slug)}
          className="w-full rounded-full bg-navy py-3.5 text-center font-display font-semibold text-white"
        >
          Ajouter au panier
        </button>
      ) : (
        <QuoteCTA productName={product.name} className="w-full">
          Demander un devis
        </QuoteCTA>
      )}
    </div>
  );
}
