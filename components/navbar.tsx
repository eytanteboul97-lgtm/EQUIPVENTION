"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { QuoteCTA } from "@/components/quote-cta";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/catalogue", label: "Produits" },
  { href: "/aides", label: "Aides" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
];

export function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
        <Link href="/" aria-label="EQUIPVENTION — accueil" className="shrink-0">
          <Logo />
        </Link>

        <SearchBar className="hidden max-w-xs flex-1 lg:block" />

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap font-display text-sm font-medium text-ink-soft hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <Link
            href="/panier"
            aria-label="Panier"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-navy/40"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green text-[0.6rem] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <QuoteCTA variant="primary" className="hidden px-5 py-2.5 text-sm sm:inline-flex">
            Demander un devis
          </QuoteCTA>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-paper px-5 py-5 md:hidden">
          <SearchBar className="mb-5" />
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2.5 font-display text-sm font-medium text-ink hover:bg-paper-raised"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <QuoteCTA variant="primary" className="mt-4 w-full sm:hidden">
            Demander un devis
          </QuoteCTA>
        </div>
      )}
    </header>
  );
}
