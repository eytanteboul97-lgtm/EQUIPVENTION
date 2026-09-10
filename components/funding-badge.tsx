import { calculateSubsidy, RATE_STANDARD } from "@/lib/subventions";
import { formatEUR, cn } from "@/lib/utils";

type Variant = "rate" | "eligible" | "remaining";

/**
 * Badges commerciaux courts pour les cartes catalogue/catégorie. Formulés au
 * conditionnel ("potentielle", "possible") — jamais une éligibilité garantie.
 */
export function FundingBadge({
  variant,
  amountHT,
  className,
}: {
  variant: Variant;
  amountHT?: number;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.7rem] font-medium";

  if (variant === "rate") {
    return (
      <span className={cn(base, "bg-navy-soft text-navy", className)}>
        Jusqu&apos;à −{Math.round(RATE_STANDARD * 100)} %
      </span>
    );
  }

  if (variant === "eligible") {
    return (
      <span className={cn(base, "bg-green-soft text-green", className)}>
        Aide potentielle
      </span>
    );
  }

  // "remaining" : nécessite un montant
  if (amountHT === undefined) return null;
  const result = calculateSubsidy(amountHT);
  if (!result.eligible) return null;

  return (
    <span className={cn(base, "bg-green-soft text-green", className)}>
      Reste à charge dès {formatEUR(result.remainingCostHT)}
    </span>
  );
}
