import { Callout } from "@/components/Callout";
import { DocTable } from "@/components/DocTable";
import { Section } from "@/components/Section";

export function Prerequisites() {
  return (
    <Section id="pre-requisitos" title="O que você precisa fornecer ao asaph">
      <p>
        Antes da integração funcionar, envie ao time asaph estes dois itens. Eles
        são configurados uma vez na conta do seu produto:
      </p>
      <DocTable
        headers={["Item", "Detalhe"]}
        rows={[
          [
            <strong key="w">URL do webhook</strong>,
            <>
              Endpoint HTTPS no <em>seu</em> backend que receberá{" "}
              <code>{`POST { "token", "payload" }`}</code> quando um pareamento
              for iniciado. Deve ser público, estável e responder{" "}
              <code>2xx</code>. Veja <a href="#webhook">Seu webhook</a>.
            </>,
          ],
          [
            <strong key="k">Chave de assinatura HMAC</strong>,
            <>
              Segredo <strong>fixo e de longa duração</strong>, combinado entre
              você e o asaph. No seu app, use essa chave para gerar o{" "}
              <code>sig</code> do QR/Base64 sobre{" "}
              <code>{`{ts};{device};{token}`}</code>. O asaph usa a mesma chave
              para validar. Não é por sessão nem por organização — é uma chave
              do parceiro. Veja <a href="#assinatura">Assinatura HMAC</a>.
            </>,
          ],
        ]}
      />
      <Callout>
        <strong>Em troca,</strong> depois que webhook e chave HMAC estiverem
        configurados, o asaph envia o <strong>token de identidade</strong>{" "}
        (JWT). Cole-o na seção seguinte para validar.
      </Callout>
    </Section>
  );
}
