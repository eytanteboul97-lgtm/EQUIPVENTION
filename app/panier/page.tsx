"use client";

import Link from "next/link";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductIcon } from "@/components/product-icon";
import { QuoteCTA } from "@/components/quote-cta";
import { useCart, useCartProducts } from "@/lib/cart-context";
import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";

export default function PanierPage() {
  const { setQuantity, removeItem } = useCart();
  const cartProducts = useCartProducts();

  const totalHT = cartProducts.reduce((sum, { item, product }) => sum + product.priceHT * item.quantity, 0);
  const totalResult = calculateSubsidy(totalHT);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">Panier</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">Votre panier</h1>

        {cartProducts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-card border border-line bg-paper-raised p-12 text-center">
            <ShoppingCart className="h-8 w-8 text-ink-faint" />
            <p className="text-ink-soft">Votre panier est vide pour l&apos;instant.</p>
            <Link href="/catalogue" className="font-display font-semibold text-navy hover:underline">
              Voir les équipements
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-4">
              {cartProducts.map(({ item, product }) => (
                <div key={product.slug} className="flex items-center gap-4 rounded-card border border-line bg-paper-raised p-4">
                  <ProductIcon icon={product.icon} className="h-16 w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/produits/${product.slug}`} className="font-display font-semibold text-ink hover:text-navy">
                      {product.name}
                    </Link>
                    <div className="mt-1 font-mono text-xs text-ink-faint">{formatEUR(product.priceHT)} HT / unité</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(product.slug, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink-soft hover:border-navy/40"
                        aria-label="Retirer une unité"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(product.slug, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink-soft hover:border-navy/40"
                        aria-label="Ajouter une unité"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-ink">
                      {formatEUR(product.priceHT * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeItem(product.slug)}
                      className="mt-2 text-ink-faint hover:text-alert"
                      aria-label="Retirer du panier"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-card border border-line bg-paper-raised p-6 shadow-card">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase text-ink-faint">Total HT</span>
                <span className="font-mono font-semibold text-ink">{formatEUR(totalHT)}</span>
              </div>
              {totalResult.eligible && (
                <>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase text-ink-faint">Aide potentielle</span>
                    <span className="font-mono font-semibold text-alert">
                      −{formatEUR(totalResult.subsidyEstimate)}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-line pt-4 text-center">
                    <div className="font-mono text-xs uppercase text-ink-faint">Reste à charge estimé</div>
                    <div className="mt-1 font-display text-3xl font-extrabold text-green">
                      {formatEUR(totalResult.remainingCostHT)}
                    </div>
                  </div>
                </>
              )}
              <QuoteCTA className="mt-6 w-full">Demander un devis groupé</QuoteCTA>
              <p className="mt-3 text-center text-xs text-ink-faint">
                Panier B2B : pas de paiement en ligne, un conseiller finalise votre devis.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
