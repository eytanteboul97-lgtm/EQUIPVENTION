/**
 * Modèle de données générique pour un dispositif d'aide — pensé pour
 * accueillir plusieurs dispositifs (FIPU aujourd'hui, Equip'mobile+ / aides
 * régionales plus tard) sans dupliquer le moteur de calcul.
 *
 * Règle d'intégrité : toute donnée réglementaire (taux, plafond, équipement,
 * document) porte un `source` avec l'URL officielle et la date de dernière
 * vérification. Un enregistrement `verified: false` peut exister dans le
 * code (structure prête) mais ne doit jamais être présenté à l'utilisateur
 * comme une règle confirmée.
 */

export interface OfficialSource {
  url: string;
  organism: string;
  /** Date ISO de la dernière relecture humaine de cette donnée sur la source. */
  lastCheckedAt: string;
}

export interface FundingRate {
  rate: number; // 0..1
  /** "standard" ou code d'un accord de branche. */
  appliesTo: "standard" | string;
  source: OfficialSource;
}

export interface AmountRule {
  amount: number;
  label: string;
  source: OfficialSource;
}

/** Plafond par type d'investissement, différencié par taille d'entreprise. */
export interface InvestmentCap {
  investmentType: string;
  periodStart: string;
  periodEnd?: string;
  capByCompanySize: { maxEmployees: number | null; amount: number }[];
  source: OfficialSource;
}

export interface BranchAgreement {
  branchCode: string;
  branchName: string;
  rateOverride: number;
  capOverride?: number;
  source: OfficialSource;
  /** Bloque l'affichage tant que le nom/taux exact n'est pas confirmé sur la source. */
  verified: boolean;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  appliesTo: "entreprise" | "independant" | "both";
  mandatory: boolean;
  source: OfficialSource;
  verified: boolean;
}

export type OfficialEquipmentGroup =
  | "transfert"
  | "roulants"
  | "plans-de-travail"
  | "outils-vibrations"
  | "specifiques";

export const OFFICIAL_EQUIPMENT_GROUPS: { id: OfficialEquipmentGroup; label: string }[] = [
  { id: "transfert", label: "Équipements de transfert" },
  { id: "roulants", label: "Équipements roulants" },
  { id: "plans-de-travail", label: "Plans de travail réglables en hauteur" },
  { id: "outils-vibrations", label: "Outils portatifs, sièges et équipements limitant les vibrations" },
  { id: "specifiques", label: "Équipements spécifiques" },
];

export interface OfficialEquipment {
  id: string;
  name: string;
  group: OfficialEquipmentGroup;
  source: OfficialSource;
  verified: boolean;
}

export interface EligibilityRule {
  companySizeMin: number;
  companySizeMax: number | null;
  sectorCodes?: string[];
  conditions: string[];
}

export interface AidProgram {
  id: string;
  name: string;
  organism: string;
  status: "active" | "inactive";
  officialSourceUrl: string;
  lastVerifiedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  eligibility: EligibilityRule;
  standardRate: FundingRate;
  branchAgreements: BranchAgreement[];
  minimumExpense: AmountRule;
  minimumGrant: AmountRule;
  investmentCaps: InvestmentCap[];
  deMinimisCap: AmountRule;
  equipment: OfficialEquipment[];
  requiredDocuments: RequiredDocument[];
  /** Règles de dépôt, non chiffrées mais réglementaires (ordre de traitement, formats...). */
  submissionNotes: { text: string; source: OfficialSource }[];
}
