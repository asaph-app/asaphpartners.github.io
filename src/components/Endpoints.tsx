import { CodeBlock } from "@/components/CodeBlock";
import { DocTable } from "@/components/DocTable";
import { Section } from "@/components/Section";

type Method = "GET" | "POST" | "DELETE";

function MethodBadge({ method }: { method: Method }) {
  const styles =
    method === "GET"
      ? "bg-[#dceaf5] text-[#1a4d73]"
      : method === "DELETE"
        ? "bg-[#f6dede] text-[#7a2e2e]"
        : "bg-asaph-soft text-asaph-deep";

  return (
    <span
      className={`rounded-md px-2 py-1 font-mono text-[0.72rem] font-medium tracking-wide ${styles}`}
    >
      {method}
    </span>
  );
}

function Endpoint({
  id,
  method,
  path,
  children,
}: {
  id: string;
  method: Method;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="scroll-mt-6 border-b border-line pb-1 mb-8 last:mb-0 last:border-0"
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
        <MethodBadge method={method} />
        <span className="font-mono text-[0.92rem] font-medium text-ink">
          {path}
        </span>
      </div>
      <div className="space-y-3 text-ink-soft">{children}</div>
    </article>
  );
}

export function Endpoints() {
  return (
    <Section id="endpoints" title="Endpoints">
      <Endpoint id="test" method="GET" path="/partner/test">
        <p>
          Valida apenas o token de identidade (<code>Authorization</code>). Não
          exige <code>X-Device-Code</code>. Útil para conferir o JWT antes do
          pareamento — a seção Credenciais usa este endpoint via servidor.
        </p>
        <p>
          <strong className="text-ink">Resposta:</strong> <code>200 OK</code> se
          o token for válido.
        </p>
      </Endpoint>

      <Endpoint id="handshake" method="POST" path="/partner/handshake">
        <p>
          Ativa o dispositivo (<code>pending</code> → <code>active</code>).
          Chame assim que receber o <code>payload</code> no webhook.
        </p>
        <p>
          <strong className="text-ink">Corpo:</strong> nenhum (o código vai no
          header).
        </p>
        <p>
          <strong className="text-ink">Resposta:</strong>{" "}
          <code>204 No Content</code> em sucesso.
        </p>
        <CodeBlock>{`curl -X POST "$BASE_URL/partner/handshake" \\
  -H "Authorization: Bearer $PARTNER_TOKEN" \\
  -H "X-Device-Code: $DEVICE_CODE"`}</CodeBlock>
      </Endpoint>

      <Endpoint id="me" method="GET" path="/partner/me">
        <p>Retorna a organização vinculada ao dispositivo ativo.</p>
        <CodeBlock>{`{
  "id": "uuid-da-organizacao",
  "name": "Igreja Exemplo",
  "avatar_url": "https://…"
}`}</CodeBlock>
      </Endpoint>

      <Endpoint id="orders" method="GET" path="/partner/orders">
        <p>Lista ordens de culto próximas da organização vinculada.</p>
        <DocTable
          headers={["Query", "Padrão", "Descrição"]}
          rows={[
            [<code key="q">query</code>, "—", "Filtro textual opcional."],
            [
              <code key="t">take</code>,
              <code key="d">20</code>,
              "Quantidade (1–50).",
            ],
          ]}
        />
        <CodeBlock>{`[
  {
    "id": "uuid-da-ordem",
    "service": {
      "id": "uuid-do-culto",
      "name": "Culto de domingo",
      "description": null,
      "date": "2026-09-07T00:00:00Z"
    },
    "time": "2026-09-07T18:00:00Z"
  }
]`}</CodeBlock>
      </Endpoint>

      <Endpoint id="order-detail" method="GET" path="/partner/orders/{id}">
        <p>
          Retorna os itens da ordem de culto (músicas, arquivos, referências
          bíblicas, cabeçalhos, etc.).
        </p>
        <CodeBlock>{`[
  {
    "index": 0,
    "type": "song",
    "name": null,
    "notes": null,
    "duration": null,
    "song": {
      "name": "Grande é o Senhor",
      "artists": "Adoradores",
      "source_song": {
        "name": "Grande é o Senhor",
        "artists": "Adoradores",
        "isrc": null,
        "origin": "…",
        "data": {}
      }
    },
    "file": null,
    "bible_reference": null
  },
  {
    "index": 1,
    "type": "file",
    "song": null,
    "file": {
      "id": "uuid-interno",
      "file_id": "id-externo-storage",
      "name": "letra.pdf",
      "mime_type": "application/pdf",
      "kind": "file",
      "md5": "…",
      "size": 20480,
      "provider": "google_drive",
      "download_session_url": "/partner/orders/{order_id}/file/{file_id}/download_session"
    },
    "bible_reference": null
  }
]`}</CodeBlock>
        <p>
          Tipos de item comuns: <code>header</code>, <code>item</code>,{" "}
          <code>song</code>, <code>bible</code>, <code>media</code>,{" "}
          <code>file</code>.
        </p>
      </Endpoint>

      <Endpoint
        id="download"
        method="GET"
        path="/partner/orders/{order_id}/file/{file_id}/download_session"
      >
        <p>
          Cria uma sessão temporária de download para um arquivo da ordem. Use o{" "}
          <code>file_id</code> retornado em <code>file.file_id</code> (não o
          UUID interno).
        </p>
        <CodeBlock>{`{
  "access_token": "…",
  "url": "https://…"
}`}</CodeBlock>
      </Endpoint>

      <Endpoint id="revoke" method="DELETE" path="/partner/device">
        <p>
          Revoga o dispositivo atual (<code>active</code> →{" "}
          <code>revoked</code>). Depois disso, as rotas protegidas passam a
          falhar até um novo pareamento.
        </p>
        <p>
          <strong className="text-ink">Resposta:</strong>{" "}
          <code>204 No Content</code>.
        </p>
      </Endpoint>
    </Section>
  );
}
