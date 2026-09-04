import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Section } from "@/components/Section";

export function Webhook() {
  return (
    <Section id="webhook" title="Seu webhook">
      <p>
        A URL do webhook é um dos itens que você{" "}
        <a href="#pre-requisitos">fornece ao asaph</a> na configuração. Depois
        de validar o QR/Base64, o asaph notifica o seu sistema com um{" "}
        <code>POST</code> HTTPS. Exemplo:
      </p>
      <CodeBlock>{`POST /seu/webhook
Content-Type: application/json

{
  "token": "<mesmo token do QR/Base64>",
  "payload": "<código assinado do dispositivo>"
}`}</CodeBlock>
      <Callout>
        <strong>Importante:</strong> o <code>token</code> do webhook{" "}
        <em>não</em> é o token de identidade (JWT). É o código de sessão do
        computador que você colocou no QR. Use-o para entregar o{" "}
        <code>payload</code> à instância certa do app. O <code>payload</code>{" "}
        vira o header <code>X-Device-Code</code>.
      </Callout>
      <ul>
        <li>
          Responda com sucesso HTTP (<code>2xx</code>) se aceitou o payload.
        </li>
        <li>
          O asaph não segue redirects; use URL HTTPS final na porta 443.
        </li>
        <li>
          Trate retries: a entrega pode ser reenviada em caso de falha
          transitória.
        </li>
        <li>
          Persista o <code>payload</code> com segurança — ele autentica o
          dispositivo.
        </li>
      </ul>
    </Section>
  );
}
