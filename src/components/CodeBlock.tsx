type Props = {
  children: string;
  className?: string;
};

export function CodeBlock({ children, className = "" }: Props) {
  return (
    <pre
      className={`overflow-x-auto rounded-[14px] bg-[var(--code-bg)] px-5 py-4 font-mono text-[0.8rem] leading-relaxed text-[var(--code-fg)] shadow-[0_18px_50px_rgba(15,20,24,0.08)] ${className}`}
    >
      <code>{children}</code>
    </pre>
  );
}
