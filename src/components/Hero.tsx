export function Hero() {
  return (
    <header className="mb-11 animate-[rise_0.7s_ease_both]">
      <div className="mb-3.5 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-asaph-deep">
        Documentação da API
      </div>
      <h1 className="mb-4 text-[clamp(2.1rem,4vw,3rem)] font-semibold leading-[1.12] tracking-tight text-ink">
        Integração asaph para parceiros
      </h1>
      <p className="m-0 max-w-[38rem] text-[1.1rem] leading-relaxed text-ink-soft">
        Este guia explica como conectar seu produto ao asaph: exibir um QR Code
        (ou Base64) para parear um computador com uma organização, ativar a
        conexão e consumir ordens de culto e arquivos pela API{" "}
        <code>/partner</code>.
      </p>
    </header>
  );
}
