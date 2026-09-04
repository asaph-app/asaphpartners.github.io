import { Auth } from "@/components/Auth";
import { BestPractices } from "@/components/BestPractices";
import { Concepts } from "@/components/Concepts";
import { Credentials } from "@/components/Credentials";
import { Endpoints } from "@/components/Endpoints";
import { Hero } from "@/components/Hero";
import { HmacSignature } from "@/components/HmacSignature";
import { PairingFlow } from "@/components/PairingFlow";
import { PartnerCredentialsProvider } from "@/components/PartnerCredentials";
import { Prerequisites } from "@/components/Prerequisites";
import { TableOfContents } from "@/components/TableOfContents";
import { Webhook } from "@/components/Webhook";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const publicApiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "https://v2.api.asaph.app.br";

  return (
    <PartnerCredentialsProvider>
      <div className="relative mx-auto grid max-w-[1100px] grid-cols-[220px_minmax(0,1fr)] gap-10 px-5 py-8 pb-20 max-lg:grid-cols-1 max-lg:gap-4">
        <TableOfContents />
        <main className="max-w-[760px]">
          <Hero />
          <Prerequisites />
          <Credentials publicApiUrl={publicApiUrl} />
          <Concepts />
          <PairingFlow />
          <Webhook />
          <HmacSignature />
          <Auth />
          <Endpoints />
          <BestPractices />
          <Separator className="mt-14" />
          <footer className="pt-5 text-[0.85rem] text-muted-foreground">
            Documentação para parceiros asaph. Em caso de dúvidas de integração,
            fale com o time asaph que forneceu este token.
          </footer>
        </main>
      </div>
    </PartnerCredentialsProvider>
  );
}
