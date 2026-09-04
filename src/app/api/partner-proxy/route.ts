import { NextResponse } from "next/server";

type ProxyBody = {
  method?: string;
  path?: string;
  token?: string;
  deviceCode?: string;
  query?: Record<string, string>;
};

const ALLOWED: { method: string; pattern: RegExp }[] = [
  { method: "POST", pattern: /^\/partner\/handshake$/ },
  { method: "GET", pattern: /^\/partner\/me$/ },
  { method: "GET", pattern: /^\/partner\/orders$/ },
  { method: "GET", pattern: /^\/partner\/orders\/[^/]+$/ },
  {
    method: "GET",
    pattern: /^\/partner\/orders\/[^/]+\/file\/[^/]+\/download_session$/,
  },
  { method: "DELETE", pattern: /^\/partner\/device$/ },
];

function isAllowed(method: string, path: string) {
  return ALLOWED.some(
    (rule) => rule.method === method && rule.pattern.test(path),
  );
}

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    return NextResponse.json(
      { ok: false, message: "API_URL não configurada no servidor." },
      { status: 500 },
    );
  }

  let body: ProxyBody;
  try {
    body = (await request.json()) as ProxyBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corpo inválido." },
      { status: 400 },
    );
  }

  const method = body.method?.toUpperCase() ?? "";
  const path = body.path?.trim() ?? "";
  const token = body.token?.trim() ?? "";
  const deviceCode = body.deviceCode?.trim() ?? "";

  if (!["GET", "POST", "DELETE"].includes(method)) {
    return NextResponse.json(
      { ok: false, message: "Método não suportado." },
      { status: 400 },
    );
  }

  if (!path.startsWith("/partner/") || path.includes("..")) {
    return NextResponse.json(
      { ok: false, message: "Caminho inválido." },
      { status: 400 },
    );
  }

  if (!isAllowed(method, path)) {
    return NextResponse.json(
      { ok: false, message: "Endpoint não permitido no proxy." },
      { status: 403 },
    );
  }

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Token de identidade obrigatório." },
      { status: 400 },
    );
  }

  if (!deviceCode) {
    return NextResponse.json(
      {
        ok: false,
        message: "Device code (X-Device-Code) obrigatório para este endpoint.",
      },
      { status: 400 },
    );
  }

  const url = new URL(`${apiUrl}${path}`);
  if (path === "/partner/orders" && body.query) {
    const query = body.query.query?.trim();
    const take = body.query.take?.trim();
    if (query) url.searchParams.set("query", query);
    if (take) url.searchParams.set("take", take);
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Device-Code": deviceCode,
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    let responseBody: unknown = null;

    if (response.status === 204) {
      responseBody = null;
    } else if (contentType.includes("application/json")) {
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
      }
    } else {
      const text = await response.text();
      responseBody = text || null;
    }

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      body: responseBody,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Não foi possível contatar a API. Verifique API_URL e a conexão interna.",
      },
      { status: 502 },
    );
  }
}
