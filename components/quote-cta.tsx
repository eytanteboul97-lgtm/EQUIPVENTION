"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bouton "Demander un devis" + formulaire modal. Pas d'appel réseau réel
 * (pas de back-end en phase 1) : la confirmation est honnête sur ce point,
 * elle ne prétend pas qu'un e-mail est parti quelque part de précis.
 */
export function QuoteCTA({
  productName,
  variant = "primary",
  className,
  children,
}: {
  productName?: string;
  variant?: "primary" | "secondary" | "link";
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // La modale est "portée" dans document.body (voir plus bas) : un bouton
  // placé dans la navbar sticky (elle-même un contexte d'empilement) ne
  // doit jamais laisser un clic "traverser" jusqu'au contenu de la page.
  useEffect(() => setMounted(true), []);

  // Empêche le scroll de la page derrière la modale (et le clic "à travers"
  // qu'un fond scrollable rendait possible).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function close() {
    setOpen(false);
    setTimeout(() => setSent(false), 200);
  }

  const variantClasses =
    variant === "primary"
      ? "rounded-full px-6 py-3.5 bg-navy text-white hover:bg-navy-deep"
      : variant === "secondary"
        ? "rounded-full px-6 py-3.5 border border-line text-ink hover:border-navy/40"
        : "text-navy underline underline-offset-2 hover:text-navy-deep";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center font-display font-semibold transition-colors",
          variantClasses,
          className
        )}
      >
        {children ?? "Demander un devis"}
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
            onClick={close}
          >
            <div
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-paper-raised p-6 shadow-card sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg font-bold text-ink">
                  {sent ? "Demande envoyée" : "Demander un devis"}
                </h3>
                <button
                  onClick={close}
                  aria-label="Fermer"
                  className="text-ink-faint hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {sent ? (
                <p className="mt-4 text-sm text-ink-soft">
                  Merci ! Un conseiller EQUIPVENTION revient vers vous rapidement
                  {productName ? ` au sujet de « ${productName} »` : ""}.
                </p>
              ) : (
                <form
                  className="mt-4 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  {productName && (
                    <div className="rounded-lg bg-navy-soft px-3 py-2 font-mono text-xs text-navy">
                      Produit : {productName}
                    </div>
                  )}
                  <input required placeholder="Prénom" className="rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                  <input required placeholder="Entreprise" className="rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                  <input required type="email" placeholder="E-mail" className="rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                  <input required type="tel" placeholder="Téléphone" className="rounded-lg border border-line bg-paper px-4 py-3 text-sm" />
                  <textarea
                    placeholder="Votre besoin (optionnel)"
                    rows={2}
                    className="rounded-lg border border-line bg-paper px-4 py-3 text-sm"
                  />
                  <p className="text-xs text-ink-faint">
                    Pas de spam. Vos coordonnées servent uniquement à traiter votre demande, conformément au RGPD.
                  </p>
                  <button
                    type="submit"
                    className="mt-1 rounded-full bg-navy py-3 font-display font-semibold text-white hover:bg-navy-deep"
                  >
                    Envoyer ma demande
                  </button>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
