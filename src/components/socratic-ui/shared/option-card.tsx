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
}) {
  // Vertical layout only applies when we actually have an icon to stack
  // — otherwise there's nothing to rotate and we fall back to horizontal.
  const isVertical = iconLayout === "vertical" && icon !== undefined;
  const isCentered = iconAlignment === "center";
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "relative rounded-xl border bg-card transition-colors",
        "border-border",
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
        selected && "border-primary bg-[var(--accent-soft)]",
        disabled && "cursor-default opacity-40",
        className,
      )}
    >
      {icon !== undefined ? (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg border transition-colors",
            isVertical ? "h-12 w-12" : "h-9 w-9",
            selected
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/80 bg-muted/60 text-foreground/70",
          )}
          aria-hidden
        >
          {icon}
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
            selected ? "text-primary" : "text-foreground",
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
      {selected && indicator === undefined ? (
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
