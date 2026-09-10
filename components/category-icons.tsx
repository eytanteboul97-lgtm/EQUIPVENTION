import { Armchair, Weight, FlaskConical, HardHat, AlertTriangle, type LucideIcon } from "lucide-react";
import type { RiskCategory } from "@/lib/products";

/** Icône partagée par catégorie de risque — catalogue, simulateur, homepage. */
export const CATEGORY_ICONS: Record<RiskCategory, LucideIcon> = {
  "tms-ergonomie": Armchair,
  manutention: Weight,
  chutes: AlertTriangle,
  chimique: FlaskConical,
  epi: HardHat,
};
