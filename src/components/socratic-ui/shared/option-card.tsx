import * as React from "react";

import { cn } from "@/lib/utils";

import type { OptionIconAlignment, OptionIconLayout } from "./icon-settings";

export function OptionCard({
  title,
  subtitle,
  selected,
  onSelect,
  disabled,
  dashed,
  indicator,
  icon,
  iconLayout = "horizontal",
  iconAlignment = "left",
  className,
  tone = "default",
  ariaLabel,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  dashed?: boolean;
  indicator?: React.ReactNode;
  icon?: React.ReactNode;
  iconLayout?: OptionIconLayout;
  iconAlignment?: OptionIconAlignment;
  className?: string;
  /**
   * `default` is the affirmative-pick styling. `negation` paints the
   * eliminated/killed state used by `NegationSelect` — selected swaps to
   * the negation palette, the chip shows ✕ instead of the icon, and the
   * trailing ✓ is suppressed.
   */
  tone?: "default" | "negation";
  /** Forwarded to the underlying button for callers that need a richer label. */
  ariaLabel?: string;
}) {
  const isNegation = tone === "negation";
  // Vertical layout only applies when we actually have an icon to stack
  // — otherwise there's nothing to rotate and we fall back to horizontal.
  const isVertical = iconLayout === "vertical" && icon !== undefined;
  const isCentered = iconAlignment === "center";
  // Negation tone always renders a chip slot (even without an icon) so the
  // killed ✕ glyph has somewhere to live; default tone only renders one when
  // an icon is supplied.
  const showChip = icon !== undefined || isNegation;
  const hasIconBox = icon !== undefined || isVertical;
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        "relative rounded-xl border bg-card transition-colors",
        "border-border",
        // Match OptionRow's focus model: suppress the default outline and
        // paint a custom ring so keyboard focus is visible on tile mode.
        "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
        isVertical
          ? cn(
              "flex h-full w-full flex-col gap-3 px-4 pb-4 pt-5",
              isCentered
                ? "items-center text-center"
                : "items-start text-left",
            )
          : cn(
              "flex w-full items-center gap-3.5 px-4 py-3.5",
              isCentered ? "justify-center text-center" : "text-left",
            ),
        // Dashed only applies when unselected — selecting snaps it to a solid border.
        !selected && dashed && "border-dashed",
        // Selected styling diverges by tone: negation paints the killed
        // state, default paints the affirmed-selection accent.
        selected &&
          (isNegation
            ? "border-[color-mix(in_oklab,var(--negation)_25%,transparent)] bg-[var(--negation-soft)] opacity-60"
            : "border-primary bg-[var(--accent-soft)]"),
        disabled && "cursor-default opacity-40",
        className,
      )}
    >
      {showChip ? (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center transition-colors",
            // Three sizes: large (vertical icon), medium (horizontal icon),
            // small (negation without icon — borderless to match the
            // pre-refactor negation row chrome).
            isVertical
              ? "h-12 w-12 rounded-lg border"
              : icon !== undefined
                ? "h-9 w-9 rounded-lg border"
                : "h-7 w-7 rounded-md text-sm font-bold",
            selected && isNegation
              ? hasIconBox
                ? "border-[color-mix(in_oklab,var(--negation)_25%,transparent)] bg-[color-mix(in_oklab,var(--negation)_18%,transparent)] text-[var(--negation)]"
                : "bg-[color-mix(in_oklab,var(--negation)_18%,transparent)] text-[var(--negation)]"
              : selected
                ? "border-primary/40 bg-primary/10 text-primary"
                : icon !== undefined
                  ? "border-border/80 bg-muted/60 text-foreground/70"
                  : "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          {selected && isNegation ? "✕" : icon}
        </span>
      ) : null}
      {indicator !== undefined ? (
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[13px] font-bold transition-colors",
            isVertical && "absolute right-2.5 top-2.5",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {indicator}
        </span>
      ) : null}
      <div
        className={cn(
          "min-w-0",
          isVertical ? "w-full" : isCentered ? "flex-initial" : "flex-1",
        )}
      >
        <div
          className={cn(
            "text-sm font-semibold leading-tight",
            selected && isNegation
              ? "text-[var(--negation)] line-through"
              : selected
                ? "text-primary"
                : "text-foreground",
          )}
        >
          {title}
        </div>
        {subtitle ? (
          <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {subtitle}
          </div>
        ) : null}
      </div>
      {selected && !isNegation && indicator === undefined ? (
        <span
          className={cn(
            "text-base text-primary",
            isVertical ? "absolute right-2.5 top-2.5" : "shrink-0",
          )}
          aria-hidden
        >
          ✓
        </span>
      ) : null}
    </button>
  );
}
