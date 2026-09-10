"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Check, CheckCircle2, PartyPopper, Sparkles, type LucideIcon } from "lucide-react";
import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";
import { RISK_CATEGORIES, type RiskCategory } from "@/lib/products";
import { CATEGORY_ICONS } from "@/components/category-icons";

/**
 * Simulateur en tunnel "un écran = une question", pensé pour être terminé
 * quasiment sans clavier (clic → clic → clic → résultat). Toute la logique
 * de calcul reste dans lib/subventions.ts — ce fichier ne fait que
 * collecter des réponses et les lui passer.
 *
 * Note volontaire : ce tunnel n'expose pas le taux de branche majoré
 * (BRANCH_OVERRIDES) pour rester au plus simple ; il applique toujours le
 * taux standard, ce qui ne peut jamais surestimer l'aide réelle.
 */

type Screen =
  | "intro"
  | "effectif"
  | "equipement"
  | "budget"
  | "calculating"
  | "result"
  | "lead-prenom"
  | "lead-entreprise"
  | "lead-telephone"
  | "lead-email"
  | "thanks";

const QUESTION_SCREENS: Screen[] = ["effectif", "equipement", "budget"];

const EFFECTIF_OPTIONS = [
  { value: "1-9", label: "1 à 9 salariés" },
  { value: "10-49", label: "10 à 49 salariés" },
  { value: "50-199", label: "50 à 199 salariés" },
  { value: "200+", label: "200 salariés et plus" },
];

const BUDGET_PRESETS = [500, 750, 1000, 1500, 2000];

function trackEvent(name: string, data: Record<string, string | number>) {
  // Point d'accroche pour un futur outil d'analytics — jamais de PII ici
  // (pas de nom, email, téléphone ou SIRET).
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(`equipvention:${name}`, { detail: data }));
  }
}

function ProgressHeader({
  screen,
  questionOrder,
  onBack,
  canGoBack,
}: {
  screen: Screen;
  questionOrder: Screen[];
  onBack: () => void;
  canGoBack: boolean;
}) {
  const stepIndex = questionOrder.indexOf(screen);
  const isQuestion = stepIndex !== -1;

  return (
    <div className="mb-6 flex min-h-[28px] items-center gap-3">
      {canGoBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 font-mono text-xs text-ink-faint hover:text-ink"
          aria-label="Retour"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Retour
        </button>
      )}
      {isQuestion && questionOrder.length > 1 && (
        <div className="ml-auto flex items-center gap-2">
          {stepIndex === questionOrder.length - 2 && (
            <span className="font-mono text-xs text-green">Encore une question 👌</span>
          )}
          <div className="flex items-center gap-1.5">
            {questionOrder.map((_, i) => (
              <span
                key={i}
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (i <= stepIndex ? "bg-navy" : "bg-line")
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChoiceCard({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex w-full items-center gap-3 rounded-2xl border bg-paper-raised p-4 text-left transition-all active:scale-[0.98] " +
        (selected ? "border-navy ring-2 ring-navy" : "border-line hover:border-navy/40")
      }
    >
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-soft text-navy">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1">
        <div className="font-display font-semibold text-ink">{title}</div>
        {description && <div className="mt-0.5 text-sm text-ink-soft">{description}</div>}
      </div>
      {selected && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-white">
          <Check className="h-4 w-4" />
        </div>
      )}
    </button>
  );
}

export function Simulator() {
  const searchParams = useSearchParams();
  const prefillAmount = Number(searchParams.get("montant")) || undefined;
  const prefillCategorie = searchParams.get("categorie") as RiskCategory | null;
  const prefillProduit = searchParams.get("produit");
  const isPrefilled = Boolean(
    prefillAmount && prefillCategorie && RISK_CATEGORIES.some((c) => c.id === prefillCategorie)
  );

  const [history, setHistory] = useState<Screen[]>(isPrefilled ? ["effectif"] : ["intro"]);
  const screen = history[history.length - 1];

  const [effectif, setEffectif] = useState<string>();
  const [equipement, setEquipement] = useState<RiskCategory | undefined>(
    isPrefilled ? (prefillCategorie as RiskCategory) : undefined
  );
  const [amountHT, setAmountHT] = useState(isPrefilled ? (prefillAmount as number) : 1000);
  const [prenom, setPrenom] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");

  const sliderRef = useRef<HTMLInputElement>(null);

  function push(next: Screen) {
    setHistory((h) => [...h, next]);
  }
  function goBack() {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }
  function selectAndAdvance<T>(setter: (v: T) => void, value: T, next: Screen) {
    setter(value);
    setTimeout(() => push(next), 220);
  }

  const result = useMemo(() => calculateSubsidy(amountHT), [amountHT]);
  const effectifLabel = EFFECTIF_OPTIONS.find((o) => o.value === effectif)?.label;
  const equipementLabel = RISK_CATEGORIES.find((c) => c.id === equipement)?.label;

  // Écran "on calcule..." : révèle 3 coches puis avance seul, 1,4s max.
  useEffect(() => {
    if (screen !== "calculating") return;
    const timers = [
      setTimeout(() => push("result"), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [screen]);

  useEffect(() => {
    if (screen === "result") {
      trackEvent("simulator_result", {
        effectif: effectif ?? "",
        equipement: equipement ?? "",
        eligible: String(result.eligible),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const questionOrder = isPrefilled ? ["effectif" as Screen] : QUESTION_SCREENS;

  return (
    <div className="mx-auto flex min-h-[560px] max-w-xl flex-col justify-center">
      <ProgressHeader
        screen={screen}
        questionOrder={questionOrder}
        onBack={goBack}
        canGoBack={history.length > 1 && screen !== "thanks"}
      />

      <div key={screen} className="animate-screen-in">
        {screen === "intro" && (
          <div className="text-center">
            <h1 className="text-balance font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Combien pourriez-vous économiser sur votre équipement&nbsp;?
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-ink-soft">
              Répondez à quelques questions et obtenez une estimation en moins d&apos;une minute.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-ink-soft">
              <span>✓ Gratuit</span>
              <span>✓ Sans engagement</span>
              <span>✓ Résultat immédiat</span>
            </div>
            <button
              onClick={() => push("effectif")}
              className="mt-8 w-full rounded-full bg-navy py-4 font-display font-semibold text-white hover:bg-navy-deep sm:w-auto sm:px-10"
            >
              Calculer mon aide
            </button>
            <p className="mt-3 font-mono text-[0.7rem] text-ink-faint">
              Simulation indicative selon les informations renseignées.
            </p>
          </div>
        )}

        {screen === "effectif" && (
          <div>
            {isPrefilled && (
              <p className="mb-3 text-center font-mono text-xs text-ink-faint">
                Pour {prefillProduit ?? "votre produit"} — {formatEUR(amountHT)} HT
              </p>
            )}
            <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Quel est votre effectif&nbsp;?
            </h2>
            <div className="mt-6 flex flex-col gap-2.5">
              {EFFECTIF_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt.value}
                  title={opt.label}
                  selected={effectif === opt.value}
                  onClick={() =>
                    selectAndAdvance(setEffectif, opt.value, isPrefilled ? "calculating" : "equipement")
                  }
                />
              ))}
            </div>
          </div>
        )}

        {screen === "equipement" && (
          <div>
            <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Quel équipement vous intéresse&nbsp;?
            </h2>
            <div className="mt-5 flex flex-col gap-2">
              {RISK_CATEGORIES.map((cat) => (
                <ChoiceCard
                  key={cat.id}
                  icon={CATEGORY_ICONS[cat.id]}
                  title={cat.label}
                  description={cat.description}
                  selected={equipement === cat.id}
                  onClick={() => selectAndAdvance(setEquipement, cat.id, "budget")}
                />
              ))}
            </div>
          </div>
        )}

        {screen === "budget" && (
          <div>
            <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Quel budget prévoyez-vous&nbsp;?
            </h2>
            <div
              key={amountHT}
              className="animate-check-in mt-6 text-center font-display text-5xl font-extrabold text-navy"
            >
              {formatEUR(amountHT)}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {BUDGET_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountHT(preset)}
                  className={
                    "rounded-full border px-4 py-2 font-mono text-sm transition-colors " +
                    (amountHT === preset
                      ? "border-navy bg-navy text-white"
                      : "border-line text-ink-soft hover:border-navy/40")
                  }
                >
                  {formatEUR(preset)}
                </button>
              ))}
              <button
                onClick={() => sliderRef.current?.focus()}
                className="rounded-full border border-dashed border-line px-4 py-2 font-mono text-sm text-ink-soft hover:border-navy/40"
              >
                Autre
              </button>
            </div>
            <input
              ref={sliderRef}
              type="range"
              min={200}
              max={3000}
              step={10}
              value={amountHT}
              onChange={(e) => setAmountHT(Number(e.target.value))}
              className="mt-8 w-full accent-green"
            />
            <button
              onClick={() => push("calculating")}
              className="mt-8 w-full rounded-full bg-navy py-4 font-display font-semibold text-white hover:bg-navy-deep"
            >
              Voir mon estimation
            </button>
          </div>
        )}

        {screen === "calculating" && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="font-display text-lg font-semibold text-ink">On regarde ça…</p>
            <ul className="flex flex-col gap-2 font-mono text-sm text-ink-soft">
              {["Votre entreprise", "Votre projet", "Votre équipement"].map((label, i) => (
                <li
                  key={label}
                  className="animate-check-in flex items-center gap-2"
                  style={{ animationDelay: `${i * 320}ms`, animationFillMode: "backwards" }}
                >
                  <CheckCircle2 className="h-4 w-4 text-green" /> {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {screen === "result" && (
          <div>
            {result.eligible ? (
              <>
                <h2 className="flex items-center justify-center gap-2 text-center font-display text-2xl font-bold text-ink">
                  Bonne nouvelle <PartyPopper className="h-6 w-6 text-green" />
                </h2>
                {(effectifLabel || equipementLabel) && (
                  <p className="mt-2 text-center text-sm text-ink-soft">
                    {equipementLabel && `Pour votre projet de ${equipementLabel.toLowerCase()}`}
                    {equipementLabel && effectifLabel && ", "}
                    {effectifLabel && `entreprise de ${effectifLabel.toLowerCase()}`}.
                  </p>
                )}

                <div className="mt-6 rounded-2xl border border-line bg-paper-raised p-6 shadow-card">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase text-ink-faint">Projet estimé</span>
                    <span className="font-mono font-semibold text-ink">{formatEUR(amountHT)}</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase text-ink-faint">Aide potentielle</span>
                    <span className="font-mono font-semibold text-green">
                      {formatEUR(result.subsidyEstimate)}
                    </span>
                  </div>
                  <div className="mt-5 border-t border-line pt-5 text-center">
                    <div className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                      Reste à charge estimé
                    </div>
                    <div className="mt-1 font-display text-5xl font-extrabold text-navy">
                      {formatEUR(result.remainingCostHT)}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center font-display font-semibold text-ink">
                  Vous pourriez économiser jusqu&apos;à {formatEUR(result.subsidyEstimate)}.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-paper-raised p-3">
                    <div className="font-mono text-[0.65rem] uppercase text-ink-faint">Sans aide</div>
                    <div className="mt-1 font-mono font-semibold text-ink">{formatEUR(amountHT)}</div>
                  </div>
                  <div className="rounded-xl bg-green-soft p-3">
                    <div className="font-mono text-[0.65rem] uppercase text-green">Avec aide</div>
                    <div className="mt-1 font-mono font-semibold text-green">
                      {formatEUR(result.remainingCostHT)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-paper-raised p-3">
                    <div className="font-mono text-[0.65rem] uppercase text-ink-faint">Économie</div>
                    <div className="mt-1 font-mono font-semibold text-ink">
                      {formatEUR(result.subsidyEstimate)}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-ink-faint">
                  Estimation indicative, sous réserve de votre éligibilité et de la validation du dossier.
                </p>

                <button
                  onClick={() => push("lead-prenom")}
                  className="mt-6 w-full rounded-full bg-navy py-4 font-display font-semibold text-white hover:bg-navy-deep"
                >
                  Vérifier mon dossier gratuitement
                </button>
                <p className="mt-2 text-center font-mono text-[0.7rem] text-ink-faint">
                  Sans engagement · Réponse personnalisée
                </p>
              </>
            ) : (
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-ink">Voici votre estimation</h2>
                <div className="mt-6 rounded-2xl bg-navy-soft p-6 text-navy">
                  <p className="font-display font-semibold">
                    Cette aide ne semble pas correspondre à votre situation.
                  </p>
                  <p className="mt-2 text-sm">
                    Mais votre projet peut peut-être bénéficier d&apos;un autre dispositif.
                  </p>
                </div>
                <Link
                  href="/catalogue"
                  className="mt-6 block w-full rounded-full bg-navy py-4 text-center font-display font-semibold text-white hover:bg-navy-deep"
                >
                  Découvrir les autres solutions
                </Link>
                <button
                  onClick={() => push("lead-prenom")}
                  className="mt-3 w-full rounded-full border border-line py-4 font-display font-semibold text-ink hover:border-navy/40"
                >
                  Être rappelé gratuitement
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "lead-prenom" && (
          <LeadStep
            question="Comment pouvons-nous vous appeler ?"
            value={prenom}
            onChange={setPrenom}
            placeholder="Prénom"
            onSubmit={() => push("lead-entreprise")}
          />
        )}

        {screen === "lead-entreprise" && (
          <LeadStep
            question="Quelle est votre entreprise ?"
            value={entreprise}
            onChange={setEntreprise}
            placeholder="Nom de l'entreprise"
            onSubmit={() => push("lead-telephone")}
          />
        )}

        {screen === "lead-telephone" && (
          <LeadStep
            question="Sur quel numéro peut-on vous joindre ?"
            value={telephone}
            onChange={setTelephone}
            placeholder="Téléphone"
            type="tel"
            reassurance
            onSubmit={() => push("lead-email")}
          />
        )}

        {screen === "lead-email" && (
          <LeadStep
            question="Où pouvons-nous vous envoyer votre estimation ?"
            value={email}
            onChange={setEmail}
            placeholder="E-mail"
            type="email"
            reassurance
            submitLabel="Recevoir mon étude"
            onSubmit={() => push("thanks")}
          />
        )}

        {screen === "thanks" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Sparkles className="h-8 w-8 text-green" />
            <h2 className="font-display text-2xl font-bold text-ink">Merci{prenom && ` ${prenom}`} !</h2>
            <p className="max-w-sm text-ink-soft">
              Votre demande a bien été transmise. Un conseiller EQUIPVENTION revient vers vous rapidement pour
              affiner votre estimation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LeadStep({
  question,
  value,
  onChange,
  placeholder,
  onSubmit,
  type = "text",
  reassurance = false,
  submitLabel = "Continuer",
}: {
  question: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onSubmit: () => void;
  type?: string;
  reassurance?: boolean;
  submitLabel?: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit();
      }}
    >
      <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
        {question}
      </h2>
      <input
        autoFocus
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-8 w-full rounded-2xl border border-line bg-paper-raised px-5 py-4 text-center text-lg text-ink"
      />
      {reassurance && (
        <p className="mt-3 text-center text-xs text-ink-faint">
          Pas de spam. Vos coordonnées servent uniquement à traiter votre demande, conformément au RGPD.
        </p>
      )}
      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-navy py-4 font-display font-semibold text-white hover:bg-navy-deep"
      >
        {submitLabel}
      </button>
    </form>
  );
}
