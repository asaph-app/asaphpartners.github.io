"use client";

import { useState } from "react";

import { usePartnerCredentials } from "@/components/PartnerCredentials";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  publicApiUrl: string;
};

export function Credentials({ publicApiUrl }: Props) {
  const {
    token,
    setToken,
    deviceCode,
    setDeviceCode,
    setValidated,
  } = usePartnerCredentials();
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
      setValidated(false);
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
      const ok = Boolean(data.ok);
      setStatus({ ok, message: data.message });
      setValidated(ok);
    } catch {
      setStatus({
        ok: false,
        message: "Não foi possível validar o token. Tente novamente.",
      });
      setValidated(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      id="credenciais"
      className="scroll-mt-6 my-7 border-primary/25 bg-gradient-to-br from-asaph-soft/95 to-card shadow-[0_18px_50px_rgba(15,20,24,0.08)] ring-0"
    >
      <CardHeader>
        <CardTitle className="text-[1.15rem] tracking-tight">
          Suas credenciais
        </CardTitle>
        <CardDescription className="text-[0.95rem] text-ink-soft">
          Após fornecer webhook e chave HMAC, o asaph envia o{" "}
          <strong className="font-semibold text-ink">token de identidade</strong>
          . Cole-o abaixo e valide. O{" "}
          <strong className="font-semibold text-ink">device code</strong> é o{" "}
          <code>payload</code> do webhook — use-o como{" "}
          <code>X-Device-Code</code>. Ambos são reutilizados nos painéis{" "}
          <strong className="font-semibold text-ink">Try</strong> dos endpoints.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="identity-token">Token de identidade</FieldLabel>
            <Textarea
              id="identity-token"
              rows={3}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              spellCheck={false}
              placeholder="Cole aqui o token de identidade fornecido pelo asaph"
              className="min-h-[5.5rem] resize-y bg-card font-mono text-[0.82rem] leading-snug"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="device-code">Device code</FieldLabel>
            <Input
              id="device-code"
              value={deviceCode}
              onChange={(e) => setDeviceCode(e.target.value)}
              spellCheck={false}
              placeholder="payload recebido no webhook (X-Device-Code)"
              className="bg-card font-mono text-[0.82rem]"
            />
            <FieldDescription>
              Necessário para handshake e demais rotas <code>/partner/*</code>{" "}
              (exceto validação do token).
            </FieldDescription>
          </Field>
          <Button
            type="button"
            onClick={validate}
            disabled={loading}
            size="lg"
            className="w-fit px-4 font-semibold"
          >
            {loading ? <Spinner data-icon="inline-start" /> : null}
            {loading ? "Validando…" : "Validar token"}
          </Button>
        </FieldGroup>
        {status ? (
          <Alert variant={status.ok ? "default" : "destructive"}>
            <AlertDescription
              role="status"
              aria-live="polite"
              className={
                status.ok ? "font-medium text-asaph-deep" : "font-medium"
              }
            >
              {status.message}
            </AlertDescription>
          </Alert>
        ) : null}
        <p className="m-0 text-[0.88rem] text-ink-soft">
          Base URL: <code>{publicApiUrl}</code>
        </p>
      </CardContent>
    </Card>
  );
}
