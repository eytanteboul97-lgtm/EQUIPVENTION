import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { FundingBadge } from "@/components/funding-badge";

export function CategoryCard({
  icon: Icon,
  label,
  description,
  count,
  href,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-card border border-line bg-paper-raised p-6 shadow-card transition-colors hover:border-navy"
    >
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-soft text-navy">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-ink">{label}</h3>
        <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
        {count > 0 && <FundingBadge variant="rate" className="mt-3" />}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-xs text-ink-faint">
          {count > 0 ? `${count} référence${count > 1 ? "s" : ""}` : "Bientôt"}
        </span>
        <span className="flex items-center gap-1 font-display text-sm font-semibold text-navy">
          Voir les équipements
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
