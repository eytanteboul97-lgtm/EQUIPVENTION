# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**EQUIPVENTION** is a French B2B **shop** for professional equipment
(ergonomics/TMS, manual handling, workshop tools) that may qualify for
CARSAT/Ameli occupational-risk-prevention subsidies. As of the V3
repositioning, the site is e-commerce first: the homepage, catalogue and
product pages sell equipment — the subsidy/simulator is the thing that
makes the sale easier, not the reason the site exists.

Central message: **"Vous achetez l'équipement. Nous vous aidons à réduire
votre reste à charge."** — never "come do a simulation." Every product
surface (card, fiche) leads with photo/name/price, then shows aide
potentielle and reste à charge, then the buy/devis action. The full
step-by-step simulator (`/simulateur`) still exists and is used from
product pages (pre-filled, not re-asked), but it's a supporting tool, not
the front door.

Full functional spec: see the "Cahier des charges EQUIPVENTION — V2"
document (Claude artifact, shared with the project owner) for the subsidy
mechanics; the V3 repositioning brief covers the shop-first layout. Key
numbers enforced in code:

- Standard rate **70%**, minimum subsidy **500€**, investment threshold
  **≈715€ HT** (`lib/subventions.ts`).
- **25 000€** = cap on "actions de prévention" (diagnostic + training +
  equipment), 2024–2027 — this is what actually limits equipment purchases.
- **75 000€** = the *global* cap across all investment types for
  companies <200 employees. Never present this as an equipment budget.
- Some extended branch agreements raise the rate to **85%** with higher
  caps for some <200-employee companies — modeled as `BRANCH_OVERRIDES`
  in `lib/subventions.ts`, never hardcoded elsewhere.

**All of the above must be reverified against ameli.fr before each
production deploy** — these amounts change without notice.

## Current phase — read before touching the catalogue

Per the cahier des charges, the product catalogue is **deliberately not
final**. `lib/products.ts` holds placeholder/example products only, used
to build and test the UI. Every product card/fiche carries an "Exemple —
sourcing en cours" badge. Do not present any of them as real inventory,
and do not add real products until they've been scored and checked
against the official Ameli technical spec sheet product by product.

There is still **no backend**: `lib/cart-context.tsx` is a client-only
cart (React context + localStorage), and `QuoteCTA` (`components/quote-cta.tsx`)
is a form that shows a local confirmation state — neither calls a real
API. Don't imply otherwise in copy (no fake "email sent" wording beyond
what's true). When a real backend arrives, it plugs in at exactly these
two seams plus the lead-capture submit in `simulator.tsx`.

## Money/price components — always compose from these, never re-derive

- `lib/subventions.ts` — `calculateSubsidy(amountHT)` is the only place
  the math happens.
- `components/remaining-cost.tsx` — the "reste à charge" number, styled
  bigger than the price on purpose (that's the sales argument, not the
  catalogue price).
- `components/funding-badge.tsx` — short marketing badges ("Jusqu'à
  -70%", "Aide potentielle", "Reste à charge dès X€"). Always
  conditional/possible language, never a guarantee.
- `components/product-price.tsx` — the full 3-line block (Prix HT → Aide
  potentielle → RemainingCost) used on cards and product pages.
- `components/mini-simulator.tsx` — inline, no-navigation effectif picker
  embedded on the product page (price is already known).

If a new surface needs to show a price/aide/reste-à-charge, reuse one of
these — never write a new `amountHT * 0.7` somewhere.

## The simulator is a one-question-per-screen tunnel

`components/simulator.tsx` is deliberately not a form. It's a click-driven
wizard (intro → effectif → équipement → budget → calculating → result →
conversational lead capture → thanks), navigated via a `history: Screen[]`
stack so "Retour" never loses an answer. Selecting a card auto-advances
after ~220ms.

It reads `montant` / `categorie` / `produit` query params (see
`ProductCard`'s "Calculer mon reste à charge" link and the product page's
own link) to **pre-fill** the product's price and category — per the
repositioning brief, a user coming from a product must never be asked to
re-describe what they already picked. When pre-filled, the tunnel skips
straight from "effectif" to the result. It uses `useSearchParams()`, so
both `/simulateur` and `/catalogue` wrap their client browser/tunnel in
`<Suspense>`.

It intentionally always uses the **standard** rate (no branch code) —
simpler, and never risks overstating the aide.

## Modals: always portal them

`QuoteCTA` renders its dialog via `createPortal(..., document.body)`,
not inline. The button is used from inside `Navbar` (itself
`position: sticky` with a `z-index`), and a sticky/positioned ancestor
creates its own stacking context — a `position: fixed` overlay nested
inside it can end up stacked *below* unrelated page content despite
`z-50`, silently letting clicks fall through to whatever's behind it.
Portaling to `document.body` sidesteps that entirely. Any future modal
/ dropdown-that-must-cover-everything should do the same; don't
re-introduce an inline fixed-overlay pattern.

## Repository structure

```
app/
  layout.tsx           Root layout: fonts, metadata, wraps app in CartProvider
  page.tsx              Homepage: hero → popular products → categories →
                         financial example → how-it-works → trust → final CTA
  globals.css           Tailwind directives, screen-transition keyframes,
                         prefers-reduced-motion override
  icon.svg               Favicon (App Router convention)
  simulateur/page.tsx    Eligibility tunnel (Suspense-wrapped)
  catalogue/page.tsx     Shop catalogue: search + CatalogueBrowser (filters/sort)
  produits/[slug]/       Full commercial product page + sticky mobile CTA
  aides/page.tsx         Explains the subsidy mechanism; never sells directly,
                          always ends by sending traffic back to /catalogue
  panier/page.tsx        Client-side cart (no payment — B2B devis instead)
components/
  ui/button.tsx           Shared <Button>/<LinkButton> primitives
  navbar.tsx              Sticky nav: search, links, cart icon, devis CTA,
                           mobile menu (hamburger — nav is NOT reachable on
                           mobile without it, don't remove)
  hero.tsx, popular-products.tsx, catalogue-preview.tsx, financial-example.tsx,
  how-it-works.tsx, trust-badges.tsx, final-cta.tsx, footer.tsx
  product-card.tsx, category-card.tsx, category-icons.tsx, product-icon.tsx
  product-price.tsx, remaining-cost.tsx, funding-badge.tsx, mini-simulator.tsx
  add-to-cart-button.tsx, quote-cta.tsx, sticky-mobile-cta.tsx
  catalogue-browser.tsx  Client component: category/secteur/price filters + sort
  search-bar.tsx          Client-side product name search + suggestions
  simulator.tsx           The eligibility tunnel (see above)
lib/
  subventions.ts    Single source of truth for rates/thresholds/caps
  products.ts        Example catalogue data + helpers (byCategory, related, popular)
  cart-context.tsx   Client-only cart (React context + localStorage)
  utils.ts            cn() helper + formatEUR()
```

## Conventions

- **Single source of truth for money**: see "Money/price components" above.
- **Client vs server components**: server by default; `"use client"` only
  where there's real interactivity or a hook (`simulator.tsx`,
  `catalogue-browser.tsx`, `search-bar.tsx`, `navbar.tsx`, `quote-cta.tsx`,
  `add-to-cart-button.tsx`, `mini-simulator.tsx`, cart pages).
- **Styling**: Tailwind utility classes composed with `cn()` from
  `lib/utils.ts`. Brand tokens (`navy`, `green`, `paper`, `ink`, `alert`)
  are defined in `tailwind.config.ts` — use them instead of raw hex or
  Tailwind's default palette.
- **Identity**: navy (`#15233F`) = authority/compliance, green gradient
  (`#1E7A3B` → `#8CC63F`) = subsidy/growth/validation. Logo mark is
  `[symbol] EQUIPVENTION` — never bake a rate ("70%") or the baseline
  into the logo image itself.
- **Fonts**: `font-display` (Archivo), `font-body` (Public Sans),
  `font-mono` (IBM Plex Mono — amounts, thresholds, codes, tabular data).
- **No fabricated trust signals**: trust badges (`trust-badges.tsx`) list
  only services actually built or genuinely promised elsewhere in the
  site (devis rapide, accompagnement dossier, support dédié, facture
  professionnelle, livraison). Don't add "paiement sécurisé" until a real
  payment flow exists, and never add fabricated customer
  testimonials/quotes/names — that's presenting invented reviews as
  genuine.
- **No fake urgency**: no invented stock counters or countdown timers.
- **Official documents**: never host a copy of an Ameli PDF. Always link
  out to the live ameli.fr page — see `components/footer.tsx`.
- **Tone**: commercial shop, never institutional. The site must never
  look like an official CARSAT/Ameli/government site.
- **Path imports**: use the `@/` alias, configured in `tsconfig.json`.

## Development workflow

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # next lint
```

No test suite yet. Verify a change by running `npm run dev` and checking
the affected page/component in the browser (including at phone width —
mobile nav has a real hamburger menu now, don't assume desktop-only
navigation is enough), plus `npm run build` before committing.
