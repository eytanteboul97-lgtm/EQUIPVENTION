import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";

export function SubsidyCard({
  amountHT,
  branchCode,
  compact = false,
}: {
  amountHT: number;
  branchCode?: string;
  compact?: boolean;
}) {
  const result = calculateSubsidy(amountHT, branchCode);

  return (
    <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
          Prix professionnel
        </span>
        <span className="font-mono text-lg font-semibold text-ink">
          {formatEUR(amountHT)} HT
        </span>
      </div>

      {result.eligible ? (
        <>
          <div className="mt-3 font-mono text-sm font-medium text-alert">
            Aide potentielle jusqu&apos;à −{formatEUR(result.subsidyEstimate)}
          </div>
          <div
            className={compact ? "mt-4" : "mt-6 border-t border-line pt-6"}
          >
            <div className="font-mono text-xs uppercase tracking-wide text-ink-faint">
              Reste à charge potentiel
            </div>
            <div className="mt-1 font-display text-4xl font-extrabold text-green">
              {formatEUR(result.remainingCostHT)}{" "}
              <span className="text-lg font-semibold text-ink-faint">HT</span>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-3 rounded-lg bg-navy-soft px-4 py-3 text-sm text-navy">
          Ajoutez {formatEUR(result.missingToThresholdHT)} pour atteindre le seuil
          minimum d&apos;investissement ({formatEUR(result.thresholdHT)} HT).
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Estimation indicative, taux standard {Math.round(result.rate * 100)} %.
        L&apos;attribution dépend de l&apos;éligibilité de l&apos;entreprise, de la
        conformité de l&apos;investissement, des plafonds applicables et de
        l&apos;acceptation du dossier.
      </p>
    </div>
  );
}
