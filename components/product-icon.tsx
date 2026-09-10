import { Weight, Armchair, Wrench, ShoppingCart, CircleDot, Boxes } from "lucide-react";
import type { Product } from "@/lib/products";

const ICONS: Record<Product["icon"], React.ComponentType<{ className?: string }>> = {
  weight: Weight,
  armchair: Armchair,
  grinder: Wrench,
  cart: ShoppingCart,
  tire: CircleDot,
  toolkit: Boxes,
};

export function ProductIcon({ icon, className }: { icon: Product["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return (
    <div
      className={
        "flex items-center justify-center rounded-card bg-gradient-to-br from-navy to-navy-deep " +
        (className ?? "h-40 w-full")
      }
    >
      <Icon className="h-12 w-12 text-green-bright" />
    </div>
  );
}
