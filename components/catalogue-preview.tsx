import { RISK_CATEGORIES, getProductsByCategory } from "@/lib/products";
import { CategoryCard } from "@/components/category-card";
import { CATEGORY_ICONS } from "@/components/category-icons";

export function CataloguePreview() {
  return (
    <section className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">Catégories</span>
        <h2 className="mt-3 max-w-xl text-balance font-display text-3xl font-bold text-ink">
          Un équipement classé par risque, pas par rayon
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {RISK_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              icon={CATEGORY_ICONS[cat.id]}
              label={cat.label}
              description={cat.description}
              count={getProductsByCategory(cat.id).length}
              href={`/catalogue?categorie=${cat.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
