import { FileCheck, Headset, Receipt, Truck, ClipboardCheck } from "lucide-react";

const badges = [
  { icon: FileCheck, label: "Devis rapide" },
  { icon: ClipboardCheck, label: "Accompagnement dossier" },
  { icon: Headset, label: "Support dédié" },
  { icon: Receipt, label: "Facture professionnelle" },
  { icon: Truck, label: "Livraison professionnelle" },
];

export function TrustBadges() {
  return (
    <section className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-green">
          Pourquoi EQUIPVENTION
        </span>
        <h2 className="mt-3 max-w-xl text-balance font-display text-3xl font-bold text-ink">
          Une boutique spécialisée, pas un guichet administratif
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-card border border-line bg-paper-raised p-5 text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-soft text-navy">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-display text-sm font-semibold text-ink">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
