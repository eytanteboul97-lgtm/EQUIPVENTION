/**
 * Moteur de calcul des subventions — source unique utilisée par la homepage,
 * le simulateur, les fiches produit et le panier.
 *
 * Ce fichier ne contient plus les chiffres en dur : il les lit depuis
 * lib/aid-programs/fipu.ts, qui porte pour chaque valeur sa source
 * officielle et sa date de dernière vérification. Si une valeur doit
 * changer (Ameli fait évoluer une règle), elle se modifie à un seul
 * endroit : lib/aid-programs/fipu.ts.
 */

import { FIPU } from "./aid-programs/fipu";
import type { BranchAgreement } from "./aid-programs/types";

export const RATE_STANDARD = FIPU.standardRate.rate;
export const MIN_SUBSIDY = FIPU.minimumGrant.amount;
export const THRESHOLD_HT = FIPU.minimumExpense.amount; // 715 € HT — valeur officielle, pas une approximation

const ACTIONS_PREVENTION_CAP = FIPU.investmentCaps.find((c) => c.investmentType.startsWith("Actions de prévention"));
const GLOBAL_CAP = FIPU.investmentCaps.find((c) => c.investmentType.includes("plafond global"));

/** Plafond des "actions de prévention" (diagnostic + formation + équipements), 2024-2027. */
export const PLAFOND_ACTIONS_PREVENTION = ACTIONS_PREVENTION_CAP?.capByCompanySize[0]?.amount ?? 25_000;

/**
 * Plafond global tous types d'investissement pour les entreprises <200 salariés.
 * Informationnel uniquement — ne jamais l'afficher comme un budget disponible
 * pour de l'achat de matériel, qui reste encadré par PLAFOND_ACTIONS_PREVENTION.
 */
export const PLAFOND_GLOBAL_MOINS_200 =
  GLOBAL_CAP?.capByCompanySize.find((c) => c.maxEmployees === 199)?.amount ?? 75_000;

/** Même plafond global, mais pour les entreprises de 200 salariés et plus (pas de marge supplémentaire). */
export const PLAFOND_GLOBAL_200_ET_PLUS =
  GLOBAL_CAP?.capByCompanySize.find((c) => c.maxEmployees === null)?.amount ?? 25_000;

/** Plafond de cumul des aides publiques, règle de minimis (300 000 € / 3 ans glissants). */
export const PLAFOND_DE_MINIMIS = FIPU.deMinimisCap.amount;

export interface BranchOverride {
  code: string;
  label: string;
  rate: number;
  plafondActionsPrevention?: number;
  /** true tant que le libellé/taux n'a pas été confirmé sur la page ameli.fr dédiée. */
  aVerifier?: boolean;
}

function fromBranchAgreement(b: BranchAgreement): BranchOverride {
  return {
    code: b.branchCode,
    label: b.branchName,
    rate: b.rateOverride,
    plafondActionsPrevention: b.capOverride,
    aVerifier: !b.verified,
  };
}

/** Accords de branche étendus portant le taux au-delà de 70 % — voir lib/aid-programs/fipu.ts. */
export const BRANCH_OVERRIDES: BranchOverride[] = FIPU.branchAgreements.map(fromBranchAgreement);

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

/** Plafond global (tous investissements confondus) applicable selon l'effectif. */
export function getGlobalCapForCompanySize(employees: number): number {
  return employees < 200 ? PLAFOND_GLOBAL_MOINS_200 : PLAFOND_GLOBAL_200_ET_PLUS;
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
