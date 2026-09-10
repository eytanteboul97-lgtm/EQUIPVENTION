import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-ink-soft">
              EQUIPVENTION n&apos;est pas un site officiel de la CARSAT, de
              l&apos;Assurance Maladie ou de l&apos;État. Les dossiers de
              subvention se déposent exclusivement via net-entreprises.fr
              (entreprises) ou votre caisse régionale (indépendants).
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <div className="font-display font-semibold text-ink">Navigation</div>
              <ul className="mt-3 space-y-2 text-ink-soft">
                <li><Link href="/catalogue" className="hover:text-navy">Catalogue</Link></li>
                <li><Link href="/simulateur" className="hover:text-navy">Simulateur</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-display font-semibold text-ink">Sources officielles</div>
              <ul className="mt-3 space-y-2 text-ink-soft">
                <li>
                  <a
                    href="https://www.ameli.fr/entreprise/sante-travail/prevention/aides-financieres/subventions-1-50-salaries/prevention-risques-ergonomiques/presentation-generale"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-navy"
                  >
                    ameli.fr — Prévention des risques ergonomiques
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ameli.fr/entreprise/sante-travail/prevention/aides-financieres/subventions-1-50-salaries/prevention-risques-ergonomiques/equipements"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-navy"
                  >
                    ameli.fr — Cahier des charges équipements
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-line pt-6 font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} EQUIPVENTION — montants et plafonds à
          revérifier sur ameli.fr, susceptibles d&apos;évoluer.
        </div>
      </div>
    </footer>
  );
}
