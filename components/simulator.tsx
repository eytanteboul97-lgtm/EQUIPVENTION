"use client";

import { useMemo, useState } from "react";
import { calculateSubsidy, BRANCH_OVERRIDES, RATE_STANDARD } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";
import { PartyPopper, Sparkles } from "lucide-react";

const EFFECTIF_OPTIONS = [
  { value: "1-9", label: "1 à 9 salariés" },
  { value: "10-49", label: "10 à 49 salariés" },
  { value: "50-199", label: "50 à 199 salariés" },
];

export function Simulator() {
  const [effectif, setEffectif] = useState(EFFECTIF_OPTIONS[0].value);
  const [branchCode, setBranchCode] = useState<string>("standard");
  const [amountHT, setAmountHT] = useState(1200);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => calculateSubsidy(amountHT, branchCode === "standard" ? undefined : branchCode),
    [amountHT, branchCode]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card sm:p-8">
        <div className="font-mono text-xs uppercase tracking-wide text-ink-faint">
          Étape 1 — votre entreprise
        </div>

        <label className="mt-5 block text-sm font-medium text-ink">
          Effectif
          <select
            value={effectif}
            onChange={(e) => setEffectif(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink"
          >
            {EFFECTIF_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-ink">
          Secteur / branche
          <select
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink"
          >
            <option value="standard">Standard — taux {Math.round(RATE_STANDARD * 100)} %</option>
            {BRANCH_OVERRIDES.map((b) => (
              <option key={b.code} value={b.code}>
                {b.label} — taux {Math.round(b.rate * 100)} %
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6 font-mono text-xs uppercase tracking-wide text-ink-faint">
          Étape 2 — votre projet d&apos;équipement
        </div>
        <label className="mt-3 block text-sm font-medium text-ink">
          Montant du devis (équipement, quantité incluse), HT
        </label>
        <input
          type="range"
          min={100}
          max={5000}
          step={10}
          value={amountHT}
          onChange={(e) => setAmountHT(Number(e.target.value))}
          className="mt-3 w-full accent-green"
        />
        <div className="mt-2 font-mono text-2xl font-bold text-ink">{formatEUR(amountHT)}</div>
      </div>

      <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card sm:p-8">
        {result.eligible ? (
          <>
            <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <PartyPopper className="h-5 w-5 text-green" />
              Bonne nouvelle
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Votre projet semble potentiellement éligible.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <dt className="font-mono text-xs uppercase text-ink-faint">Investissement</dt>
                <dd className="font-mono text-lg font-semibold text-ink">{formatEUR(amountHT)} HT</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase text-ink-faint">Aide potentielle</dt>
                <dd className="font-mono text-lg font-semibold text-green">
                  {formatEUR(result.subsidyEstimate)}
                </dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-line pt-5">
              <div className="font-mono text-xs uppercase text-ink-faint">Reste potentiel</div>
              <div className="mt-1 font-display text-4xl font-extrabold text-navy">
                {formatEUR(result.remainingCostHT)}{" "}
                <span className="text-lg font-semibold text-ink-faint">HT</span>
              </div>
              {result.cappedByPlafond && (
                <p className="mt-2 text-xs text-ink-faint">
                  Estimation plafonnée au montant maximum du dispositif.
                </p>
              )}
            </div>

            {!showLeadForm && !submitted && (
              <button
                onClick={() => setShowLeadForm(true)}
                className="mt-6 w-full rounded-full bg-navy py-3 font-display font-semibold text-white hover:bg-navy-deep"
              >
                Recevoir mon estimation
              </button>
            )}

            {showLeadForm && !submitted && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="mt-6 space-y-3 border-t border-line pt-6"
              >
                <div className="font-mono text-xs uppercase tracking-wide text-green">
                  Plus qu&apos;une étape avant votre estimation détaillée
                </div>
                <input required placeholder="Nom" className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                <input required placeholder="Société" className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                <input required placeholder="SIRET" className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                <input required type="email" placeholder="E-mail" className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                <input required type="tel" placeholder="Téléphone" className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                <button
                  type="submit"
                  className="w-full rounded-full bg-green py-3 font-display font-semibold text-white hover:bg-green/90"
                >
                  Envoyer ma demande
                </button>
              </form>
            )}

            {submitted && (
              <div className="mt-6 flex items-start gap-3 rounded-lg bg-green-soft p-4 text-sm text-ink">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                <p>
                  Merci ! Votre demande d&apos;effectif « {EFFECTIF_OPTIONS.find((o) => o.value === effectif)?.label} »
                  a bien été enregistrée. Un conseiller EQUIPVENTION revient vers vous pour affiner l&apos;estimation.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg bg-navy-soft p-5 text-navy">
            <p className="font-display font-semibold">Seuil minimum non atteint</p>
            <p className="mt-2 text-sm">
              Augmentez le montant du devis d&apos;au moins {formatEUR(result.missingToThresholdHT)} pour
              dépasser le seuil de {formatEUR(result.thresholdHT)} HT et déclencher la subvention plancher.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
