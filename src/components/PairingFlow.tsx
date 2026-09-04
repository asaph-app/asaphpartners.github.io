import { CodeBlock } from "@/components/CodeBlock";
import { Section } from "@/components/Section";

export function PairingFlow() {
  return (
    <Section id="fluxo" title="Fluxo de pareamento">
      <p>
        O vínculo começa no <strong className="text-ink">seu</strong> app (QR
        Code ou string Base64) e termina quando você ativa o dispositivo com o
        handshake. Depois disso, as rotas listadas abaixo ficam disponíveis.
      </p>

      <ol className="m-0 list-none space-y-3 p-0">
        <Step n={1}>
          <strong className="text-ink">
            Exiba um QR Code (ou uma string Base64)
          </strong>{" "}
          no seu app. O asaph lê esse conteúdo. Ele deve ser um JSON com:
          <ul className="mt-2.5 mb-0">
            <li>
              <code>ts</code> — timestamp Unix (segundos)
            </li>
            <li>
              <code>device</code> — nome do computador (ex.: <code>MacBook</code>
              )
            </li>
            <li>
              <code>token</code> — código que identifica aquele
              computador/sessão (você usará isso para ligar o aparelho à
              organização)
            </li>
            <li>
              <code>sig</code> — HMAC de <code>{`{ts};{device};{token}`}</code>{" "}
              com a chave de assinatura combinada com o asaph
            </li>
          </ul>
          <CodeBlock className="mt-3.5">{`{
  "ts": 1779726247,
  "device": "MacBook",
  "token": "sessao-opaca-do-seu-app",
  "sig": "b94ca4e3e80cf667fb9849dc57b1432488be33b4c5f3b192097965ea37482a0d"
}`}</CodeBlock>
          <p className="mt-3 mb-0">
            O QR pode conter o JSON em texto ou a mesma carga em Base64 — o
            asaph aceita os dois formatos na leitura. Detalhes da assinatura em{" "}
            <a href="#assinatura">Assinatura HMAC</a>.
          </p>
        </Step>

        <Step n={2}>
          <strong className="text-ink">O asaph valida o conteúdo</strong>{" "}
          (incluindo a assinatura HMAC) e associa o pareamento à organização do
          usuário logado.
        </Step>

        <Step n={3}>
          <strong className="text-ink">O asaph cria o dispositivo</strong> em
          status <code>pending</code>, gera um código assinado e envia um{" "}
          <code>POST</code> para o <strong className="text-ink">seu webhook</strong>,
          usando o <code>token</code> que veio no QR/Base64:
          <CodeBlock className="mt-3.5">{`POST /seu/webhook
Content-Type: application/json

{
  "token": "sessao-opaca-do-seu-app",
  "payload": "codigo_assinado_do_dispositivo"
}`}</CodeBlock>
          <p className="mt-3 mb-0">
            Guarde o <code>payload</code>: ele é o valor de{" "}
            <code>X-Device-Code</code> em todas as chamadas{" "}
            <code>/partner/*</code>, junto com o token de identidade no{" "}
            <code>Authorization</code>. O dispositivo ainda{" "}
            <strong className="text-ink">não</strong> está ativo.
          </p>
        </Step>

        <Step n={4}>
          <strong className="text-ink">
            Ao receber <code>token</code> + <code>payload</code>
          </strong>
          , localize a sessão pelo <code>token</code> e chame{" "}
          <code>POST /partner/handshake</code> com:
          <ul className="mt-2.5 mb-0">
            <li>
              <code>Authorization: Bearer &lt;token de identidade&gt;</code>
            </li>
            <li>
              <code>X-Device-Code: &lt;payload&gt;</code>
            </li>
          </ul>
        </Step>

        <Step n={5}>
          <strong className="text-ink">
            O dispositivo fica pareado e ativo
          </strong>{" "}
          <code>(pending → active)</code>, pronto para uso.
        </Step>

        <Step n={6}>
          <strong className="text-ink">Use os endpoints abaixo</strong> com os
          mesmos headers <code>Authorization</code> e{" "}
          <code>X-Device-Code</code> para obter os dados da organização
          vinculada.
        </Step>
      </ol>
    </Section>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="relative rounded-[14px] border border-line bg-white/70 py-4 pl-[3.35rem] pr-4">
      <span className="absolute left-4 top-4 grid h-6 w-6 place-items-center rounded-lg bg-asaph text-[0.8rem] font-bold text-white">
        {n}
      </span>
      <div className="text-ink-soft [&_strong]:text-ink">{children}</div>
    </li>
  );
}
