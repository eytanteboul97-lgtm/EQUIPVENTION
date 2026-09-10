import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR, cn } from "@/lib/utils";

/**
 * LE bloc "reste à charge" — rendu volontairement plus visible que le prix
 * catalogue (positionnement boutique : le reste à charge est l'argument de
 * vente, le prix HT n'est qu'une ligne secondaire au-dessus).
 */
export function RemainingCost({
  amountHT,
  size = "lg",
  className,
}: {
  amountHT: number;
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const result = calculateSubsidy(amountHT);

  const sizeClasses = {
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  }[size];

  if (!result.eligible) {
    return (
      <div className={cn("text-sm text-navy", className)}>
        Seuil minimum non atteint seul — ajoutez {formatEUR(result.missingToThresholdHT)} pour
        déclencher une aide.
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="font-mono text-xs uppercase tracking-wide text-ink-faint">
        À partir de
      </div>
      <div className={cn("font-display font-extrabold text-green leading-none", sizeClasses)}>
        {formatEUR(result.remainingCostHT)} <span className="text-base font-semibold text-ink-faint">HT</span>
      </div>
      <div className="mt-1 font-mono text-xs text-ink-faint">
        après aide potentielle · sous réserve d&apos;éligibilité
      </div>
    </div>
  );
}
