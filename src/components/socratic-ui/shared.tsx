"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * SectionLabel — the numbered header that sits above every Socratic UI
 * component. Mirrors the design language from reference/structured-chat-inputs.jsx.
 */
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

/**
 * OptionCard — the full-width tappable card that appears in single, multi,
 * priority, and other selection components. Controlled via `selected` and
 * `onSelect`. The optional `indicator` slot is used by PriorityRank to show
 * the rank number.
 */
export function OptionCard({
  title,
  subtitle,
  selected,
  onSelect,
  disabled,
  dashed,
  indicator,
  className,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  dashed?: boolean;
  indicator?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-xl border bg-card px-4 py-3.5 text-left transition-colors",
        "border-border",
        // Dashed only applies when not selected — selecting a card snaps it to a solid border.
        !selected && dashed && "border-dashed",
        selected && "border-primary bg-[var(--accent-soft)]",
        disabled && "cursor-default opacity-40",
        className,
      )}
    >
      {indicator !== undefined ? (
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[13px] font-bold transition-colors",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {indicator}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
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
        <span className="shrink-0 text-base text-primary" aria-hidden>
          ✓
        </span>
      ) : null}
    </button>
  );
}

/**
 * SuccessSummary — the green confirmation pill that appears at the bottom of
 * a component once it's been completed (e.g. all blanks filled, both
 * dimensions answered).
 */
export function SuccessSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3.5 rounded-lg border border-[color-mix(in_oklab,var(--success)_30%,transparent)] bg-[var(--success-soft)] px-4 py-3 text-[13px] font-medium text-[var(--success)]">
      ✓ {children}
    </div>
  );
}
