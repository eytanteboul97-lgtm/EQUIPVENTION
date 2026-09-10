import { LinkButton } from "@/components/ui/button";
import { ProductPrice } from "@/components/product-price";

export function FinancialExample() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid gap-10 rounded-card border border-line bg-paper-raised p-8 shadow-card md:grid-cols-[1fr_0.9fr] md:items-center md:p-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
            Concrètement
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold text-ink">
            750&nbsp;€ HT peuvent revenir à 225&nbsp;€ HT
          </h2>
          <p className="mt-4 max-w-md text-ink-soft">
            Sur un équipement éligible au taux standard, l&apos;aide potentielle
            peut couvrir une grande partie de l&apos;investissement. Le reste à
            charge est toujours estimé avant commande — jamais garanti tant que
            le dossier n&apos;est pas validé.
          </p>
          <LinkButton href="/simulateur" className="mt-6" size="md">
            Calculer mon reste à charge
          </LinkButton>
        </div>
        <div>
          <div className="mb-2 text-right font-mono text-[0.7rem] uppercase tracking-wide text-ink-faint">
            Exemple
          </div>
          <ProductPrice amountHT={750} />
        </div>
      </div>
    </section>
  );
}
