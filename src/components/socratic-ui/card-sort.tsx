"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  CARD_SORT_HINTS,
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";

export type CardSortBucket = {
  /** Stable identifier used as the key in the `value` map. */
  id: string;
  title: string;
  subtitle?: string;
  /**
   * Visual tone for the bucket card. `affirm` is the warm accent (must
   * have), `muted` is the out-of-scope dim, `neutral` is the middle
   * ground. Defaults to `neutral`.
   */
  tone?: "affirm" | "neutral" | "muted";
};

export type CardSortItem = {
  title: string;
  subtitle?: string;
};

export interface CardSortProps {
  question: string;
  subtitle?: string;
  buckets: CardSortBucket[];
  items: CardSortItem[];
  /** Map of bucket id → titles of items placed in that bucket. */
  value: Record<string, string[]>;
  onChange: (value: Record<string, string[]>) => void;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Multi-bucket triage. Pick a bucket to make it active, then tap items in
 * the unplaced list to drop them in. Placed items render inside their
 * bucket panel with a remove affordance that sends them back to the
 * unplaced list. Keyboard users rove between the bucket row and the
 * unplaced item list independently.
 */
export function CardSort({
  question,
  subtitle,
  buckets,
  items,
  value,
  onChange,
  number,
  motion,
}: CardSortProps) {
  const [activeBucketId, setActiveBucketId] = React.useState<string | null>(
    () => buckets[0]?.id ?? null,
  );

  // Derive the unplaced list from the value map — the value is the
  // source of truth for which items belong to which bucket, so rebuilding
  // this on every render keeps rearrangements cheap and side-effect free.
  const placedTitles = React.useMemo(() => {
    const set = new Set<string>();
    for (const titles of Object.values(value)) {
      for (const title of titles) set.add(title);
    }
    return set;
  }, [value]);
  const unplaced = React.useMemo(
    () => items.filter((item) => !placedTitles.has(item.title)),
    [items, placedTitles],
  );

  const itemByTitle = React.useMemo(
    () => new Map(items.map((item) => [item.title, item])),
    [items],
  );

  const placeInActive = (title: string) => {
    if (!activeBucketId) return;
    const current = value[activeBucketId] ?? [];
    if (current.includes(title)) return;
    onChange({ ...value, [activeBucketId]: [...current, title] });
  };

  const removeFromBucket = (bucketId: string, title: string) => {
    const current = value[bucketId] ?? [];
    onChange({
      ...value,
      [bucketId]: current.filter((item) => item !== title),
    });
  };

  const totalPlaced = placedTitles.size;

  // ─── Keyboard roving focus ────────────────────────────────────────────
  // Two independent lists: buckets (horizontal) and unplaced items (vertical).
  const bucketRoving = useRovingFocus({
    count: buckets.length,
    orientation: "horizontal",
    initialIndex: Math.max(
      0,
      buckets.findIndex((b) => b.id === activeBucketId),
    ),
    onActivate: (index) => {
      const bucket = buckets[index];
      if (!bucket) return;
      setActiveBucketId((current) => (current === bucket.id ? null : bucket.id));
    },
  });
  const itemRoving = useRovingFocus({
    count: unplaced.length,
    orientation: "vertical",
    onActivate: (index) => {
      const item = unplaced[index];
      if (!item) return;
      placeInActive(item.title);
    },
  });

  const focusFirst = React.useCallback(() => {
    // Items are the primary action — start there when the active
    // sequence step swaps to this component.
    if (unplaced.length > 0) {
      itemRoving.focusItem(0);
    } else {
      bucketRoving.focusItem(0);
    }
    // The roving functions are stable refs; omitting from deps keeps
    // re-focus from firing on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unplaced.length]);

  const sequence = useSequenceQuestion({
    canSubmit: totalPlaced > 0,
    focusFirst,
    hints: CARD_SORT_HINTS,
  });

  const statusText =
    totalPlaced > 0
      ? `${totalPlaced} of ${items.length} placed`
      : `Pick a bucket, then tap items to sort`;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        sequence || totalPlaced > 0 ? (
          <QuestionFooter statusText={statusText} />
        ) : null
      }
    >
      <div className="flex flex-col gap-4 px-7 pb-2">
        {/* Bucket row — active state drives where newly-tapped items go. */}
        <div
          role="radiogroup"
          aria-label="Buckets"
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${buckets.length}, 1fr)` }}
        >
          {buckets.map((bucket, index) => {
            const isActive = bucket.id === activeBucketId;
            const count = (value[bucket.id] ?? []).length;
            const tone = bucket.tone ?? "neutral";
            return (
              <button
                key={bucket.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() =>
                  setActiveBucketId((current) =>
                    current === bucket.id ? null : bucket.id,
                  )
                }
                className={cn(
                  "flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
                  bucketToneClass(tone, isActive),
                )}
                {...bucketRoving.getItemProps(index)}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold leading-tight">
                    {bucket.title}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      isActive ? "text-current" : "text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </div>
                {bucket.subtitle ? (
                  <span
                    className={cn(
                      "text-[11px] leading-snug",
                      isActive
                        ? "text-current/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {bucket.subtitle}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Placed items, grouped by bucket. Each row is its own click
            target to send the item back to the unplaced list. */}
        <MotionStage motion={motion} className="flex flex-col gap-2.5">
          {buckets.map((bucket) => {
            const titles = value[bucket.id] ?? [];
            if (titles.length === 0) return null;
            const tone = bucket.tone ?? "neutral";
            return (
              <div key={bucket.id} className="flex flex-col gap-1.5">
                <div className="flex flex-col gap-1.5">
                  {titles.map((title) => {
                    const item = itemByTitle.get(title);
                    if (!item) return null;
                    return (
                      <MotionItem motion={motion} key={title}>
                        <button
                          type="button"
                          onClick={() => removeFromBucket(bucket.id, title)}
                          aria-label={`Remove ${title} from ${bucket.title}`}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors",
                            "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
                            placedItemToneClass(tone),
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-semibold leading-tight">
                              {item.title}
                            </div>
                            {item.subtitle ? (
                              <div className="mt-0.5 text-[11px] leading-snug opacity-80">
                                {item.subtitle}
                              </div>
                            ) : null}
                          </div>
                          <X className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                        </button>
                      </MotionItem>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </MotionStage>

        {/* Unplaced items — disabled until a bucket is active. */}
        {unplaced.length > 0 ? (
          <MotionStage motion={motion} className="flex flex-col gap-2">
            {unplaced.map((item, index) => {
              const disabled = activeBucketId === null;
              const focused = itemRoving.activeIndex === index;
              return (
                <MotionItem motion={motion} key={item.title}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => placeInActive(item.title)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-3 text-left transition-colors",
                      "outline-hidden focus-visible:bg-muted/60",
                      focused && "bg-muted/60",
                      disabled && "cursor-default opacity-40",
                      !disabled && "hover:bg-muted/40",
                    )}
                    {...itemRoving.getItemProps(index)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold leading-tight text-foreground">
                        {item.title}
                      </div>
                      {item.subtitle ? (
                        <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                          {item.subtitle}
                        </div>
                      ) : null}
                    </div>
                  </button>
                </MotionItem>
              );
            })}
          </MotionStage>
        ) : null}
      </div>
    </QuestionCard>
  );
}

function bucketToneClass(
  tone: "affirm" | "neutral" | "muted",
  active: boolean,
): string {
  // Active state paints the tone color; inactive sits on the card
  // background with a muted border. Negation-tone is intentionally
  // absent — product-spec buckets are affirmative (keep/trim), not
  // destructive (eliminate).
  if (!active) {
    return "border-border bg-card text-foreground hover:bg-muted/40";
  }
  switch (tone) {
    case "affirm":
      return "border-primary bg-[var(--accent-soft)] text-primary";
    case "muted":
      return "border-border bg-muted text-[var(--text-soft)]";
    case "neutral":
    default:
      return "border-primary/50 bg-primary/5 text-foreground";
  }
}

function placedItemToneClass(
  tone: "affirm" | "neutral" | "muted",
): string {
  switch (tone) {
    case "affirm":
      return "border-primary/40 bg-[var(--accent-soft)] text-primary hover:border-primary/70";
    case "muted":
      return "border-border/60 bg-muted/60 text-[var(--text-soft)] hover:border-border";
    case "neutral":
    default:
      return "border-primary/30 bg-primary/5 text-foreground hover:border-primary/60";
  }
}
