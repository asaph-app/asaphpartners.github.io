const LINKS = [
  { href: "#pre-requisitos", label: "Pré-requisitos" },
  { href: "#credenciais", label: "Credenciais" },
  { href: "#conceitos", label: "Conceitos" },
  { href: "#fluxo", label: "Fluxo de pareamento" },
  { href: "#webhook", label: "Seu webhook" },
  { href: "#assinatura", label: "Assinatura HMAC" },
  { href: "#autenticacao", label: "Autenticação" },
  { href: "#endpoints", label: "Endpoints" },
  { href: "#erros", label: "Erros e boas práticas" },
];

export function TableOfContents() {
  return (
    <nav
      aria-label="Sumário"
      className="sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-auto py-1 max-lg:static max-lg:mb-4 max-lg:flex max-lg:max-h-none max-lg:flex-wrap max-lg:gap-x-3 max-lg:gap-y-1 max-lg:border-b max-lg:border-border max-lg:pb-3"
    >
      <div className="mb-5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-asaph-deep max-lg:mb-2 max-lg:w-full">
        asaph · Parceiros
      </div>
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="block border-l-2 border-transparent py-1.5 pl-3 text-[0.86rem] text-ink-soft no-underline transition-colors hover:border-asaph hover:text-asaph-deep max-lg:border-0 max-lg:px-0"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
