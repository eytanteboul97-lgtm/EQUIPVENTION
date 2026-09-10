import { LinkButton } from "@/components/ui/button";
import { SubsidyCard } from "@/components/subsidy-card";

export function Hero() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
            Prévention des risques professionnels
          </span>
          <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.08] text-ink md:text-5xl">
            Jusqu&apos;à 70&nbsp;% de financement sur vos équipements
            professionnels
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-soft">
            Réduisez vos risques. Équipez vos salariés. Optimisez votre
            investissement — grâce aux dispositifs de prévention auxquels
            votre entreprise peut être éligible.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href="/simulateur" size="lg">
              Vérifier mon éligibilité
            </LinkButton>
            <span className="font-mono text-xs text-ink-faint">
              30 secondes · Gratuit · Sans engagement
            </span>
          </div>
        </div>
        <div>
          <div className="mb-2 text-right font-mono text-[0.7rem] uppercase tracking-wide text-ink-faint">
            Exemple
          </div>
          <SubsidyCard amountHT={750} />
        </div>
      </div>
    </section>
  );
}
