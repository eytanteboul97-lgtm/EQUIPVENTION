# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**EQUIPVENTION** is a French B2B **shop** for professional equipment
(ergonomics/TMS, manual handling, workshop tools) that may qualify for
CARSAT/Ameli occupational-risk-prevention subsidies. The site is
e-commerce first: the homepage, catalogue and product pages sell
equipment — the subsidy/simulator is the thing that makes the sale
easier, not the reason the site exists.

Central message: **"Vous achetez l'équipement. Nous vous aidons à réduire
votre reste à charge."** — never "come do a simulation." Every product
surface (card, fiche) leads with photo/name/price, then shows aide
potentielle and reste à charge, then the buy/devis action.

**EQUIPVENTION is not, and must never look like, an official body.**
Every page that talks about the subsidy carries some form of: *"Plateforme
indépendante. Nous ne sommes ni l'Assurance Maladie, ni une Carsat, ni un
organisme public. Les simulations sont indicatives..."* (see
`components/footer.tsx`, the simulator result screen, `/aides`). Never
soften or drop this.

## The regulatory data model — read before touching any number

All subsidy rules live in `lib/aid-programs/`, structured so a second
dispositif can be added later without touching the calculation engine:

- `lib/aid-programs/types.ts` — the shape (`AidProgram`,
  `EligibilityRule`, `FundingRate`, `InvestmentCap`, `BranchAgreement`,
  `RequiredDocument`, `OfficialEquipment`, `OfficialSource`, ...).
- `lib/aid-programs/fipu.ts` — the one program implemented today
  ("Subvention Prévention des risques ergonomiques" / FIPU). **Every
  field carries a `source: OfficialSource` (url + organism +
  `lastCheckedAt`) and, on the pieces that most need scrutiny
  (equipment, documents, branch agreements), a `verified: boolean`.**
  `verified: false` means "structurally present, not confirmed against
  the live source" — never surface it to a user as settled fact without
  checking first.
- `lib/subventions.ts` — thin compatibility layer. It re-exports the
  same constants/functions the rest of the app already imports
  (`RATE_STANDARD`, `THRESHOLD_HT`, `calculateSubsidy`, ...), but every
  value is *derived from* `fipu.ts`, not hardcoded. If Ameli changes a
  number, it changes in exactly one place: `lib/aid-programs/fipu.ts`.

**What's actually verified** (relu texte à texte le 14/09/2026, source :
la page "équipements" citée dans `fipu.ts`):
- Taux standard **70%**, subvention minimum **500€**, seuil d'investissement
  **715€ HT** (valeur officielle exacte, pas une approximation).
- Plafond "actions de prévention" (diagnostic + formation + équipements) :
  **25 000€**, 2024–2027, quelle que soit la taille de l'entreprise.
- Plafond global tous investissements : **75 000€** pour les entreprises
  **<200 salariés**, mais seulement **25 000€** (= même valeur que le
  plafond par type) pour les entreprises **≥200 salariés** — pas de marge
  supplémentaire pour elles. Ne jamais présenter le 75k comme un budget
  équipement.
- La **liste complète des 29 équipements officiellement reconnus**, en 5
  groupes (transfert, roulants, plans de travail, outils/vibrations,
  spécifiques) — voir `EQUIPMENT` dans `fipu.ts`.
- Les documents justifiant l'investissement (facture acquittée avec son
  contenu détaillé, attestation fournisseur, attestation de service fait).
- Le mode de dépôt (net-entreprises.fr pour les entreprises, e-mail à la
  caisse régionale pour les indépendants), la limite de 3 Mo par pièce
  jointe, et la règle de traitement par ordre chronologique (vraie
  urgence, sourcée — pas un dark pattern, à garder dans l'UI).
- Condition 2026 : l'investissement doit être réalisé en 2026 pour une
  demande 2026.

**Ce qui reste `verified: false`** (repris de sessions antérieures, pas
recontrôlé sur la page équipements — probablement derrière des onglets
que le copier-coller n'a pas capturés) : le nom exact des 3 branches
bénéficiant du taux majoré à 85%, et une partie des documents
*administratifs* (attestation de vigilance URSSAF, RIB, Annexe 2 de
minimis). Ne jamais retirer leur badge "à confirmer" sans une relecture
de la source.

**No live internet access in this dev sandbox** — outbound HTTPS to
ameli.fr and basically everything else is blocked by network policy here.
Regulatory content can only be verified by asking the user to paste the
official page's text; don't attempt to fetch it.

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
- `components/equipment-badges.tsx` — the two-tier honesty badge on every
  product: "Catégorie reconnue" (real fact, only when every
  `officialEquipmentIds` entry is `verified: true`) is never merged with
  "Référence exemple — éligibilité à vérifier" (always shown — the exact
  commercial SKU isn't validated). Never collapse these into one
  "Compatible avec les critères techniques" claim; that stronger wording
  is reserved for the day a real per-SKU technical check exists.

If a new surface needs to show a price/aide/reste-à-charge, reuse one of
these — never write a new `amountHT * 0.7` somewhere.

## The simulator is a one-question-per-screen tunnel

`components/simulator.tsx` is deliberately not a form. It's a click-driven
wizard, navigated via a `history: Screen[]` stack so "Retour" never loses
an answer. Selecting a card auto-advances after ~220ms. Full path:
`intro → effectif → secteur → besoin → équipement → budget → conditions
→ calculating → result → lead (prénom/nom/entreprise/téléphone/code
postal/email) → thanks`.

- **secteur** (10 cards) and **besoin** (8 cards) are collected for
  personalization and lead qualification. Per the verified rules, neither
  gates eligibility today (FIPU has no sector exclusion) — don't invent
  one. `besoin` *does* drive which official equipment groups appear next
  (`BESOIN_OPTIONS[...].groups`).
- **équipement** shows the real `OFFICIAL_EQUIPMENT_GROUPS` (from
  `lib/aid-programs/types.ts`), filtered by the chosen `besoin` — not the
  catalogue's own `RiskCategory` taxonomy, which is a separate, deliberate
  UX simplification used only for browsing (`/catalogue`,
  `product.category`). Don't conflate the two.
- **conditions**: a single simplified screen for the two conditions we
  can actually state with a straight face (équipement neuf, achat en
  2026). Answering "oui" to both is what makes the result 🟢 instead of 🟠
  — see the tier logic below.
- **result** is a real 🟢/🟠/🔴 three-tier system, not eligible/not:
  - 🔴 *"Non identifié"* — amount is below `THRESHOLD_HT`. Hard, sourced fact.
  - 🟢 *"Critères identifiés comme compatibles"* — above threshold **and**
    user confirmed both conditions.
  - 🟠 *"Éligibilité potentielle — vérification nécessaire"* — above
    threshold but conditions unconfirmed ("je ne sais pas").
  Never collapse this back to a binary, and never say "vous recevrez X€" —
  always "aide potentielle estimée".

It reads `montant` / `categorie` / `produit` query params (see
`ProductCard`'s "Calculer mon reste à charge" link) to **pre-fill** the
product's price and category. When pre-filled, the tunnel skips straight
from `effectif` to `conditions` (secteur/besoin/équipement/budget are
already implied by the product). It uses `useSearchParams()`, so both
`/simulateur` and `/catalogue` wrap their client component in `<Suspense>`.

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

## Current phase — read before touching the catalogue

The product catalogue is **deliberately not final**. `lib/products.ts`
holds placeholder/example products only. Each one's `officialEquipmentIds`
now points at real, verified entries in `lib/aid-programs/fipu.ts` — the
*category* is genuinely officially recognized — but the specific
commercial reference is still an example (see `equipment-badges.tsx`
above). Do not add real products until they've been scored and checked
against the official technical cahier des charges reference by reference.

There is still **no backend**: `lib/cart-context.tsx` is a client-only
cart (React context + localStorage), and `QuoteCTA` shows a local
confirmation state — neither calls a real API. A real back-office to edit
`aid-programs` data without a redeploy, SIRET/SIREN lookup, document
upload, and real analytics all require a database and are a deliberate
later phase (infra decision, not a component to add casually) — see the
"Architecture EQUIPVENTION V4" document (Claude artifact) for the full
phasing rationale.

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
  aides/page.tsx         Explains the subsidy mechanism (full equipment list,
                          documents, deposit process, sources) — never sells
                          directly, always ends by sending traffic to /catalogue
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
  equipment-badges.tsx, add-to-cart-button.tsx, quote-cta.tsx, sticky-mobile-cta.tsx
  catalogue-browser.tsx  Client component: category/secteur/price filters + sort
  search-bar.tsx          Client-side product name search + suggestions
  simulator.tsx           The eligibility tunnel (see above)
lib/
  aid-programs/types.ts   The regulatory data model (see above)
  aid-programs/fipu.ts     The one program implemented, fully sourced
  subventions.ts           Compatibility layer over aid-programs/fipu.ts
  products.ts               Example catalogue data + helpers (byCategory,
                             byOfficialGroup, related, popular)
  cart-context.tsx          Client-only cart (React context + localStorage)
  utils.ts                   cn() helper + formatEUR()
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
  site. Don't add "paiement sécurisé" until a real payment flow exists,
  and never add fabricated customer testimonials/quotes/names.
- **No fake urgency** — except the one urgency claim that's real and
  sourced (first-come-first-served processing, see `/aides`). Don't add
  invented stock counters or countdown timers.
- **Official documents**: never host a copy of an Ameli PDF. Always link
  out to the live ameli.fr page.
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
