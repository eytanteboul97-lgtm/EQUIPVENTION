/**
 * Moteur de calcul des subventions — source unique utilisée par la homepage,
 * le simulateur, les fiches produit et (plus tard) le panier/pré-dossier.
 *
 * Aucun taux, seuil ou plafond ne doit être recopié ailleurs dans le code.
 * Montants à revérifier sur ameli.fr avant chaque mise en production —
 * voir le cahier des charges, section "Corrections apportées en V2".
 */

export const RATE_STANDARD = 0.7;
export const MIN_SUBSIDY = 500;
export const THRESHOLD_HT = Math.ceil(MIN_SUBSIDY / RATE_STANDARD); // ≈ 715 € HT

/** Plafond des "actions de prévention" (diagnostic + formation + équipements), 2024-2027. */
export const PLAFOND_ACTIONS_PREVENTION = 25_000;

/**
 * Plafond global tous types d'investissement pour les entreprises <200 salariés.
 * Informationnel uniquement — ne jamais l'afficher comme un budget disponible
 * pour de l'achat de matériel, qui reste encadré par PLAFOND_ACTIONS_PREVENTION.
 */
export const PLAFOND_GLOBAL_MOINS_200 = 75_000;

/** Plafond de cumul des aides publiques, règle de minimis (300 000 € / 3 ans glissants). */
export const PLAFOND_DE_MINIMIS = 300_000;

export interface BranchOverride {
  code: string;
  label: string;
  rate: number;
  plafondActionsPrevention?: number;
  /** true tant que le libellé/taux n'a pas été confirmé sur la page ameli.fr dédiée. */
  aVerifier?: boolean;
}

/**
 * Accords de branche étendus portant le taux au-delà de 70 %.
 * Exemple structurel uniquement — à remplacer par les branches réelles listées
 * par Ameli ("de nouveaux accords pour 3 branches d'activité") avant mise en prod.
 */
export const BRANCH_OVERRIDES: BranchOverride[] = [
  {
    code: "exemple-branche-majoree",
    label: "Exemple — branche avec accord étendu (à confirmer)",
    rate: 0.85,
    aVerifier: true,
  },
];

export interface SubsidyResult {
  amountHT: number;
  rate: number;
  eligible: boolean;
  thresholdHT: number;
  missingToThresholdHT: number;
  plafond: number;
  subsidyEstimateRaw: number;
  subsidyEstimate: number;
  cappedByPlafond: boolean;
  remainingCostHT: number;
}

export function getRateForBranch(branchCode?: string): { rate: number; plafond: number } {
  const branch = BRANCH_OVERRIDES.find((b) => b.code === branchCode);
  return {
    rate: branch?.rate ?? RATE_STANDARD,
    plafond: branch?.plafondActionsPrevention ?? PLAFOND_ACTIONS_PREVENTION,
  };
}

export function calculateSubsidy(amountHT: number, branchCode?: string): SubsidyResult {
  const { rate, plafond } = getRateForBranch(branchCode);
  const eligible = amountHT >= THRESHOLD_HT;
  const subsidyEstimateRaw = amountHT * rate;
  const cappedByPlafond = subsidyEstimateRaw > plafond;
  const subsidyEstimate = eligible ? Math.min(subsidyEstimateRaw, plafond) : 0;

  return {
    amountHT,
    rate,
    eligible,
    thresholdHT: THRESHOLD_HT,
    missingToThresholdHT: eligible ? 0 : Math.max(0, THRESHOLD_HT - amountHT),
    plafond,
    subsidyEstimateRaw,
    subsidyEstimate,
    cappedByPlafond,
    remainingCostHT: amountHT - subsidyEstimate,
  };
}

/** Nombre d'unités à ajouter à un prix unitaire pour atteindre le seuil de 715 € HT. */
export function unitsNeededForThreshold(unitPriceHT: number): {
  units: number;
  totalHT: number;
} {
  const units = Math.max(1, Math.ceil(THRESHOLD_HT / unitPriceHT));
  return { units, totalHT: Number((units * unitPriceHT).toFixed(2)) };
}
