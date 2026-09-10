import type { Metadata } from "next";
import { Archivo, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "EQUIPVENTION — Équipements professionnels, aide potentielle incluse",
  description:
    "Boutique B2B d'équipements professionnels éligibles aux dispositifs de prévention des risques. Prix, aide potentielle et reste à charge estimé sur chaque produit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
