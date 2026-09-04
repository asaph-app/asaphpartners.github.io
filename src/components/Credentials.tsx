"use client";

import { useState } from "react";

type Props = {
  publicApiUrl: string;
};

export function Credentials({ publicApiUrl }: Props) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  async function validate() {
    const value = token.trim();
    if (!value) {
      setStatus({
        ok: false,
        message: "Cole o token de identidade antes de validar.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: value }),
      });
      const data = (await response.json()) as { ok: boolean; message: string };
      setStatus({ ok: Boolean(data.ok), message: data.message });
    } catch {
      setStatus({
        ok: false,
        message: "Não foi possível validar o token. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="credenciais"
      className="scroll-mt-6 my-7 rounded-[14px] border border-[rgba(252,41,71,0.25)] bg-gradient-to-br from-asaph-soft/95 to-white px-5 py-5 shadow-[0_18px_50px_rgba(15,20,24,0.08)]"
    >
      <h2 className="m-0 mb-2 text-[1.15rem] tracking-tight text-ink">
        Suas credenciais
      </h2>
      <p className="mb-3.5 text-[0.95rem] text-ink-soft">
        Após fornecer webhook e chave HMAC, o asaph envia o{" "}
        <strong className="font-semibold text-ink">token de identidade</strong>.
        Cole-o abaixo e valide. Use-o no header{" "}
        <code>Authorization: Bearer …</code> em{" "}
        <strong className="font-semibold text-ink">todas</strong> as chamadas{" "}
        <code>/partner/*</code>.
      </p>
      <div className="flex gap-2.5 max-sm:flex-col">
        <textarea
          rows={3}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          spellCheck={false}
          placeholder="Cole aqui o token de identidade fornecido pelo asaph"
          aria-label="Token de identidade"
          className="min-w-0 flex-1 resize-y rounded-[10px] border border-line bg-white px-4 py-3.5 font-mono text-[0.82rem] leading-snug text-ink outline-none focus:border-[rgba(252,41,71,0.45)] focus:shadow-[0_0_0_3px_rgba(252,41,71,0.12)]"
        />
        <button
          type="button"
          onClick={validate}
          disabled={loading}
          className="rounded-[10px] bg-asaph px-4 font-semibold text-white transition-colors hover:bg-asaph-deep disabled:opacity-70 max-sm:h-11"
        >
          {loading ? "Validando…" : "Validar"}
        </button>
      </div>
      {status && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3.5 mb-0 text-[0.9rem] font-medium ${
            status.ok ? "text-asaph-deep" : "text-[#8a2e2e]"
          }`}
        >
          {status.message}
        </p>
      )}
      <p className="mt-3.5 mb-0 text-[0.88rem] text-ink-soft">
        Base URL: <code>{publicApiUrl}</code>
      </p>
    </section>
  );
}
