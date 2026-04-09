"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type OptionRowLeading =
  | { kind: "none" }
  | { kind: "number"; value: number }
  | { kind: "checkbox" }
  | { kind: "negation"; killed: boolean }
  | { kind: "icon"; node: React.ReactNode };

export interface OptionRowProps {
  title: string;
  subtitle?: string;
  selected: boolean;
  onSelect: () => void;
  leading?: OptionRowLeading;
  trailing?: React.ReactNode;
  disabled?: boolean;
  /**
   * Keyboard-cursor highlight. Separate from `selected` so single-focus
   * roving and independent multi-select checkmarks can coexist — matches
   * the reference where a checked checkbox row is not necessarily
   * highlighted, only the cursor row is.
   */
  focused?: boolean;
  tone?: "default" | "negation";
  /** Destructured internally so the ref is attached natively. */
  rowProps?: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: (el: HTMLButtonElement | null) => void;
  };
  className?: string;
}

export function OptionRow({
  title,
  subtitle,
  selected,
  onSelect,
  leading = { kind: "none" },
  trailing,
  disabled,
  focused,
  tone = "default",
  rowProps,
  className,
}: OptionRowProps) {
  const killed = leading.kind === "negation" && leading.killed;
  const { ref: rowRef, className: rowClassName, ...restRowProps } =
    rowProps ?? {};
  return (
    <button
      type="button"
      ref={rowRef}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      {...restRowProps}
      className={cn(
        "group relative flex w-full items-center gap-4 px-5 py-4 text-left transition-colors",
        "outline-none focus-visible:bg-muted/60",
        focused && "bg-muted/60",
        selected && "bg-[var(--accent-soft)]",
        killed && "bg-[var(--negation-soft)] opacity-70",
        disabled && "cursor-default opacity-40",
        className,
        rowClassName,
      )}
    >
      <OptionRowLeadingSlot leading={leading} selected={selected} />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-[15px] font-semibold leading-tight text-foreground",
            tone === "negation" &&
              killed &&
              "text-[var(--negation)] line-through",
          )}
        >
          {title}
        </div>
        {subtitle ? (
          <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
            {subtitle}
          </div>
        ) : null}
      </div>
      {trailing !== undefined ? (
        <span className="flex shrink-0 items-center text-muted-foreground">
          {trailing}
        </span>
      ) : null}
    </button>
  );
}

function OptionRowLeadingSlot({
  leading,
  selected,
}: {
  leading: OptionRowLeading;
  selected: boolean;
}) {
  switch (leading.kind) {
    case "none":
      return null;
    case "number":
      return (
        <span
          aria-hidden
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-[15px] font-semibold transition-colors",
            selected
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground",
          )}
        >
          {leading.value}
        </span>
      );
    case "checkbox":
      return (
        <span
          aria-hidden
          className={cn(
            "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] border transition-colors",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-transparent",
          )}
        >
          {selected ? <Check className="size-[14px]" strokeWidth={3} /> : null}
        </span>
      );
    case "negation":
      return (
        <span
          aria-hidden
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[15px] font-bold transition-colors",
            leading.killed
              ? "bg-[color-mix(in_oklab,var(--negation)_18%,transparent)] text-[var(--negation)]"
              : "bg-muted text-muted-foreground",
          )}
        >
          {leading.killed ? "✕" : ""}
        </span>
      );
    case "icon":
      return (
        <span
          aria-hidden
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors",
            selected ? "bg-primary/10 text-primary" : "bg-muted",
          )}
        >
          {leading.node}
        </span>
      );
  }
}
