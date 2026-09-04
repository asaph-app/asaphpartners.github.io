"use client";

import { useMemo, useState } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { usePartnerCredentials } from "@/components/PartnerCredentials";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type TryField = {
  name: string;
  label: string;
  kind: "path" | "query";
  placeholder?: string;
};

type ConfirmConfig = {
  title: string;
  description: string;
  actionLabel?: string;
};

type Props = {
  method: "GET" | "POST" | "DELETE";
  pathTemplate: string;
  fields?: TryField[];
  confirm?: ConfirmConfig;
};

type ProxyResult = {
  status: number;
  ok: boolean;
  body: unknown;
  message?: string;
};

function buildPath(template: string, values: Record<string, string>) {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = values[key]?.trim() ?? "";
    return encodeURIComponent(value);
  });
}

function formatBody(body: unknown) {
  if (body === null || body === undefined || body === "") {
    return "(empty)";
  }
  if (typeof body === "string") {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }
  return JSON.stringify(body, null, 2);
}

export function EndpointTry({
  method,
  pathTemplate,
  fields = [],
  confirm,
}: Props) {
  const { token, deviceCode } = usePartnerCredentials();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""])),
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProxyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const missingCredentials = !token.trim() || !deviceCode.trim();

  const resolvedPath = useMemo(
    () => buildPath(pathTemplate, values),
    [pathTemplate, values],
  );

  const pathReady = fields
    .filter((field) => field.kind === "path")
    .every((field) => values[field.name]?.trim());

  const canSend = !loading && !missingCredentials && pathReady;

  async function send() {
    if (missingCredentials) {
      setError("Preencha token e device code em Credenciais.");
      setResult(null);
      return;
    }

    if (!pathReady) {
      setError("Preencha os parâmetros de caminho obrigatórios.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const query = Object.fromEntries(
      fields
        .filter((field) => field.kind === "query")
        .map((field) => [field.name, values[field.name] ?? ""]),
    );

    try {
      const response = await fetch("/api/partner-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          path: resolvedPath,
          token: token.trim(),
          deviceCode: deviceCode.trim(),
          query,
        }),
      });
      const data = (await response.json()) as ProxyResult & {
        message?: string;
      };

      if (!response.ok && data.message && data.status === undefined) {
        setError(data.message);
        return;
      }

      setResult({
        status: data.status ?? response.status,
        ok: Boolean(data.ok),
        body: data.body ?? null,
        message: data.message,
      });
    } catch {
      setError("Falha ao chamar o proxy. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card size="sm" className="bg-muted/40 ring-foreground/10">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold tracking-wide text-ink uppercase">
          Try it
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {missingCredentials ? (
          <p className="m-0 text-sm text-muted-foreground">
            Informe o token e o device code em{" "}
            <a href="#credenciais" className="text-asaph-deep underline">
              Credenciais
            </a>{" "}
            para testar ao vivo.
          </p>
        ) : null}

        <p className="m-0 font-mono text-[0.8rem] text-ink-soft">
          <span className="font-semibold text-ink">{method}</span> {resolvedPath}
        </p>

        {fields.length > 0 ? (
          <FieldGroup className="gap-3">
            {fields.map((field) => (
              <Field key={field.name}>
                <FieldLabel htmlFor={`try-${pathTemplate}-${field.name}`}>
                  {field.label}
                </FieldLabel>
                <Input
                  id={`try-${pathTemplate}-${field.name}`}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  spellCheck={false}
                  className="bg-card font-mono text-[0.82rem]"
                />
              </Field>
            ))}
          </FieldGroup>
        ) : null}

        {confirm ? (
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger
              disabled={!canSend}
              render={
                <Button
                  variant="destructive"
                  disabled={!canSend}
                  className="w-fit font-semibold"
                />
              }
            >
              {loading ? <Spinner data-icon="inline-start" /> : null}
              {loading ? "Enviando…" : "Revogar dispositivo"}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirm.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={loading}
                  onClick={() => {
                    setConfirmOpen(false);
                    void send();
                  }}
                >
                  {confirm.actionLabel ?? "Confirmar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            type="button"
            onClick={send}
            disabled={!canSend}
            className="w-fit font-semibold"
          >
            {loading ? <Spinner data-icon="inline-start" /> : null}
            {loading ? "Enviando…" : "Enviar"}
          </Button>
        )}

        {error ? (
          <p className="m-0 text-sm font-medium text-destructive" role="status">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-md font-mono",
                  result.ok
                    ? "bg-asaph-soft text-asaph-deep"
                    : "bg-[#f6dede] text-[#7a2e2e]",
                )}
              >
                {result.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {result.ok ? "Sucesso" : "Erro"}
              </span>
            </div>
            <CodeBlock>{formatBody(result.body)}</CodeBlock>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
