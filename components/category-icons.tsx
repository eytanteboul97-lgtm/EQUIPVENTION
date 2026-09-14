import { Armchair, Weight, FlaskConical, HardHat, AlertTriangle, Move, Truck, Ruler, Wrench, Layers, type LucideIcon } from "lucide-react";
import type { RiskCategory } from "@/lib/products";
import type { OfficialEquipmentGroup } from "@/lib/aid-programs/types";

/** Icône partagée par catégorie de risque — catalogue, homepage. */
export const CATEGORY_ICONS: Record<RiskCategory, LucideIcon> = {
  "tms-ergonomie": Armchair,
  manutention: Weight,
  chutes: AlertTriangle,
  chimique: FlaskConical,
  epi: HardHat,
};

/** Icône par groupe d'équipement officiel FIPU — utilisée dans le simulateur. */
export const OFFICIAL_GROUP_ICONS: Record<OfficialEquipmentGroup, LucideIcon> = {
  transfert: Move,
  roulants: Truck,
  "plans-de-travail": Ruler,
  "outils-vibrations": Wrench,
  specifiques: Layers,
};
