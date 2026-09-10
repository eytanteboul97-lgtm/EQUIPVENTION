"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  EXAMPLE_PRODUCTS,
  RISK_CATEGORIES,
  getAllProfessions,
  type RiskCategory,
} from "@/lib/products";
import { calculateSubsidy } from "@/lib/subventions";
import { ProductCard } from "@/components/product-card";

type PriceRange = "all" | "0-500" | "500-1000" | "1000+";
type SortKey = "popular" | "price-asc" | "best-aide" | "lowest-remaining";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Les plus populaires" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "best-aide", label: "Meilleure aide potentielle" },
  { value: "lowest-remaining", label: "Reste à charge le plus faible" },
];

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: "all", label: "Tous les prix" },
  { value: "0-500", label: "Moins de 500 €" },
  { value: "500-1000", label: "500 € – 1 000 €" },
  { value: "1000+", label: "Plus de 1 000 €" },
];

function inRange(price: number, range: PriceRange) {
  if (range === "all") return true;
  if (range === "0-500") return price < 500;
  if (range === "500-1000") return price >= 500 && price <= 1000;
  return price > 1000;
}

export function CatalogueBrowser() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("categorie") as RiskCategory | null) ?? "all";

  const [category, setCategory] = useState<RiskCategory | "all">(initialCategory);
  const [profession, setProfession] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sort, setSort] = useState<SortKey>("popular");

  const professions = useMemo(getAllProfessions, []);

  const products = useMemo(() => {
    let list = EXAMPLE_PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (profession !== "all" && !p.professions.includes(profession)) return false;
      if (!inRange(p.priceHT, priceRange)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.priceHT - b.priceHT;
      if (sort === "best-aide") {
        return calculateSubsidy(b.priceHT).subsidyEstimate - calculateSubsidy(a.priceHT).subsidyEstimate;
      }
      if (sort === "lowest-remaining") {
        return calculateSubsidy(a.priceHT).remainingCostHT - calculateSubsidy(b.priceHT).remainingCostHT;
      }
      // popular
      return Number(b.popular ?? false) - Number(a.popular ?? false);
    });

    return list;
  }, [category, profession, priceRange, sort]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={
            "rounded-full border px-4 py-2 font-mono text-xs transition-colors " +
            (category === "all" ? "border-navy bg-navy text-white" : "border-line text-ink-soft hover:border-navy/40")
          }
        >
          Toutes catégories
        </button>
        {RISK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={
              "rounded-full border px-4 py-2 font-mono text-xs transition-colors " +
              (category === cat.id ? "border-navy bg-navy text-white" : "border-line text-ink-soft hover:border-navy/40")
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="rounded-full border border-line bg-paper-raised px-4 py-2 font-mono text-xs text-ink"
        >
          <option value="all">Tous secteurs</option>
          {professions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value as PriceRange)}
          className="rounded-full border border-line bg-paper-raised px-4 py-2 font-mono text-xs text-ink"
        >
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="ml-auto rounded-full border border-line bg-paper-raised px-4 py-2 font-mono text-xs text-ink"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {products.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-ink-faint">
          Aucun équipement ne correspond à ces filtres pour l&apos;instant — le catalogue est encore en cours de constitution.
        </p>
      )}
    </div>
  );
}
