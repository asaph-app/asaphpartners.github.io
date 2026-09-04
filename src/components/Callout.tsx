import { InfoIcon, TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "tip" | "warn";
};

export function Callout({ children, variant = "tip" }: Props) {
  return (
    <Alert
      variant={variant === "warn" ? "destructive" : "default"}
      className={cn(
        variant === "warn"
          ? "border-[rgba(138,90,18,0.25)] bg-[var(--warn-soft)] text-[var(--warn)] *:data-[slot=alert-description]:text-[var(--warn)] *:[svg]:text-[var(--warn)] [&_strong]:text-[var(--warn)]"
          : "border-[rgba(252,41,71,0.2)] bg-asaph-soft/70 text-asaph-deep *:data-[slot=alert-description]:text-ink-soft *:[svg]:text-asaph-deep [&_strong]:text-asaph-deep",
      )}
    >
      {variant === "warn" ? <TriangleAlertIcon /> : <InfoIcon />}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
