import type {
  AidProgram,
  BranchAgreement,
  OfficialEquipment,
  OfficialEquipmentGroup,
  RequiredDocument,
} from "./types";
import { OFFICIAL_EQUIPMENT_GROUPS } from "./types";

/**
 * Dispositif "Subvention Prévention des risques ergonomiques" (FIPU).
 *
 * Source principale, relue et collée intégralement par le porteur de projet
 * le 14/09/2026 : page "équipements" ci-dessous. Tout ce qui porte
 * `verified: true` vient de cette relecture ; tout ce qui porte
 * `verified: false` est repris de sessions de travail antérieures et n'a
 * PAS été recontrôlé sur cette page (souvent parce que l'information est
 * derrière un onglet que le copier-coller n'a pas capturé).
 */

const EQUIPMENT_SOURCE = {
  url: "https://www.ameli.fr/entreprise/sante-travail/prevention/aides-financieres/subventions-1-50-salaries/prevention-risques-ergonomiques/equipements",
  organism: "Assurance Maladie — Risques professionnels",
  lastCheckedAt: "2026-09-14",
};

const PRESENTATION_SOURCE = {
  url: "https://www.ameli.fr/entreprise/sante-travail/prevention/aides-financieres/subventions-1-50-salaries/prevention-risques-ergonomiques/presentation-generale",
  organism: "Assurance Maladie — Risques professionnels",
  lastCheckedAt: "2026-09-10",
};

/** Source de l'annonce sur les accords de branche — citée mais pas encore relue en détail. */
const BRANCHE_ANNOUNCEMENT_SOURCE = {
  url: "https://www.ameli.fr/entreprise/actualites/prevention-des-risques-ergonomiques-de-nouveaux-accords-pour-3-branches-d-activite",
  organism: "Assurance Maladie — Risques professionnels",
  lastCheckedAt: "2026-09-10",
};

const EQUIPMENT: OfficialEquipment[] = [
  // Équipements de transfert
  { id: "leve-personne-rails-h", name: "Lève-personne sur rails (configuration en H) — établissements sanitaires/médico-sociaux, avec moteurs et harnais", group: "transfert", source: EQUIPMENT_SOURCE, verified: true },
  { id: "levage-potences-mini-grues", name: "Appareils de levage sur potences fixes et mini-grues de chargement", group: "transfert", source: EQUIPMENT_SOURCE, verified: true },
  { id: "levage-monorail-portiques", name: "Appareils de levage sur monorail ou portiques et ponts roulants", group: "transfert", source: EQUIPMENT_SOURCE, verified: true },
  { id: "palonnier-manipulateur-minigrue", name: "Palonnier, manipulateur, mini grue", group: "transfert", source: EQUIPMENT_SOURCE, verified: true },
  { id: "monte-charges", name: "Monte-charges (déménagement, construction)", group: "transfert", source: EQUIPMENT_SOURCE, verified: true },

  // Équipements roulants
  { id: "tracteurs-pousseurs-diables-brouettes", name: "Tracteurs pousseurs et timons électriques, diables monte-escaliers électriques, brouettes électriques", group: "roulants", source: EQUIPMENT_SOURCE, verified: true },
  { id: "chariots-accompagnant-2t", name: "Chariots de manutention automoteurs à conducteur accompagnant (≤ 2 tonnes)", group: "roulants", source: EQUIPMENT_SOURCE, verified: true },
  { id: "chariots-porte-2t", name: "Chariots de manutention automoteurs à conducteur porté (≤ 2 tonnes)", group: "roulants", source: EQUIPMENT_SOURCE, verified: true },
  { id: "rolls-bacs-picking", name: "Rolls, bacs et chariots de picking à niveau constant", group: "roulants", source: EQUIPMENT_SOURCE, verified: true },
  { id: "chariots-assistance-electrique", name: "Chariots à assistance électrique (hôtellerie, médico-social)", group: "roulants", source: EQUIPMENT_SOURCE, verified: true },

  // Plans de travail réglables en hauteur
  { id: "tables-elevatrices", name: "Tables élévatrices motorisées", group: "plans-de-travail", source: EQUIPMENT_SOURCE, verified: true },
  { id: "fauteuils-chariots-douche", name: "Fauteuils et chariots de douche motorisés", group: "plans-de-travail", source: EQUIPMENT_SOURCE, verified: true },
  { id: "plateformes-maconner", name: "Plateformes à maçonner", group: "plans-de-travail", source: EQUIPMENT_SOURCE, verified: true },
  { id: "recettes-materiaux", name: "Recettes à matériaux", group: "plans-de-travail", source: EQUIPMENT_SOURCE, verified: true },

  // Outils portatifs, sièges et équipements limitant les vibrations
  { id: "meuleuses-portatives", name: "Meuleuses portatives", group: "outils-vibrations", source: EQUIPMENT_SOURCE, verified: true },
  { id: "ponceuses-polisseuses", name: "Ponceuses, polisseuses portatives", group: "outils-vibrations", source: EQUIPMENT_SOURCE, verified: true },
  { id: "machines-serrage", name: "Machines de serrage portatives", group: "outils-vibrations", source: EQUIPMENT_SOURCE, verified: true },
  { id: "sieges-suspension", name: "Sièges à suspension", group: "outils-vibrations", source: EQUIPMENT_SOURCE, verified: true },
  { id: "compactage-commande-distance", name: "Matériels de compactage avec commande à distance", group: "outils-vibrations", source: EQUIPMENT_SOURCE, verified: true },
  { id: "demolition-commande-distance", name: "Matériels de démolition électrique avec commande à distance", group: "outils-vibrations", source: EQUIPMENT_SOURCE, verified: true },

  // Équipements spécifiques
  { id: "filmeuses-housseuses", name: "Filmeuses housseuses", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "elevateurs-vehicules-legers", name: "Élévateurs de véhicules légers", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "bachage-debachage-bennes", name: "Systèmes de bâchage/débâchage automatiques de bennes", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "autolaveuses-compactes", name: "Auto-laveuses compactes", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "demonte-pneus-equilibreuses-leve-roues", name: "Démonte-pneus, équilibreuses de roues et lève-roues", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "lave-verres-osmoseur", name: "Lave-verres avec osmoseur", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "bacs-shampoing-sieges-coiffure", name: "Bacs à shampoing et sièges de coupe à réglage électrique (coiffure)", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "meubles-bas-refrigeres", name: "Meubles bas réfrigérés (métiers de bouche)", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "rails-manutention-carcasses", name: "Rails de manutention de carcasses de viande", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
  { id: "leve-lits-electriques", name: "Lève-lits électriques ou à énergie autonome", group: "specifiques", source: EQUIPMENT_SOURCE, verified: true },
];

const BRANCH_AGREEMENTS: BranchAgreement[] = [
  {
    branchCode: "exemple-branche-majoree",
    branchName: "Exemple — branche avec accord étendu (nom exact non confirmé)",
    rateOverride: 0.85,
    source: BRANCHE_ANNOUNCEMENT_SOURCE,
    verified: false,
  },
];

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    id: "facture-acquittee",
    name: "Facture(s) acquittée(s) (duplicata ou copie)",
    description:
      "Doit comporter : nom et SIRET du fournisseur, nom de l'entreprise, référence et date de facture, désignation de la prestation/de l'équipement (libellé, quantité, montant unitaire et HT par élément), montants de TVA/remises/total/acomptes déjà versés avec dates de paiement, mention « acquittée », date de paiement, mode de règlement, référence du paiement, et date de livraison des équipements financés.",
    appliesTo: "both",
    mandatory: true,
    source: EQUIPMENT_SOURCE,
    verified: true,
  },
  {
    id: "attestation-fournisseur",
    name: "Attestation fournisseur — conformité au cahier des charges",
    description:
      "Complétée par le fournisseur, elle atteste que l'équipement financé est conforme à l'ensemble des données techniques du cahier des charges du dispositif.",
    appliesTo: "both",
    mandatory: true,
    source: EQUIPMENT_SOURCE,
    verified: true,
  },
  {
    id: "attestation-service-fait",
    name: "Attestation de « service fait »",
    description:
      "À adresser avant le 31 décembre de l'année, en complément de l'attestation fournisseur, si l'entreprise ne peut pas encore produire de facture acquittée pour l'achat réalisé dans l'année.",
    appliesTo: "both",
    mandatory: false,
    source: EQUIPMENT_SOURCE,
    verified: true,
  },
  {
    id: "attestation-vigilance-urssaf",
    name: "Attestation de vigilance URSSAF (moins de 6 mois)",
    description: "Document administratif mentionné dans les échanges de travail — non recontrôlé sur la page équipements (probablement listé sous l'onglet « documents administratifs » de la page officielle).",
    appliesTo: "entreprise",
    mandatory: true,
    source: EQUIPMENT_SOURCE,
    verified: false,
  },
  {
    id: "annexe2-minimis",
    name: "Annexe 2 — déclaration sur l'honneur des aides publiques perçues sur 3 ans",
    description: "Justifie le respect du plafond de minimis. Non recontrôlé sur la page équipements.",
    appliesTo: "both",
    mandatory: true,
    source: PRESENTATION_SOURCE,
    verified: false,
  },
  {
    id: "rib",
    name: "RIB au format PDF",
    description: "Document administratif mentionné dans les échanges de travail — non recontrôlé sur la page équipements.",
    appliesTo: "both",
    mandatory: true,
    source: EQUIPMENT_SOURCE,
    verified: false,
  },
];

export const FIPU: AidProgram = {
  id: "fipu-prevention-risques-ergonomiques",
  name: "Subvention Prévention des risques ergonomiques",
  organism: "Assurance Maladie — Risques professionnels",
  status: "active",
  officialSourceUrl: EQUIPMENT_SOURCE.url,
  lastVerifiedAt: EQUIPMENT_SOURCE.lastCheckedAt,
  effectiveFrom: "2024-01-01",
  effectiveTo: "2027-12-31",
  eligibility: {
    companySizeMin: 1,
    companySizeMax: null, // pas d'exclusion par effectif : le plafond change, l'accès non.
    conditions: [
      "Équipement neuf et conforme au cahier des charges technique du dispositif.",
      "Pour une demande 2026 : l'investissement financé doit être réalisé en 2026 (règle en vigueur à compter du 1er janvier 2026).",
    ],
  },
  standardRate: { rate: 0.7, appliesTo: "standard", source: EQUIPMENT_SOURCE },
  branchAgreements: BRANCH_AGREEMENTS,
  minimumExpense: {
    amount: 715,
    label: "Investissement minimum HT (plancher officiel)",
    source: EQUIPMENT_SOURCE,
  },
  minimumGrant: {
    amount: 500,
    label: "Montant minimum de subvention",
    source: EQUIPMENT_SOURCE,
  },
  investmentCaps: [
    {
      investmentType: "Actions de prévention (diagnostic, formation, équipements)",
      periodStart: "2024-01-01",
      periodEnd: "2027-12-31",
      capByCompanySize: [{ maxEmployees: null, amount: 25_000 }],
      source: EQUIPMENT_SOURCE,
    },
    {
      investmentType: "Tous types d'investissement confondus (plafond global)",
      periodStart: "2024-01-01",
      periodEnd: "2027-12-31",
      capByCompanySize: [
        { maxEmployees: 199, amount: 75_000 },
        { maxEmployees: null, amount: 25_000 },
      ],
      source: EQUIPMENT_SOURCE,
    },
  ],
  deMinimisCap: {
    amount: 300_000,
    label: "Cumul des aides publiques (règle de minimis), 3 ans glissants",
    source: PRESENTATION_SOURCE,
  },
  equipment: EQUIPMENT,
  requiredDocuments: REQUIRED_DOCUMENTS,
  submissionNotes: [
    {
      text: "Travailleurs indépendants : demande par e-mail à la caisse régionale de rattachement (CARSAT/CRAMIF/CGSS). Versement après vérification des pièces justificatives.",
      source: EQUIPMENT_SOURCE,
    },
    {
      text: "Entreprises : demande en ligne via le compte entreprise sur net-entreprises.fr (rubrique « Votre entreprise › Demander une subvention »).",
      source: EQUIPMENT_SOURCE,
    },
    {
      text: "Sur net-entreprises.fr, chaque pièce jointe à la demande est limitée à 3 Mo.",
      source: EQUIPMENT_SOURCE,
    },
    {
      text: "Le budget du dispositif étant limité, les demandes sont traitées par ordre chronologique d'arrivée — il est recommandé de transmettre la demande rapidement après l'investissement.",
      source: EQUIPMENT_SOURCE,
    },
  ],
};

export function getEquipmentById(id: string) {
  return FIPU.equipment.find((e) => e.id === id);
}

export function getEquipmentGroupLabel(group: OfficialEquipmentGroup) {
  return OFFICIAL_EQUIPMENT_GROUPS.find((g) => g.id === group)?.label ?? group;
}

export function getEquipmentByGroup(group: OfficialEquipmentGroup) {
  return FIPU.equipment.filter((e) => e.group === group);
}
