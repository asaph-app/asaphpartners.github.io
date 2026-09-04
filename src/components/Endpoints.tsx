import { CodeBlock } from "@/components/CodeBlock";
import { DocTable } from "@/components/DocTable";
import { EndpointTry } from "@/components/EndpointTry";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "DELETE";

function MethodBadge({ method }: { method: Method }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md font-mono text-[0.72rem] tracking-wide",
        method === "GET" && "bg-[#dceaf5] text-[#1a4d73]",
        method === "DELETE" && "bg-[#f6dede] text-[#7a2e2e]",
        method === "POST" && "bg-asaph-soft text-asaph-deep",
      )}
    >
      {method}
    </Badge>
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
    <article id={id} className="group/endpoint scroll-mt-6 mb-8 last:mb-0">
      <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
        <MethodBadge method={method} />
        <span className="font-mono text-[0.92rem] font-medium text-ink">
          {path}
        </span>
      </div>
      <div className="flex flex-col gap-3 text-ink-soft">{children}</div>
      <Separator className="mt-8 group-last/endpoint:hidden" />
    </article>
  );
}

export function Endpoints() {
  return (
    <Section id="endpoints" title="Endpoints">
      <p className="m-0 text-[0.95rem]">
        Use os painéis <strong className="text-ink">Try it</strong> com o token
        e o device code de{" "}
        <a href="#credenciais">Credenciais</a>. As chamadas passam pelo
        servidor desta documentação.
      </p>

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
        <EndpointTry method="POST" pathTemplate="/partner/handshake" />
      </Endpoint>

      <Endpoint id="me" method="GET" path="/partner/me">
        <p>Retorna a organização vinculada ao dispositivo ativo.</p>
        <CodeBlock>{`{
  "id": "uuid-da-organizacao",
  "name": "Igreja Exemplo",
  "avatar_url": "https://…"
}`}</CodeBlock>
        <EndpointTry method="GET" pathTemplate="/partner/me" />
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
        <EndpointTry
          method="GET"
          pathTemplate="/partner/orders"
          fields={[
            {
              name: "query",
              label: "query",
              kind: "query",
              placeholder: "Filtro opcional",
            },
            {
              name: "take",
              label: "take",
              kind: "query",
              placeholder: "20",
            },
          ]}
        />
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
        <EndpointTry
          method="GET"
          pathTemplate="/partner/orders/{id}"
          fields={[
            {
              name: "id",
              label: "id",
              kind: "path",
              placeholder: "uuid-da-ordem",
            },
          ]}
        />
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
        <EndpointTry
          method="GET"
          pathTemplate="/partner/orders/{order_id}/file/{file_id}/download_session"
          fields={[
            {
              name: "order_id",
              label: "order_id",
              kind: "path",
              placeholder: "uuid-da-ordem",
            },
            {
              name: "file_id",
              label: "file_id",
              kind: "path",
              placeholder: "id-externo-storage",
            },
          ]}
        />
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
        <EndpointTry
          method="DELETE"
          pathTemplate="/partner/device"
          confirm={{
            title: "Revogar este dispositivo?",
            description:
              "O dispositivo passará a revoked. Rotas protegidas falharão até um novo pareamento. Esta ação não pode ser desfeita nesta sessão.",
            actionLabel: "Revogar",
          }}
        />
      </Endpoint>
    </Section>
  );
}
