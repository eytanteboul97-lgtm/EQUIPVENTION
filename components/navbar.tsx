import Link from "next/link";
import { Logo } from "@/components/logo";
import { LinkButton } from "@/components/ui/button";

const links = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/simulateur", label: "Simulateur" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" aria-label="EQUIPVENTION — accueil">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium text-ink-soft hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <LinkButton href="/simulateur" size="sm">
          Vérifier mon éligibilité
        </LinkButton>
      </div>
    </header>
  );
}
