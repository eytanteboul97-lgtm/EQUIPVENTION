"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export function AddToCartButton({ slug, className }: { slug: string; className?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addItem(slug);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full bg-navy py-3.5 font-display font-semibold text-white transition-colors hover:bg-navy-deep",
        className
      )}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Ajouté au panier
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> Ajouter au panier
        </>
      )}
    </button>
  );
}
