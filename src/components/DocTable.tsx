import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  headers: string[];
  rows: React.ReactNode[][];
};

export function DocTable({ headers, rows }: Props) {
  return (
    <div className="overflow-hidden rounded-xl bg-card/70 ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="px-3.5 text-[0.72rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  className="px-3.5 py-2.5 align-top whitespace-normal text-ink-soft"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
