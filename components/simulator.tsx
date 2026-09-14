"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Check,
  CheckCircle2,
  PartyPopper,
  Sparkles,
  Store,
  UtensilsCrossed,
  Factory,
  HardHat,
  HeartPulse,
  Briefcase,
  Truck,
  Wheat,
  Scissors,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { calculateSubsidy } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";
import { RISK_CATEGORIES, getProductsByOfficialGroup, type RiskCategory } from "@/lib/products";
import { OFFICIAL_GROUP_ICONS } from "@/components/category-icons";
import { ProductCard } from "@/components/product-card";
import { OFFICIAL_EQUIPMENT_GROUPS, type OfficialEquipmentGroup } from "@/lib/aid-programs/types";

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
  | "secteur"
  | "besoin"
  | "equipement"
  | "budget"
  | "conditions"
  | "calculating"
  | "result"
  | "lead-prenom"
  | "lead-nom"
  | "lead-entreprise"
  | "lead-telephone"
  | "lead-codepostal"
  | "lead-email"
  | "thanks";

const FULL_QUESTION_ORDER: Screen[] = ["effectif", "secteur", "besoin", "equipement", "budget", "conditions"];
const PREFILLED_QUESTION_ORDER: Screen[] = ["effectif", "conditions"];

const EFFECTIF_OPTIONS = [
  { value: "1-9", label: "1 à 9 salariés" },
  { value: "10-49", label: "10 à 49 salariés" },
  { value: "50-199", label: "50 à 199 salariés" },
  { value: "200+", label: "200 salariés et plus" },
];

const SECTEUR_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "commerce", label: "Commerce", icon: Store },
  { value: "hotellerie-restauration", label: "Hôtellerie / restauration", icon: UtensilsCrossed },
  { value: "industrie", label: "Industrie", icon: Factory },
  { value: "btp", label: "BTP", icon: HardHat },
  { value: "sante", label: "Santé", icon: HeartPulse },
  { value: "services", label: "Services", icon: Briefcase },
  { value: "logistique", label: "Logistique", icon: Truck },
  { value: "agriculture", label: "Agriculture", icon: Wheat },
  { value: "coiffure-esthetique", label: "Coiffure / esthétique", icon: Scissors },
  { value: "autre", label: "Autre", icon: MoreHorizontal },
];

const BESOIN_OPTIONS: { value: string; label: string; groups: OfficialEquipmentGroup[] }[] = [
  { value: "manutention-charges", label: "Manutention de charges", groups: ["roulants"] },
  { value: "postures", label: "Postures difficiles", groups: ["plans-de-travail"] },
  { value: "vibrations", label: "Vibrations", groups: ["outils-vibrations"] },
  { value: "deplacement-materiel", label: "Déplacement de matériel", groups: ["roulants", "transfert"] },
  { value: "nettoyage", label: "Nettoyage professionnel", groups: ["specifiques"] },
  { value: "transfert-personnes", label: "Transfert de personnes", groups: ["transfert"] },
  { value: "organisation-poste", label: "Organisation du poste de travail", groups: ["plans-de-travail", "outils-vibrations"] },
  { value: "autre", label: "Autre", groups: [] },
];

const BUDGET_PRESETS = [500, 750, 1000, 1500, 2000];

function trackEvent(name: string, data: Record<string, string | number>) {
  // Point d'accroche pour un futur outil d'analytics — jamais de PII ici
  // (pas de nom, email, téléphone, code postal ou SIRET).
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
                className={"h-1.5 w-1.5 rounded-full " + (i <= stepIndex ? "bg-navy" : "bg-line")}
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

type ConditionsAnswer = "oui" | "incertain";
type Tier = "compatible" | "potentiel" | "non-identifie";

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
  const [secteur, setSecteur] = useState<string>();
  const [besoin, setBesoin] = useState<string>();
  const [equipementGroup, setEquipementGroup] = useState<OfficialEquipmentGroup>();
  const [amountHT, setAmountHT] = useState(isPrefilled ? (prefillAmount as number) : 1000);
  const [conditionsAnswer, setConditionsAnswer] = useState<ConditionsAnswer>();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [telephone, setTelephone] = useState("");
  const [codePostal, setCodePostal] = useState("");
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
  const besoinOption = BESOIN_OPTIONS.find((b) => b.value === besoin);
  const equipementGroupLabel = OFFICIAL_EQUIPMENT_GROUPS.find((g) => g.id === equipementGroup)?.label;
  const availableGroups = besoinOption && besoinOption.groups.length > 0
    ? OFFICIAL_EQUIPMENT_GROUPS.filter((g) => besoinOption.groups.includes(g.id))
    : OFFICIAL_EQUIPMENT_GROUPS;

  const tier: Tier = !result.eligible ? "non-identifie" : conditionsAnswer === "oui" ? "compatible" : "potentiel";

  const matchedProducts = equipementGroup ? getProductsByOfficialGroup(equipementGroup).slice(0, 3) : [];

  // Écran "on calcule..." : révèle 3 coches puis avance seul, 1,4s max.
  useEffect(() => {
    if (screen !== "calculating") return;
    const timers = [setTimeout(() => push("result"), 1400)];
    return () => timers.forEach(clearTimeout);
  }, [screen]);

  useEffect(() => {
    if (screen === "result") {
      trackEvent("simulator_result", {
        effectif: effectif ?? "",
        secteur: secteur ?? "",
        besoin: besoin ?? "",
        tier,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const questionOrder = isPrefilled ? PREFILLED_QUESTION_ORDER : FULL_QUESTION_ORDER;

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
              Des équipements professionnels jusqu&apos;à 70&nbsp;% financés*
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-ink-soft">
              Vérifiez gratuitement en quelques minutes si votre entreprise
              peut bénéficier d&apos;une aide pour financer certains
              équipements de prévention.
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
              Tester mon éligibilité
            </button>
            <p className="mt-3 font-mono text-[0.7rem] text-ink-faint">
              Environ 2 minutes. *Simulation indicative, voir conditions.
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
              Combien de salariés compte votre entreprise&nbsp;?
            </h2>
            <div className="mt-6 flex flex-col gap-2.5">
              {EFFECTIF_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt.value}
                  title={opt.label}
                  selected={effectif === opt.value}
                  onClick={() =>
                    selectAndAdvance(setEffectif, opt.value, isPrefilled ? "conditions" : "secteur")
                  }
                />
              ))}
            </div>
          </div>
        )}

        {screen === "secteur" && (
          <div>
            <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Votre secteur d&apos;activité&nbsp;?
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {SECTEUR_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt.value}
                  icon={opt.icon}
                  title={opt.label}
                  selected={secteur === opt.value}
                  onClick={() => selectAndAdvance(setSecteur, opt.value, "besoin")}
                />
              ))}
            </div>
          </div>
        )}

        {screen === "besoin" && (
          <div>
            <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Que souhaitez-vous améliorer&nbsp;?
            </h2>
            <div className="mt-5 flex flex-col gap-2">
              {BESOIN_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt.value}
                  title={opt.label}
                  selected={besoin === opt.value}
                  onClick={() => selectAndAdvance(setBesoin, opt.value, "equipement")}
                />
              ))}
            </div>
          </div>
        )}

        {screen === "equipement" && (
          <div>
            <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Quel type d&apos;équipement recherchez-vous&nbsp;?
            </h2>
            <p className="mt-2 text-center text-xs text-ink-faint">
              Catégories officiellement reconnues par le dispositif, filtrées selon votre besoin.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {availableGroups.map((g) => (
                <ChoiceCard
                  key={g.id}
                  icon={OFFICIAL_GROUP_ICONS[g.id]}
                  title={g.label}
                  selected={equipementGroup === g.id}
                  onClick={() => selectAndAdvance(setEquipementGroup, g.id, "budget")}
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
              onClick={() => push("conditions")}
              className="mt-8 w-full rounded-full bg-navy py-4 font-display font-semibold text-white hover:bg-navy-deep"
            >
              Continuer
            </button>
          </div>
        )}

        {screen === "conditions" && (
          <div>
            <h2 className="text-balance text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Deux conditions à vérifier
            </h2>
            <div className="mt-5 rounded-2xl border border-line bg-paper-raised p-5 text-sm text-ink-soft">
              <ul className="flex flex-col gap-2">
                <li>— L&apos;équipement est neuf (jamais utilisé).</li>
                <li>— L&apos;achat sera réalisé en 2026.</li>
              </ul>
            </div>
            <div className="mt-5 flex flex-col gap-2.5">
              <ChoiceCard
                title="Oui, mon projet respecte ces deux conditions"
                selected={conditionsAnswer === "oui"}
                onClick={() => selectAndAdvance(setConditionsAnswer, "oui", "calculating")}
              />
              <ChoiceCard
                title="Je ne sais pas encore"
                selected={conditionsAnswer === "incertain"}
                onClick={() => selectAndAdvance(setConditionsAnswer, "incertain", "calculating")}
              />
            </div>
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
            {tier !== "non-identifie" ? (
              <>
                <h2 className="flex items-center justify-center gap-2 text-center font-display text-2xl font-bold text-ink">
                  {tier === "compatible" ? (
                    <>
                      Votre projet semble potentiellement éligible <PartyPopper className="h-6 w-6 text-green" />
                    </>
                  ) : (
                    "Voici votre estimation"
                  )}
                </h2>
                <div className="mt-2 flex justify-center">
                  <span
                    className={
                      "rounded-full px-3 py-1 font-mono text-xs font-medium " +
                      (tier === "compatible" ? "bg-green-soft text-green" : "bg-navy-soft text-navy")
                    }
                  >
                    {tier === "compatible" ? "🟢 Critères identifiés comme compatibles" : "🟠 Éligibilité potentielle — vérification nécessaire"}
                  </span>
                </div>
                {(effectifLabel || equipementGroupLabel) && (
                  <p className="mt-2 text-center text-sm text-ink-soft">
                    {equipementGroupLabel && `Pour votre projet de ${equipementGroupLabel.toLowerCase()}`}
                    {equipementGroupLabel && effectifLabel && ", "}
                    {effectifLabel && `entreprise de ${effectifLabel.toLowerCase()}`}.
                  </p>
                )}

                <div className="mt-6 rounded-2xl border border-line bg-paper-raised p-6 shadow-card">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase text-ink-faint">Montant équipement</span>
                    <span className="font-mono font-semibold text-ink">{formatEUR(amountHT)} HT</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase text-ink-faint">Taux applicable estimé</span>
                    <span className="font-mono font-semibold text-ink">{Math.round(result.rate * 100)} %</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase text-ink-faint">Aide potentielle</span>
                    <span className="font-mono font-semibold text-green">{formatEUR(result.subsidyEstimate)}</span>
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

                <p className="mt-4 text-center text-xs text-ink-faint">
                  Cette estimation ne constitue pas une décision d&apos;attribution. Votre dossier doit être
                  validé par l&apos;organisme compétent. Plateforme indépendante — nous ne sommes ni
                  l&apos;Assurance Maladie, ni une Carsat, ni un organisme public.
                </p>

                {matchedProducts.length > 0 && (
                  <div className="mt-6">
                    <p className="text-center font-display text-sm font-semibold text-ink">
                      Équipements compatibles avec votre besoin
                    </p>
                    <div className="mt-3 grid gap-3">
                      {matchedProducts.map((p) => (
                        <ProductCard key={p.slug} product={p} />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => push("lead-prenom")}
                  className="mt-6 w-full rounded-full bg-navy py-4 font-display font-semibold text-white hover:bg-navy-deep"
                >
                  Préparer mon dossier
                </button>
                <p className="mt-2 text-center font-mono text-[0.7rem] text-ink-faint">
                  Sans engagement · Réponse personnalisée
                </p>
              </>
            ) : (
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-ink">Voici votre estimation</h2>
                <div className="mt-2 flex justify-center">
                  <span className="rounded-full bg-alert-soft px-3 py-1 font-mono text-xs font-medium text-alert">
                    🔴 Non identifié selon les informations fournies
                  </span>
                </div>
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
            onSubmit={() => push("lead-nom")}
          />
        )}

        {screen === "lead-nom" && (
          <LeadStep
            question="Et votre nom ?"
            value={nom}
            onChange={setNom}
            placeholder="Nom"
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
            onSubmit={() => push("lead-codepostal")}
          />
        )}

        {screen === "lead-codepostal" && (
          <LeadStep
            question="Code postal de votre entreprise ?"
            value={codePostal}
            onChange={setCodePostal}
            placeholder="Code postal"
            type="text"
            onSubmit={() => push("lead-email")}
          />
        )}

        {screen === "lead-email" && (
          <LeadStep
            question="Où pouvons-nous vous envoyer votre estimation détaillée ?"
            value={email}
            onChange={setEmail}
            placeholder="E-mail professionnel"
            type="email"
            reassurance
            submitLabel="Recevoir mon étude"
            onSubmit={() => push("thanks")}
          />
        )}

        {screen === "thanks" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Sparkles className="h-8 w-8 text-green" />
            <h2 className="font-display text-2xl font-bold text-ink">Merci{prenom && ` ${prenom}`} !</h2>
            <p className="max-w-sm text-ink-soft">
              Votre demande a bien été transmise. Un conseiller EQUIPVENTION revient vers vous rapidement pour
              affiner votre estimation et préparer votre dossier.
            </p>
            <div className="mt-2 w-full rounded-2xl border border-line bg-paper-raised p-5 text-left text-sm text-ink-soft">
              <p className="font-display font-semibold text-ink">Et pour le dépôt officiel ?</p>
              <p className="mt-2">
                EQUIPVENTION prépare votre dossier mais ne dépose rien à votre place. Les entreprises déposent
                leur demande via leur compte sur{" "}
                <a href="https://www.net-entreprises.fr/" target="_blank" rel="noreferrer" className="text-navy underline">
                  net-entreprises.fr
                </a>{" "}
                (rubrique « Votre entreprise › Demander une subvention ») ; les travailleurs indépendants,
                par e-mail auprès de leur caisse régionale.
              </p>
            </div>
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
