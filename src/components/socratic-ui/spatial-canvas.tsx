"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SPATIAL_CANVAS_HINTS,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";

export type SpatialCanvasItem = {
  /** Stable identifier used as the key in `value`. */
  id: string;
  title: string;
  subtitle?: string;
};

export type SpatialCanvasPosition = {
  /** 0 (low) to 1 (high) on the horizontal axis. */
  x: number;
  /** 0 (low) to 1 (high) on the vertical axis. */
  y: number;
};

export interface SpatialCanvasProps {
  question: string;
  subtitle?: string;
  items: SpatialCanvasItem[];
  xAxisLabel: string;
  yAxisLabel: string;
  xLowLabel?: string;
  xHighLabel?: string;
  yLowLabel?: string;
  yHighLabel?: string;
  /** Map of item id → canvas position. Unplaced items are absent from this map. */
  value: Record<string, SpatialCanvasPosition>;
  onChange: (value: Record<string, SpatialCanvasPosition>) => void;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Two-axis placement canvas. Tap an item to pick it up, then tap the
 * canvas to drop it at that position. Already-placed items render as
 * tokens; tapping a token removes the placement and returns the item
 * to the pick-up list.
 *
 * Keyboard path: the item list is a vertical roving-focus list.
 * Pressing Enter on an unplaced item places it at the current cursor
 * position (the crosshair the user can nudge with the arrow keys after
 * Tabbing into the canvas). Mouse-first users never see the cursor.
 */
export function SpatialCanvas({
  question,
  subtitle,
  items,
  xAxisLabel,
  yAxisLabel,
  xLowLabel,
  xHighLabel,
  yLowLabel,
  yHighLabel,
  value,
  onChange,
  number,
  motion,
}: SpatialCanvasProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  // Cursor tracked in normalized coords (0-1). Starts at the centre so
  // keyboard users can land on a sensible default.
  const [cursor, setCursor] = React.useState<SpatialCanvasPosition>({
    x: 0.5,
    y: 0.5,
  });

  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Memoised so the unplaced array's identity is stable across renders
  // that don't actually move items — that in turn keeps `useRovingFocus`'s
  // count steady and prevents `focusItem` from re-identifying every render.
  const { placed, unplaced } = React.useMemo(() => {
    const placedKeys = Object.keys(value);
    const placedSet = new Set(placedKeys);
    return {
      placed: placedKeys,
      unplaced: items.filter((item) => !placedSet.has(item.id)),
    };
  }, [value, items]);

  const setPosition = (id: string, position: SpatialCanvasPosition) => {
    onChange({ ...value, [id]: position });
  };

  const unplace = (id: string) => {
    const next = { ...value };
    delete next[id];
    onChange(next);
  };

  const handleCanvasPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!activeId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp01((event.clientX - rect.left) / rect.width);
    // Y is inverted so the top of the canvas reads as "high" on the Y axis.
    const y = clamp01(1 - (event.clientY - rect.top) / rect.height);
    setPosition(activeId, { x, y });
    setCursor({ x, y });
    setActiveId(null);
  };

  const itemRoving = useRovingFocus({
    count: unplaced.length,
    orientation: "vertical",
    onActivate: (index) => {
      const item = unplaced[index];
      if (!item) return;
      // Enter on a list item places it at the current cursor —
      // matches the mouse path's "picked up" → "dropped" handoff
      // without needing a second gesture.
      setPosition(item.id, { ...cursor });
      setActiveId(null);
    },
  });

  // Stable callback so `useSequenceQuestion`'s focus effect doesn't refire
  // every time placement shifts `unplaced.length` and steals focus back to
  // the top of the list mid-interaction.
  const focusTargetsRef = React.useRef({
    itemRoving,
    hasUnplaced: unplaced.length > 0,
  });
  React.useLayoutEffect(() => {
    focusTargetsRef.current = {
      itemRoving,
      hasUnplaced: unplaced.length > 0,
    };
  });
  const focusFirst = React.useCallback(() => {
    const { hasUnplaced, itemRoving: items } = focusTargetsRef.current;
    if (hasUnplaced) items.focusItem(0);
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit: placed.length > 0,
    focusFirst,
    hints: SPATIAL_CANVAS_HINTS,
  });

  // Allowing the canvas to be Tab-focusable gives keyboard users a
  // steerable cursor — arrow keys nudge 5% per press; Enter drops the
  // currently picked-up item at the cursor.
  const handleCanvasKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const step = event.shiftKey ? 0.1 : 0.05;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setCursor((prev) => ({ ...prev, y: clamp01(prev.y + step) }));
        break;
      case "ArrowDown":
        event.preventDefault();
        setCursor((prev) => ({ ...prev, y: clamp01(prev.y - step) }));
        break;
      case "ArrowLeft":
        event.preventDefault();
        setCursor((prev) => ({ ...prev, x: clamp01(prev.x - step) }));
        break;
      case "ArrowRight":
        event.preventDefault();
        setCursor((prev) => ({ ...prev, x: clamp01(prev.x + step) }));
        break;
      case "Enter":
      case " ":
        if (activeId) {
          event.preventDefault();
          setPosition(activeId, { ...cursor });
          setActiveId(null);
        }
        break;
    }
  };

  const statusText =
    placed.length > 0
      ? `${placed.length} of ${items.length} placed`
      : activeId
        ? `Tap the canvas to place`
        : `Tap an item to pick it up`;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        sequence || placed.length > 0 ? (
          <QuestionFooter statusText={statusText} />
        ) : null
      }
    >
      <div className="flex flex-col gap-4 px-7 pb-2">
        <div
          ref={canvasRef}
          role="application"
          aria-label={`Placement canvas. ${xAxisLabel} horizontal, ${yAxisLabel} vertical. Use arrow keys to move the cursor, Enter to place the picked-up item.`}
          tabIndex={0}
          onPointerUp={handleCanvasPointer}
          onKeyDown={handleCanvasKeyDown}
          className={cn(
            "relative h-[280px] w-full overflow-hidden rounded-xl border border-border bg-muted/40",
            "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
            activeId ? "cursor-crosshair" : "cursor-default",
          )}
        >
          {/* Quadrant lines */}
          <div
            className="pointer-events-none absolute bottom-0 top-0 w-px bg-border/80"
            style={{ left: "50%" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-0 right-0 h-px bg-border/80"
            style={{ top: "50%" }}
            aria-hidden
          />

          {/* Axis labels — primary axis names live in the centre, optional
              low/high end labels cling to the corners. */}
          <span
            className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-muted-foreground"
            aria-hidden
          >
            {xAxisLabel} →
          </span>
          <span
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-semibold text-muted-foreground"
            aria-hidden
          >
            {yAxisLabel} →
          </span>
          {xLowLabel ? (
            <span
              className="pointer-events-none absolute bottom-1.5 left-2 text-[10px] text-muted-foreground"
              aria-hidden
            >
              {xLowLabel}
            </span>
          ) : null}
          {xHighLabel ? (
            <span
              className="pointer-events-none absolute bottom-1.5 right-2 text-[10px] text-muted-foreground"
              aria-hidden
            >
              {xHighLabel}
            </span>
          ) : null}
          {yLowLabel ? (
            <span
              className="pointer-events-none absolute bottom-1.5 left-1/2 ml-3 text-[10px] text-muted-foreground"
              aria-hidden
            >
              {yLowLabel}
            </span>
          ) : null}
          {yHighLabel ? (
            <span
              className="pointer-events-none absolute top-1.5 left-1/2 ml-3 text-[10px] text-muted-foreground"
              aria-hidden
            >
              {yHighLabel}
            </span>
          ) : null}

          {/* Keyboard cursor — only visible when the canvas has focus
              OR when an item is picked up, to avoid distracting the
              mouse-primary flow. */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background opacity-0 transition-opacity",
              activeId && "opacity-100",
            )}
            style={{
              left: `${cursor.x * 100}%`,
              top: `${(1 - cursor.y) * 100}%`,
            }}
          />

          {/* Placed tokens */}
          {items.map((item) => {
            const position = value[item.id];
            if (!position) return null;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  unplace(item.id);
                }}
                aria-label={`Remove ${item.title} from the canvas`}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm transition-transform",
                  "outline-hidden hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary/60",
                )}
                style={{
                  left: `${position.x * 100}%`,
                  top: `${(1 - position.y) * 100}%`,
                }}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {unplaced.length > 0 ? (
          <MotionStage motion={motion} className="flex flex-col gap-2">
            {unplaced.map((item, index) => {
              const isActive = activeId === item.id;
              const focused = itemRoving.activeIndex === index;
              return (
                <MotionItem motion={motion} key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveId(isActive ? null : item.id)
                    }
                    aria-pressed={isActive}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      "outline-hidden focus-visible:bg-muted/60",
                      focused && "bg-muted/60",
                      isActive
                        ? "border-primary bg-[var(--accent-soft)]"
                        : "border-dashed border-border bg-card hover:bg-muted/40",
                    )}
                    {...itemRoving.getItemProps(index)}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "text-[13px] font-semibold leading-tight",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                        {item.subtitle ??
                          (isActive
                            ? "Tap the canvas to place"
                            : "Tap to pick up")}
                      </div>
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

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
