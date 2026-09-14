import { getEquipmentById, getEquipmentGroupLabel } from "@/lib/aid-programs/fipu";
import type { Product } from "@/lib/products";

/**
 * Deux affirmations distinctes, jamais confondues :
 * - la CATÉGORIE d'équipement est officiellement reconnue par le dispositif
 *   (fait vérifiable, source ameli.fr) ;
 * - la référence commerciale précise reste un exemple dont la conformité
 *   technique exacte n'a pas été validée — jamais "Compatible avec les
 *   critères techniques du dispositif" tant que ce n'est pas vrai.
 */
export function EquipmentBadges({
  product,
  className,
  compact = false,
}: {
  product: Product;
  className?: string;
  /** Version courte (sans le nom du groupe) pour les cartes catalogue, où la place est limitée. */
  compact?: boolean;
}) {
  const officialEntries = product.officialEquipmentIds
    .map((id) => getEquipmentById(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const recognized = officialEntries.length > 0 && officialEntries.every((e) => e.verified);
  const groupLabel = recognized ? getEquipmentGroupLabel(officialEntries[0].group) : null;

  return (
    <div className={"flex max-w-full flex-col items-start gap-1.5 " + (className ?? "")}>
      {recognized && (
        <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-money-soft px-3 py-1 font-mono text-[0.65rem] font-medium text-green">
          {compact ? "Catégorie reconnue" : `Catégorie reconnue par le dispositif — ${groupLabel}`}
        </span>
      )}
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-paper-raised/90 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wide text-ink-faint">
        Référence exemple — éligibilité à vérifier
      </span>
    </div>
  );
}
