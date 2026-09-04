import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { DocTable } from "@/components/DocTable";
import { Section } from "@/components/Section";

export function HmacSignature() {
  return (
    <Section id="assinatura" title="Assinatura HMAC">
      <p>
        Todo pareamento exige assinatura. A chave HMAC é{" "}
        <strong className="text-ink">fixa e de longa duração</strong>: você a{" "}
        <a href="#pre-requisitos">fornece ao asaph</a> uma vez e a usa no seu
        app para assinar cada QR/Base64. No JSON, o campo <code>sig</code> é o
        HMAC-SHA256 em hexadecimal da mensagem abaixo.
      </p>
      <p>Calcule assim:</p>
      <CodeBlock>{`mensagem = "{ts};{device};{token}"
sig      = hex(HMAC-SHA256(chave_compartilhada, mensagem))`}</CodeBlock>
      <DocTable
        headers={["Campo no QR", "Descrição"]}
        rows={[
          [<code key="ts">ts</code>, "Unix time em segundos no momento da geração."],
          [
            <code key="d">device</code>,
            <>
              Nome do computador (ex.: <code>MacBook</code>).
            </>,
          ],
          [
            <code key="t">token</code>,
            "Código da sessão/computador (ecoado no webhook).",
          ],
          [
            <code key="s">sig</code>,
            "HMAC em hexadecimal (minúsculo).",
          ],
        ]}
      />
      <Callout variant="warn">
        <strong>Atenção:</strong> a ordem e o separador <code>;</code> importam:{" "}
        <code>ts</code>, depois <code>device</code>, depois <code>token</code>.
        Qualquer diferença invalida a assinatura.
      </Callout>
    </Section>
  );
}
