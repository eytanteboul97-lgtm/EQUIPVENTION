import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR, cn } from "@/lib/utils";
import { RemainingCost } from "@/components/remaining-cost";

/**
 * Bloc prix complet d'une fiche produit (et variante compacte pour les
 * cartes catalogue). Toujours trois lignes dans le même ordre pour ne
 * jamais mélanger prix catalogue / aide / reste à charge (section 17 du
 * brief produit) : Prix HT → Aide potentielle → Reste à charge (mis en
 * avant, cf. RemainingCost).
 */
export function ProductPrice({
  amountHT,
  compact = false,
}: {
  amountHT: number;
  compact?: boolean;
}) {
  const result = calculateSubsidy(amountHT);

  return (
    <div
      className={cn(
        "rounded-card border border-line bg-paper-raised",
        compact ? "p-4" : "p-6 shadow-card"
      )}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">Prix HT</span>
        <span className="font-mono font-semibold text-ink">{formatEUR(amountHT)}</span>
      </div>

      {result.eligible && (
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
            Aide potentielle
          </span>
          <span className="font-mono font-semibold text-alert">
            −{formatEUR(result.subsidyEstimate)}
          </span>
        </div>
      )}

      <div className={compact ? "mt-3 border-t border-line pt-3" : "mt-5 border-t border-line pt-5"}>
        <RemainingCost amountHT={amountHT} size={compact ? "md" : "xl"} />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Estimation indicative, taux standard {Math.round(result.rate * 100)} %. Sous réserve
        d&apos;éligibilité de l&apos;entreprise et d&apos;acceptation du dossier.
      </p>
    </div>
  );
}
