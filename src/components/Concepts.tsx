import { DocTable } from "@/components/DocTable";
import { Section } from "@/components/Section";

export function Concepts() {
  return (
    <Section id="conceitos" title="Conceitos">
      <DocTable
        headers={["Termo", "Significado"]}
        rows={[
          [
            <strong key="o">Organização</strong>,
            "Igreja ou conta no asaph com a qual o computador será vinculado.",
          ],
          [
            <strong key="d">Dispositivo (device)</strong>,
            <>
              Conexão entre o seu produto e uma organização no asaph. Status:{" "}
              <code>pending</code> → <code>active</code> → <code>revoked</code>.
            </>,
          ],
          [
            <strong key="i">Token de identidade</strong>,
            <>
              JWT permanente do parceiro (seção Credenciais). Vai no header{" "}
              <code>Authorization: Bearer …</code> em todas as rotas{" "}
              <code>/partner/*</code>.
            </>,
          ],
          [
            <strong key="t">
              Token de sessão (<code>token</code>)
            </strong>,
            <>
              Código gerado pelo <em>seu</em> app para identificar aquele
              computador/sessão. Entra no QR Code / Base64 e é ecoado no webhook
              para você saber a quem entregar o código do dispositivo.
            </>,
          ],
          [
            <strong key="p">
              Código do dispositivo (<code>payload</code>)
            </strong>,
            <>
              Código assinado gerado pelo asaph. Deve ser enviado como{" "}
              <code>X-Device-Code</code> no handshake e em todas as demais rotas{" "}
              <code>/partner/*</code>.
            </>,
          ],
        ]}
      />
    </Section>
  );
}
