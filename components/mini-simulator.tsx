"use client";

import { useState } from "react";
import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";

const EFFECTIF_OPTIONS = [
  { value: "1-9", label: "1–9" },
  { value: "10-49", label: "10–49" },
  { value: "50+", label: "50+" },
];

/**
 * Simulateur compact intégré à la fiche produit — calcul instantané, sans
 * quitter la page. Le prix est déjà connu (celui du produit) ; on ne
 * redemande que l'effectif. Utilise le même moteur que le simulateur
 * complet (lib/subventions.ts), taux standard uniquement.
 */
export function MiniSimulator({ amountHT }: { amountHT: number }) {
  const [effectif, setEffectif] = useState<string>();
  const result = calculateSubsidy(amountHT);

  return (
    <div className="rounded-card border border-line bg-paper-raised p-5">
      <h3 className="font-display text-sm font-semibold text-ink">
        Combien vous coûterait réellement cet équipement&nbsp;?
      </h3>
      <p className="mt-1 text-xs text-ink-faint">Votre effectif</p>
      <div className="mt-2 flex gap-2">
        {EFFECTIF_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setEffectif(opt.value)}
            className={
              "flex-1 rounded-full border px-3 py-2 font-mono text-sm transition-colors " +
              (effectif === opt.value
                ? "border-navy bg-navy text-white"
                : "border-line text-ink-soft hover:border-navy/40")
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {effectif && (
        <div className="animate-check-in mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
          <div>
            <div className="font-mono text-[0.65rem] uppercase text-ink-faint">Aide potentielle</div>
            <div className="mt-1 font-mono text-lg font-semibold text-green">
              {result.eligible ? formatEUR(result.subsidyEstimate) : "—"}
            </div>
          </div>
          <div>
            <div className="font-mono text-[0.65rem] uppercase text-ink-faint">Reste à charge estimé</div>
            <div className="mt-1 font-mono text-lg font-semibold text-navy">
              {result.eligible ? formatEUR(result.remainingCostHT) : formatEUR(amountHT)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
