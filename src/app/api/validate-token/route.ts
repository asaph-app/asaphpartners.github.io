import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    return NextResponse.json(
      { ok: false, message: "API_URL não configurada no servidor." },
      { status: 500 },
    );
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = body.token?.trim() ?? "";
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corpo inválido." },
      { status: 400 },
    );
  }

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Cole o token de identidade antes de validar." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${apiUrl}/partner/test`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (response.ok) {
      return NextResponse.json({
        ok: true,
        message: "Token válido. Autenticação de parceiro confirmada.",
      });
    }

    return NextResponse.json(
      {
        ok: false,
        message: `Token inválido ou não autorizado (HTTP ${response.status}).`,
      },
      { status: 401 },
    );
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
