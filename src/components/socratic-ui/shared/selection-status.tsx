import { cn } from "@/lib/utils";

/**
 * Inline status fragment: `"N selected"` with an optional soft-cap hint.
 *
 * Designed to sit inside `QuestionFooter.statusText` or a standalone `<p>`.
 * Used by SingleSelect (multi-mode) and MultiSelect.
 */
export function SelectionStatus({
  count,
  suggested,
}: {
  count: number;
  suggested?: number;
}) {
  return (
    <>
      <span className="font-semibold text-foreground">{count}</span> selected
      {suggested != null ? (
        <>
          <span className="mx-1.5 text-muted-foreground/40">·</span>
          <span
            className={cn(
              count > suggested &&
                "font-medium text-amber-600 dark:text-amber-400",
            )}
          >
            {suggested} suggested
          </span>
        </>
      ) : null}
    </>
  );
}
