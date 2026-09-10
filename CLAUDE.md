# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**EQUIPVENTION** is a French B2B e-commerce site selling professional
equipment (ergonomics/TMS, manual handling, workshop tools) that may
qualify for CARSAT/Ameli occupational-risk-prevention subsidies. The
promise is not "we sell equipment" but "equip your business while
benefiting from the funding schemes you may be eligible for."

Full functional spec: see the "Cahier des charges EQUIPVENTION — V2"
document (Claude artifact, shared with the project owner). Key numbers
enforced in code:

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
to build and test the UI (catalogue-by-risk, product page, subsidy
display). Every product there is labeled "Exemple — sourcing en cours" in
the UI. Do not present any of them as real inventory, and do not add real
products until they've been scored and checked against the official
Ameli technical spec sheet (cahier des charges technique) product by
product.

No backend, database, cart, checkout, or document generation exists yet.
This is phase 1 ("front vitrine") per the roadmap: catalogue by risk,
double-price product pages, and a client-side eligibility simulator with
lead capture (no real submission endpoint yet — see
`components/simulator.tsx`).

## Repository structure

```
app/
  layout.tsx          Root layout: fonts (next/font/google), metadata
  page.tsx             Homepage: hero, how-it-works, catalogue preview
  globals.css          Tailwind directives + prefers-reduced-motion override
  icon.svg             Favicon (App Router convention)
  simulateur/page.tsx  Eligibility simulator page
  catalogue/page.tsx   Catalogue grouped by risk category
  produits/[slug]/     Product detail page (double-price fiche)
components/
  ui/button.tsx        Shared <Button>/<LinkButton> primitives
  subsidy-card.tsx     THE reusable double-price display (price / aide / reste)
  simulator.tsx         Client component: eligibility form + lead capture
  logo.tsx, navbar.tsx, footer.tsx, hero.tsx, how-it-works.tsx,
  catalogue-preview.tsx, product-card.tsx, product-icon.tsx
lib/
  subventions.ts        Single source of truth for rates/thresholds/caps —
                         never duplicate a rate or threshold anywhere else
  products.ts            Example/placeholder catalogue data (see above)
  utils.ts                cn() helper + formatEUR()
```

## Conventions

- **Single source of truth for money**: any rate, threshold, or cap
  (70%, 500€, 715€, 25 000€, 75 000€, 85%, de-minimis 300 000€) is read
  from `lib/subventions.ts`. If a screen needs a number that isn't
  exported there yet, add it there — never inline a new magic number.
- **Client vs server components**: only components with real interactivity
  (`simulator.tsx`) are `"use client"`. Everything else stays a server
  component.
- **Styling**: Tailwind utility classes composed with `cn()` from
  `lib/utils.ts`. Brand tokens (`navy`, `green`, `paper`, `ink`, `alert`)
  are defined in `tailwind.config.ts` — use them instead of raw hex or
  Tailwind's default palette.
- **Identity**: navy (`#15233F`) = authority/compliance, green gradient
  (`#1E7A3B` → `#8CC63F`) = subsidy/growth/validation. Logo mark is
  `[symbol] EQUIPVENTION` — never bake a rate ("70%") or the baseline
  into the logo image itself; it needs to stay reusable everywhere.
- **Fonts**: `font-display` (Archivo — headings, buttons, numbers-as-hero),
  `font-body` (Public Sans — running text), `font-mono` (IBM Plex Mono —
  amounts, thresholds, codes, anything tabular).
- **Official documents**: never host a copy of an Ameli PDF (they change
  without notice). Always link out to the live ameli.fr page — see
  `components/footer.tsx` for the two canonical URLs.
- **Tone**: commercial and reassuring, never institutional. The site must
  never look like an official CARSAT/Ameli/government site (see
  `components/hero.tsx` copy and the footer disclaimer for the register
  to match).
- **Path imports**: use the `@/` alias, configured in `tsconfig.json`.

## Development workflow

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # next lint
```

No test suite yet. Verify a change by running `npm run dev` and checking
the affected page/component in the browser, plus `npm run build` before
committing.
