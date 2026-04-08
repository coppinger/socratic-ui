import * as React from "react";

export interface PropDef {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: React.ReactNode;
}

export function PropsTable({ props }: { props: PropDef[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Prop</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={index > 0 ? "border-t border-border" : undefined}
            >
              <td className="px-4 py-3 align-top">
                <div className="flex items-baseline gap-1.5">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">
                    {prop.name}
                  </code>
                  {prop.required ? (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
                      required
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                  {prop.description}
                </p>
              </td>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-[12px] text-muted-foreground">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-[12px] text-muted-foreground">
                  {prop.defaultValue ?? "—"}
                </code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
