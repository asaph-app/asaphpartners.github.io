import { Callout } from "@/components/Callout";
import { Section } from "@/components/Section";

export function BestPractices() {
  return (
    <Section id="erros" title="Erros e boas práticas">
      <ul>
        <li>
          Sem <code>Authorization</code> ou <code>X-Device-Code</code> válidos,
          a requisição é rejeitada antes da lógica de negócio.
        </li>
        <li>
          Dispositivo <code>revoked</code> não pode fazer handshake de novo; é
          preciso um novo pareamento.
        </li>
        <li>
          Trate timeouts e retries no webhook; o asaph pode reenviar a entrega.
        </li>
        <li>
          Não registre o token de identidade nem o <code>X-Device-Code</code> em
          logs públicos.
        </li>
        <li>
          Prefira armazenar o device code no backend/sessão do aparelho, não em
          URLs compartilháveis.
        </li>
      </ul>
      <Callout>
        <strong>Checklist rápido:</strong> exibir QR/Base64 com{" "}
        <code>{`{ ts, device, token, sig }`}</code> → receber webhook{" "}
        <code>{`{ token, payload }`}</code> →{" "}
        <code>POST /partner/handshake</code> → <code>GET /partner/me</code>{" "}
        retorna a organização esperada → listar ordens.
      </Callout>
    </Section>
  );
}
