type Props = {
  headers: string[];
  rows: React.ReactNode[][];
};

export function DocTable({ headers, rows }: Props) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-white/70">
      <table className="w-full border-collapse text-[0.9rem]">
        <thead>
          <tr className="bg-white/55">
            {headers.map((header) => (
              <th
                key={header}
                className="px-3.5 py-2.5 text-left text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line">
              {row.map((cell, j) => (
                <td key={j} className="px-3.5 py-2.5 align-top text-ink-soft">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
