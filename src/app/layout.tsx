import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "asaph — Documentação da API para parceiros",
  description:
    "Guia de integração da API asaph para parceiros: pareamento, webhook, HMAC e endpoints /partner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(geist.variable, ibmPlexMono.variable, "font-sans")}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
