const steps = [
  { n: 1, title: "Choisissez votre équipement", body: "Parcourez le catalogue organisé par risque professionnel." },
  { n: 2, title: "Vérifiez votre éligibilité", body: "Simulateur en 30 secondes : montant estimé, reste à charge." },
  { n: 3, title: "EQUIPVENTION prépare vos documents", body: "Attestation fournisseur et pièces réunies automatiquement." },
  { n: 4, title: "Déposez votre demande", body: "Auprès de net-entreprises.fr ou de votre caisse régionale." },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
        Comment fonctionne l&apos;aide
      </span>
      <h2 className="mt-3 max-w-xl text-balance font-display text-3xl font-bold text-ink">
        Du produit au dossier, sans détour administratif
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div key={step.n} className="rounded-card border border-line bg-paper-raised p-6 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper font-mono text-sm font-semibold text-navy">
              {step.n}
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
