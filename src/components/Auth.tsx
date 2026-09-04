import { CodeBlock } from "@/components/CodeBlock";
import { DocTable } from "@/components/DocTable";
import { Section } from "@/components/Section";

export function Auth() {
  return (
    <Section
      id="autenticacao"
      title={
        <>
          Autenticação nas rotas <code>/partner</code>
        </>
      }
    >
      <p>Todas as rotas exigem:</p>
      <DocTable
        headers={["Header", "Valor"]}
        rows={[
          [
            <code key="a">Authorization</code>,
            <>
              <code>Bearer &lt;token de identidade&gt;</code> (o JWT desta
              página)
            </>,
          ],
          [
            <code key="x">X-Device-Code</code>,
            <>
              O <code>payload</code> recebido no webhook (código assinado
              completo)
            </>,
          ],
        ]}
      />
      <CodeBlock>{`Authorization: Bearer <token de identidade>
X-Device-Code: <payload do webhook>
Content-Type: application/json`}</CodeBlock>
      <p>
        O handshake ativa o dispositivo. Depois disso, as demais rotas exigem
        status <code>active</code>.
      </p>
    </Section>
  );
}
