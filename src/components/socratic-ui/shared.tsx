"use client";

import * as React from "react";
import { motion as m } from "motion/react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { defaultMotion, type SocraticMotion } from "./motion";

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

export type OptionIconLayout = "horizontal" | "vertical";
export type OptionIconAlignment = "left" | "center";

/**
 * Bundled icon-display settings threaded through the playground (rail
 * → chat → entry renderers). Kept separate from core component props so
 * `SingleSelect`/etc. stay unaware of the "show" toggle.
 */
export type OptionIconSettings = {
  show: boolean;
  layout: OptionIconLayout;
  alignment: OptionIconAlignment;
};

/**
 * Container class for a list of option cards. Vertical layout moves to
 * a 2-col grid so icon-on-top cards don't stretch the full row width.
 */
export function optionListClass(layout: OptionIconLayout) {
  return layout === "vertical"
    ? "grid grid-cols-2 gap-2"
    : "flex flex-col gap-2";
}

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

export function SuccessSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3.5 rounded-lg border border-[color-mix(in_oklab,var(--success)_30%,transparent)] bg-[var(--success-soft)] px-4 py-3 text-[13px] font-medium text-[var(--success)]">
      ✓ {children}
    </div>
  );
}

// ─── Motion primitives ───────────────────────────────────────────────────────
//
// Hard invariant: when `motion` is undefined every primitive below must
// render the same JSX it would have without us. The docs demos at
// /docs/components/* depend on this — they never pass `motion`, and we
// rely on the no-op branches here to keep their trees byte-identical.

export function MotionStage({
  motion: anim,
  children,
  className,
}: {
  motion?: SocraticMotion;
  children: React.ReactNode;
  className?: string;
}) {
  if (!anim?.enabled) {
    // Single-child stages (FillBlank) call without a className and rely
    // on the fragment branch so we don't add an extra wrapper div.
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return <>{children}</>;
  }
  const stagger = anim.stagger ?? defaultMotion.stagger;
  const delay = anim.delay ?? defaultMotion.delay;
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function MotionCard({
  motion: anim,
  children,
  className,
}: {
  motion?: SocraticMotion;
  children: React.ReactNode;
  className?: string;
}) {
  if (!anim?.enabled) {
    return <Card className={className}>{children}</Card>;
  }
  const duration = anim.duration ?? defaultMotion.duration;
  const delay = anim.delay ?? defaultMotion.delay;
  const ease = anim.ease ?? defaultMotion.ease;
  return (
    <m.div
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: duration * 1.2, ease, delay }}
    >
      <Card className={className}>{children}</Card>
    </m.div>
  );
}

export function MotionItem({
  motion: anim,
  children,
}: {
  motion?: SocraticMotion;
  children: React.ReactNode;
}) {
  if (!anim?.enabled) {
    return <>{children}</>;
  }
  const duration = anim.duration ?? defaultMotion.duration;
  const ease = anim.ease ?? defaultMotion.ease;
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: 6 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease },
        },
      }}
    >
      {children}
    </m.div>
  );
}
