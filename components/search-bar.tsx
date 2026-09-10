"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { EXAMPLE_PRODUCTS } from "@/lib/products";

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return EXAMPLE_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  return (
    <div className={"relative " + (className ?? "")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (matches[0]) router.push(`/produits/${matches[0].slug}`);
        }}
        className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2"
      >
        <Search className="h-4 w-4 shrink-0 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Quel équipement recherchez-vous ?"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </form>
      {focused && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-card">
          {matches.map((p) => (
            <Link
              key={p.slug}
              href={`/produits/${p.slug}`}
              className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-paper hover:text-ink"
            >
              {p.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
