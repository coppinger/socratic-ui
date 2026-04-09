export function SectionLabel({
  number,
  title,
  subtitle,
}: {
  number?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      {number ? (
        <span className="mb-1.5 inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {number}
        </span>
      ) : null}
      <h3 className="text-[17px] font-semibold leading-snug text-foreground">
        {title}
      </h3>
      {subtitle ? (
        <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
