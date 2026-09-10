import { LinkButton } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-line bg-navy">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 py-16 text-center md:py-20">
        <h2 className="text-balance font-display text-3xl font-bold text-white md:text-4xl">
          Prêt à équiper votre entreprise&nbsp;?
        </h2>
        <p className="max-w-md text-white/70">
          Parcourez le catalogue, comparez les prix et le reste à charge
          estimé, et lancez votre devis en quelques minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <LinkButton href="/catalogue" variant="secondary" size="lg">
            Voir les équipements
          </LinkButton>
          <LinkButton
            href="/simulateur"
            size="lg"
            className="bg-white text-navy hover:bg-white/90"
          >
            Calculer mon aide
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
