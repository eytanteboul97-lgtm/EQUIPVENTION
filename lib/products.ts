/**
 * Catalogue — données d'EXEMPLE uniquement.
 *
 * Le cahier des charges V2 est explicite : le catalogue définitif n'est pas
 * construit avant la phase de recherche produit (sourcing, notation /100,
 * vérification cahier des charges Ameli référence par référence). Les entrées
 * ci-dessous illustrent la structure de données et l'UI ; aucune ne doit être
 * traitée comme une référence réellement en vente.
 */

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
  },
];

export function getProductsByCategory(category: RiskCategory) {
  return EXAMPLE_PRODUCTS.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string) {
  return EXAMPLE_PRODUCTS.find((p) => p.slug === slug);
}
