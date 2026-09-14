/**
 * Catalogue — données d'EXEMPLE uniquement.
 *
 * Le cahier des charges V2 est explicite : le catalogue définitif n'est pas
 * construit avant la phase de recherche produit (sourcing, notation /100,
 * vérification cahier des charges Ameli référence par référence). Les entrées
 * ci-dessous illustrent la structure de données et l'UI ; aucune ne doit être
 * traitée comme une référence réellement en vente.
 *
 * En revanche, `officialEquipmentIds` référence de vraies entrées de la liste
 * officielle du dispositif FIPU (lib/aid-programs/fipu.ts, relue le
 * 14/09/2026) : la CATÉGORIE est officiellement reconnue, seule la référence
 * commerciale précise reste un exemple en attente de sourcing.
 */

import { getEquipmentById } from "./aid-programs/fipu";
import type { OfficialEquipmentGroup } from "./aid-programs/types";

export type RiskCategory =
  | "tms-ergonomie"
  | "manutention"
  | "chutes"
  | "chimique"
  | "epi";

export const RISK_CATEGORIES: { id: RiskCategory; label: string; description: string }[] = [
  {
    id: "tms-ergonomie",
    label: "TMS / Ergonomie",
    description: "Troubles musculo-squelettiques liés aux postures et vibrations.",
  },
  {
    id: "manutention",
    label: "Manutention",
    description: "Port de charges, déplacements répétés, efforts physiques.",
  },
  {
    id: "chutes",
    label: "Chutes",
    description: "Travail en hauteur, sols glissants, échafaudages.",
  },
  {
    id: "chimique",
    label: "Risque chimique",
    description: "Exposition à des produits, ventilation, protection respiratoire.",
  },
  {
    id: "epi",
    label: "EPI",
    description: "Équipements de protection individuelle.",
  },
];

export interface Product {
  slug: string;
  name: string;
  category: RiskCategory;
  priceHT: number;
  blurb: string;
  professions: string[];
  features: string[];
  icon: "weight" | "armchair" | "grinder" | "cart" | "tire" | "toolkit";
  /** Référence(s) vers lib/aid-programs/fipu.ts — la/les catégorie(s) officielle(s) correspondante(s). */
  officialEquipmentIds: string[];
  /** "panier" pour une commande directe, "devis" pour les montants/besoins spécifiques. */
  sellMode: "panier" | "devis";
  availability: string;
  deliveryEstimate: string;
  /** Met le produit en avant sur la homepage ("les plus demandés"). */
  popular?: boolean;
  /** Slugs d'autres produits à suggérer en cross-sell. */
  crossSell?: string[];
}

export const EXAMPLE_PRODUCTS: Product[] = [
  {
    slug: "leve-roue-atelier",
    name: "Lève-roue d'atelier 200 kg",
    category: "manutention",
    priceHT: 380,
    blurb:
      "Réduit la manipulation manuelle des roues lourdes en atelier mécanique et pneumatique.",
    professions: ["Garage", "Concession auto", "Atelier poids lourd"],
    features: ["Capacité 200 kg", "Roulettes pivotantes", "Poignée de manœuvre ergonomique"],
    icon: "weight",
    officialEquipmentIds: ["demonte-pneus-equilibreuses-leve-roues"],
    sellMode: "panier",
    availability: "En stock chez notre fournisseur partenaire",
    deliveryEstimate: "5 à 8 jours ouvrés",
    popular: true,
    crossSell: ["demonte-pneu-atelier", "chariot-picking-niveau-constant"],
  },
  {
    slug: "siege-suspension-poste-fixe",
    name: "Siège à suspension pneumatique",
    category: "tms-ergonomie",
    priceHT: 320,
    blurb:
      "Amortit les vibrations transmises au poste de travail assis et réduit la fatigue lombaire.",
    professions: ["Industrie", "Logistique", "Atelier"],
    features: ["Suspension pneumatique réglable", "Assise ajustable en hauteur", "Dossier lombaire renforcé"],
    icon: "armchair",
    officialEquipmentIds: ["sieges-suspension"],
    sellMode: "panier",
    availability: "En stock chez notre fournisseur partenaire",
    deliveryEstimate: "3 à 6 jours ouvrés",
    crossSell: ["kit-outils-portatifs-anti-vibration", "meuleuse-portative-anti-vibration"],
  },
  {
    slug: "meuleuse-portative-anti-vibration",
    name: "Meuleuse portative anti-vibration",
    category: "tms-ergonomie",
    priceHT: 265,
    blurb: "Réduit la transmission de vibrations main-bras lors de meulage prolongé.",
    professions: ["Métallerie", "BTP", "Chaudronnerie"],
    features: ["Poignée amortissante", "Niveau vibratoire réduit", "Compatible disques standards"],
    icon: "grinder",
    officialEquipmentIds: ["meuleuses-portatives"],
    sellMode: "panier",
    availability: "En stock chez notre fournisseur partenaire",
    deliveryEstimate: "3 à 6 jours ouvrés",
    crossSell: ["kit-outils-portatifs-anti-vibration", "siege-suspension-poste-fixe"],
  },
  {
    slug: "kit-outils-portatifs-anti-vibration",
    name: "Kit 3 outils portatifs anti-vibration",
    category: "tms-ergonomie",
    priceHT: 735,
    blurb:
      "Perceuse, visseuse et ponceuse équipées d'une poignée anti-vibration, vendues en kit pour dépasser le seuil minimum de subvention.",
    professions: ["BTP", "Industrie", "Menuiserie"],
    features: ["3 outils inclus", "Poignées anti-vibration", "Coffret de rangement"],
    icon: "toolkit",
    officialEquipmentIds: ["ponceuses-polisseuses", "machines-serrage"],
    sellMode: "panier",
    availability: "En stock chez notre fournisseur partenaire",
    deliveryEstimate: "5 à 8 jours ouvrés",
    popular: true,
    crossSell: ["meuleuse-portative-anti-vibration", "siege-suspension-poste-fixe"],
  },
  {
    slug: "chariot-picking-niveau-constant",
    name: "Chariot de picking à niveau constant",
    category: "manutention",
    priceHT: 640,
    blurb:
      "Maintient la charge à hauteur constante pour limiter les flexions répétées du dos.",
    professions: ["Logistique", "Entrepôt", "Préparation de commandes"],
    features: ["Mise à niveau automatique", "Capacité 300 kg", "Roues increvables"],
    icon: "cart",
    officialEquipmentIds: ["rolls-bacs-picking"],
    sellMode: "panier",
    availability: "Sur commande auprès de notre fournisseur",
    deliveryEstimate: "2 à 3 semaines",
    crossSell: ["leve-roue-atelier", "demonte-pneu-atelier"],
  },
  {
    slug: "demonte-pneu-atelier",
    name: "Démonte-pneu semi-automatique",
    category: "manutention",
    priceHT: 890,
    blurb:
      "Diminue l'effort physique et les postures à risque lors du montage/démontage de pneus.",
    professions: ["Garage", "Pneumaticien"],
    features: ["Bras de pression assisté", "Compatible jusqu'à 21 pouces", "Palette de dégagement talon"],
    icon: "tire",
    officialEquipmentIds: ["demonte-pneus-equilibreuses-leve-roues"],
    sellMode: "devis",
    availability: "Sur commande auprès de notre fournisseur",
    deliveryEstimate: "2 à 4 semaines",
    popular: true,
    crossSell: ["leve-roue-atelier", "chariot-picking-niveau-constant"],
  },
];

export function getProductsByCategory(category: RiskCategory) {
  return EXAMPLE_PRODUCTS.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string) {
  return EXAMPLE_PRODUCTS.find((p) => p.slug === slug);
}

export function getPopularProducts() {
  return EXAMPLE_PRODUCTS.filter((p) => p.popular);
}

export function getRelatedProducts(product: Product, limit = 3) {
  const bySlug = product.crossSell
    ?.map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => Boolean(p));
  if (bySlug && bySlug.length > 0) return bySlug.slice(0, limit);
  return EXAMPLE_PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, limit);
}

/** Union de toutes les professions citées au catalogue, pour le filtre "secteur". */
export function getAllProfessions() {
  return Array.from(new Set(EXAMPLE_PRODUCTS.flatMap((p) => p.professions))).sort();
}

/** Produits dont au moins un équipement officiel appartient au groupe donné (voir simulateur, étape "besoin"). */
export function getProductsByOfficialGroup(group: OfficialEquipmentGroup) {
  return EXAMPLE_PRODUCTS.filter((p) =>
    p.officialEquipmentIds.some((id) => getEquipmentById(id)?.group === group)
  );
}
