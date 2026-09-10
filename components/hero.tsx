import { LinkButton } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-4xl px-5 py-16 text-center md:py-20">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
          Équipements professionnels
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.08] text-ink md:text-5xl">
          Équipez votre entreprise jusqu&apos;à 70&nbsp;% moins cher
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          Découvrez nos équipements professionnels éligibles aux dispositifs
          de prévention et estimez votre reste à charge en quelques clics.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <LinkButton href="/catalogue" size="lg">
            Voir les équipements
          </LinkButton>
          <LinkButton href="/simulateur" variant="ghost" size="lg">
            Calculer mon aide
          </LinkButton>
        </div>
        <p className="mt-5 font-mono text-xs text-ink-faint">
          Équipements professionnels · Devis rapide · Accompagnement dossier
        </p>
      </div>
    </section>
  );
}
