type Props = {
  children: React.ReactNode;
  variant?: "tip" | "warn";
};

export function Callout({ children, variant = "tip" }: Props) {
  const styles =
    variant === "warn"
      ? "border-[rgba(138,90,18,0.25)] bg-[var(--warn-soft)] [&_strong]:text-[var(--warn)]"
      : "border-[rgba(252,41,71,0.2)] bg-asaph-soft/70 [&_strong]:text-asaph-deep";

  return (
    <div className={`rounded-[14px] border px-4 py-3.5 text-[0.95rem] ${styles}`}>
      {children}
    </div>
  );
}
