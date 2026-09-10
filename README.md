# EQUIPVENTION

Plateforme B2B qui commercialise des équipements professionnels pouvant
bénéficier des dispositifs de prévention des risques professionnels
(CARSAT / Ameli).

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## État du projet

Phase 1 — front vitrine : catalogue par risque, fiches produit avec
double affichage de prix, simulateur d'éligibilité (calcul indicatif,
sans dépôt de dossier réel). Le catalogue actuel n'est composé que de
produits d'exemple, clairement identifiés comme tels dans l'interface —
voir `CLAUDE.md` pour le détail des phases suivantes (back-end e-commerce,
génération de documents, vérification de conformité fournisseur).

Tous les taux, seuils et plafonds affichés sont centralisés dans
`lib/subventions.ts` et doivent être revérifiés sur
[ameli.fr](https://www.ameli.fr/entreprise/sante-travail/prevention/aides-financieres/subventions-1-50-salaries/prevention-risques-ergonomiques/presentation-generale)
avant toute mise en production.
