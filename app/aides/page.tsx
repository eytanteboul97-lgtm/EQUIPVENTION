import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LinkButton } from "@/components/ui/button";
import { ProductPrice } from "@/components/product-price";

export const metadata: Metadata = {
  title: "Comment fonctionne l'aide — EQUIPVENTION",
  description: "Comment fonctionne la subvention de prévention des risques professionnels, quels équipements sont concernés, et comment est calculé le reste à charge.",
};

export default function AidesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">Les aides</span>
        <h1 className="mt-3 text-balance font-display text-3xl font-bold text-ink md:text-4xl">
          Comment fonctionne l&apos;aide sur vos équipements
        </h1>
        <p className="mt-4 text-ink-soft">
          EQUIPVENTION n&apos;est pas un site officiel de la CARSAT, de
          l&apos;Assurance Maladie ou de l&apos;État. Cette page explique le
          mécanisme des dispositifs de prévention des risques professionnels
          auxquels certains de nos équipements peuvent être éligibles.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Le principe</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Certains équipements de prévention (ergonomie, manutention,
              travail en hauteur…) peuvent ouvrir droit à une subvention
              couvrant une partie de leur coût — au taux standard de 70 % des
              dépenses éligibles, avec une subvention minimum de 500 €. En
              pratique, cela suppose un investissement d&apos;au moins ≈715 € HT.
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Quels équipements</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Seuls les équipements neufs et conformes au cahier des charges
              technique publié par l&apos;Assurance Maladie sont concernés.
              Chaque référence de notre catalogue est vérifiée individuellement
              avant sa mise en ligne — le fait qu&apos;une catégorie soit
              éligible ne garantit pas qu&apos;une référence précise le soit.
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Comment est calculé le reste à charge</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Reste à charge estimé = prix HT − (prix HT × taux applicable),
              plafonné au montant maximum du dispositif. C&apos;est exactement
              le calcul que vous voyez sur chaque fiche produit et dans le
              simulateur — jamais deux chiffres différents pour la même chose.
            </p>
            <div className="mt-4 max-w-xs">
              <ProductPrice amountHT={750} compact />
            </div>
          </div>

          <div className="rounded-card border border-line bg-navy-soft p-6 text-navy">
            <h2 className="font-display text-lg font-bold">Important</h2>
            <p className="mt-2 text-sm">
              Le montant affiché est toujours une <b>estimation</b>. L&apos;aide
              réelle dépend de l&apos;éligibilité de l&apos;entreprise, de la
              conformité de l&apos;investissement, des plafonds en vigueur et de
              l&apos;acceptation du dossier par l&apos;organisme compétent.
              Les entreprises déposent leur dossier via net-entreprises.fr ;
              les travailleurs indépendants, auprès de leur caisse régionale.
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
