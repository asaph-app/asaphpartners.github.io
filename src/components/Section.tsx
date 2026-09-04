import { Callout } from "@/components/Callout";

type Props = {
  children: React.ReactNode;
  id: string;
  title: React.ReactNode;
};

export function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="mt-12 mb-3.5 pt-2 text-[1.45rem] tracking-tight text-ink">
        {title}
      </h2>
      <div className="space-y-4 text-ink-soft [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1.5">
        {children}
      </div>
    </section>
  );
}

export { Callout };
