"use client";

import * as React from "react";
import { Check, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

export type OptionRowLeading =
  | { kind: "none" }
  | { kind: "number"; value: number }
  | { kind: "checkbox" }
  | { kind: "negation"; killed: boolean }
  | { kind: "icon"; node: React.ReactNode };

/**
 * Shared container classes for a list of `OptionRow`s. Adds 6px of breathing
 * room from the question card, and draws a hairline between rows — suppressed
 * on the borders that touch the currently-selected row so the rounded pill
 * reads cleanly. Works whether `MotionItem` wraps each row in a div or not
 * (we key off both the element itself and any descendant with aria-pressed).
 */
export const optionListClassName =
  "p-1.5 " +
  "[&>*:not(:first-child)]:border-t-[1px] [&>*:not(:first-child)]:border-t-border/60 " +
  "[&>[aria-pressed=true]]:!border-t-transparent " +
  "[&>*:has([aria-pressed=true])]:!border-t-transparent " +
  "[&>[aria-pressed=true]+*]:!border-t-transparent " +
  "[&>*:has([aria-pressed=true])+*]:!border-t-transparent " +
  "[&>[data-focused=true]]:!border-t-transparent " +
  "[&>*:has([data-focused=true])]:!border-t-transparent " +
  "[&>[data-focused=true]+*]:!border-t-transparent " +
  "[&>*:has([data-focused=true])+*]:!border-t-transparent " +
  "[&>*:focus-visible]:!border-t-transparent " +
  "[&>*:has(:focus-visible)]:!border-t-transparent " +
  "[&>*:focus-visible+*]:!border-t-transparent " +
  "[&>*:has(:focus-visible)+*]:!border-t-transparent " +
  "[&>[data-freeform=true]]:!border-t-transparent " +
  "[&>*:has([data-freeform=true])]:!border-t-transparent";

export interface OptionRowProps {
  title: string;
  subtitle?: string;
  /** AI-supplied recommendation reason. Renders a green shimmer line beneath the subtitle. */
  recommended?: string;
  selected: boolean;
  onSelect: () => void;
  leading?: OptionRowLeading;
  /** Fires when the three-dot menu overlay is clicked — independent of `onSelect`. */
  onMenuClick?: () => void;
  /** Set to false to hide the three-dot menu overlay for a specific row. */
  showMenu?: boolean;
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
  recommended,
  selected,
  onSelect,
  leading = { kind: "none" },
  onMenuClick,
  showMenu = true,
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
    <div
      className={cn(
        "group relative rounded-lg transition-colors",
        focused && "bg-muted/60",
        selected && "bg-[var(--accent-soft)]",
        killed && "bg-[var(--negation-soft)] opacity-70",
        disabled && "opacity-40",
        className,
      )}
    >
      <button
        type="button"
        ref={rowRef}
        onClick={onSelect}
        disabled={disabled}
        aria-pressed={selected}
        data-focused={focused ? "true" : undefined}
        {...restRowProps}
        className={cn(
          "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors",
          "outline-hidden focus-visible:bg-muted/60",
          showMenu && "pr-12",
          disabled && "cursor-default",
          rowClassName,
        )}
      >
        <OptionRowLeadingSlot leading={leading} selected={selected} />
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "text-base font-medium leading-tight text-foreground",
              tone === "negation" &&
                killed &&
                "text-[var(--negation)] line-through",
            )}
          >
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-sm leading-snug text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
          {recommended ? (
            <div className="text-shimmer-success mt-1 text-sm leading-snug">
              Recommended — {recommended}
            </div>
          ) : null}
        </div>
      </button>
      {showMenu ? (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Options"
          tabIndex={-1}
          className={cn(
            "absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors",
            "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      ) : null}
    </div>
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
            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] font-mono text-sm font-normal transition-colors",
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
            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-sm font-normal transition-colors",
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
            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-muted-foreground transition-colors",
            selected ? "bg-primary/10 text-primary" : "bg-muted",
          )}
        >
          {leading.node}
        </span>
      );
  }
}
