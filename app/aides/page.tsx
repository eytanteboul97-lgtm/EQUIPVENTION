import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LinkButton } from "@/components/ui/button";
import { ProductPrice } from "@/components/product-price";
import { FIPU, getEquipmentByGroup } from "@/lib/aid-programs/fipu";
import { OFFICIAL_EQUIPMENT_GROUPS } from "@/lib/aid-programs/types";
import { PLAFOND_GLOBAL_200_ET_PLUS, PLAFOND_GLOBAL_MOINS_200 } from "@/lib/subventions";
import { formatEUR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Comment fonctionne l'aide — EQUIPVENTION",
  description: "Comment fonctionne la subvention de prévention des risques professionnels, quels équipements sont concernés, et comment est calculé le reste à charge.",
};

export default function AidesPage() {
  const mandatoryDocs = FIPU.requiredDocuments.filter((d) => d.mandatory);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">Les aides</span>
        <h1 className="mt-3 text-balance font-display text-3xl font-bold text-ink md:text-4xl">
          Comment fonctionne l&apos;aide sur vos équipements
        </h1>
        <p className="mt-4 text-ink-soft">
          Plateforme indépendante. Nous ne sommes ni l&apos;Assurance
          Maladie, ni une Carsat, ni un organisme public. Cette page explique
          le mécanisme du dispositif « {FIPU.name} », auquel certains de nos
          équipements peuvent être éligibles.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Le principe</h2>
            <p className="mt-2 text-sm text-ink-soft">
              L&apos;entreprise peut bénéficier de la subvention à hauteur de{" "}
              <b className="text-ink">{Math.round(FIPU.standardRate.rate * 100)} %</b> des
              investissements réalisés, avec une subvention minimum de{" "}
              <b className="text-ink">{formatEUR(FIPU.minimumGrant.amount)}</b> — ce qui suppose un
              investissement d&apos;au moins{" "}
              <b className="text-ink">{formatEUR(FIPU.minimumExpense.amount)} HT</b>.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-ink-faint">
                    <th className="pb-2 pr-4 font-display">Type d&apos;investissement</th>
                    <th className="pb-2 pr-4 font-display">Plafond par type</th>
                    <th className="pb-2 pr-4 font-display">&lt; 200 salariés</th>
                    <th className="pb-2 font-display">≥ 200 salariés</th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft">
                  <tr className="border-t border-line">
                    <td className="py-2 pr-4">Actions de prévention (diagnostic, formation, équipements)</td>
                    <td className="py-2 pr-4 font-mono">{formatEUR(25_000)}</td>
                    <td className="py-2 pr-4 font-mono">{formatEUR(PLAFOND_GLOBAL_MOINS_200)}</td>
                    <td className="py-2 font-mono">{formatEUR(PLAFOND_GLOBAL_200_ET_PLUS)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              Période 2024–2027. Le plafond de {formatEUR(PLAFOND_GLOBAL_200_ET_PLUS)} pour les
              entreprises de 200 salariés et plus correspond au même montant que le plafond par
              type d&apos;investissement : pas de marge supplémentaire pour d&apos;autres types
              d&apos;investissement dans leur cas.
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Quels équipements</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Seuls les équipements neufs et conformes au cahier des charges technique du
              dispositif sont pris en charge. Voici les catégories officiellement reconnues :
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {OFFICIAL_EQUIPMENT_GROUPS.map((group) => (
                <div key={group.id}>
                  <h3 className="font-display text-sm font-semibold text-ink">{group.label}</h3>
                  <ul className="mt-1.5 flex flex-col gap-1 text-sm text-ink-soft">
                    {getEquipmentByGroup(group.id).map((eq) => (
                      <li key={eq.id}>— {eq.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-faint">
              Le fait qu&apos;une catégorie soit reconnue ne garantit pas qu&apos;une référence
              commerciale précise le soit — chaque produit reste à vérifier individuellement contre
              le cahier des charges technique.
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Comment est calculé le reste à charge</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Reste à charge estimé = prix HT − (prix HT × taux applicable), plafonné au montant
              maximum du dispositif. C&apos;est exactement le calcul que vous voyez sur chaque
              fiche produit et dans le simulateur — jamais deux chiffres différents pour la même
              chose.
            </p>
            <div className="mt-4 max-w-xs">
              <ProductPrice amountHT={750} compact />
            </div>
          </div>

          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Justificatifs à réunir</h2>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-ink-soft">
              {mandatoryDocs.map((d) => (
                <li key={d.id}>
                  — <b className="text-ink">{d.name}</b>
                  {!d.verified && <span className="ml-1 text-xs text-alert">(à confirmer)</span>}
                  <div className="text-xs text-ink-faint">{d.description}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Comment déposer sa demande</h2>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-ink-soft">
              {FIPU.submissionNotes.map((n, i) => (
                <li key={i}>— {n.text}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-navy-soft p-6 text-navy">
            <h2 className="font-display text-lg font-bold">Important</h2>
            <p className="mt-2 text-sm">
              Le montant affiché est toujours une <b>estimation</b>. Cette estimation ne constitue
              pas une décision d&apos;attribution — l&apos;aide réelle dépend de l&apos;éligibilité
              de l&apos;entreprise, de la conformité de l&apos;investissement, des plafonds en
              vigueur et de l&apos;acceptation du dossier par l&apos;organisme compétent.
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">D&apos;où viennent nos informations&nbsp;?</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Informations vérifiées à partir de sources publiques officielles — jamais inventées.
              EQUIPVENTION n&apos;est pas partenaire de ces organismes.
            </p>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              <li>
                <a href={FIPU.officialSourceUrl} target="_blank" rel="noreferrer" className="text-navy underline">
                  {FIPU.organism} — {FIPU.name}
                </a>
              </li>
            </ul>
            <p className="mt-3 font-mono text-xs text-ink-faint">
              Dernière vérification : {FIPU.lastVerifiedAt}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <LinkButton href="/catalogue" size="lg">
            Voir les équipements concernés
          </LinkButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
