"use client";

import * as React from "react";

type Orientation = "vertical" | "horizontal";

export interface UseRovingFocusOptions {
  count: number;
  orientation?: Orientation;
  initialIndex?: number;
  /** Called when the user presses Enter on a focused row. */
  onActivate?: (index: number) => void;
  /**
   * Called whenever the active index changes. Useful for syncing a
   * parent `focused` highlight prop on the row.
   */
  onActiveChange?: (index: number) => void;
}

export interface RovingFocusItemProps<
  T extends HTMLElement = HTMLButtonElement,
> {
  ref: (el: T | null) => void;
  tabIndex: number;
  onKeyDown: React.KeyboardEventHandler<T>;
  onFocus: React.FocusEventHandler<T>;
  "data-roving-index": number;
}

export interface UseRovingFocusReturn<
  T extends HTMLElement = HTMLButtonElement,
> {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  /** Focus the row at `index`. Call after mount / after advancing. */
  focusItem: (index: number) => void;
  getItemProps: (index: number) => RovingFocusItemProps<T>;
}

/**
 * Roving-tabindex keyboard navigation for a list of focusable rows.
 *
 * True roving (not `aria-activedescendant`) so each row stays a real
 * focusable element. That matters because:
 *   - screen-reader interaction patterns are more robust on real focus
 *   - drag handles / trailing controls inside rows can be focused too
 *
 * The element-type generic defaults to `HTMLButtonElement` so the typical
 * "list of buttons" call sites stay clean. Lists that mix element kinds
 * (e.g. SingleSelect's option buttons + freeform input) instantiate the
 * hook with a union type so a single ref array can hold both.
 *
 * Handles ↑/↓ (vertical) or ←/→ (horizontal), Home/End, Enter. ⌘Enter
 * is deliberately unhandled — the sequence orchestrator listens for it
 * at a higher level.
 */
export function useRovingFocus<T extends HTMLElement = HTMLButtonElement>({
  count,
  orientation = "vertical",
  initialIndex = 0,
  onActivate,
  onActiveChange,
}: UseRovingFocusOptions): UseRovingFocusReturn<T> {
  const [activeIndex, setActiveIndexState] = React.useState(() =>
    clampIndex(initialIndex, count),
  );
  const itemRefs = React.useRef<(T | null)[]>([]);
  const pendingFrame = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (pendingFrame.current !== null) {
        cancelAnimationFrame(pendingFrame.current);
      }
    };
  }, []);

  const setActiveIndex = React.useCallback(
    (i: number) => {
      const next = clampIndex(i, count);
      setActiveIndexState((prev) => {
        if (prev === next) return prev;
        onActiveChange?.(next);
        return next;
      });
    },
    [count, onActiveChange],
  );

  const focusItem = React.useCallback(
    (index: number) => {
      const next = clampIndex(index, count);
      setActiveIndex(next);
      // Defer to next paint so a just-mounted row has time to attach
      // its ref before focus.
      if (pendingFrame.current !== null) {
        cancelAnimationFrame(pendingFrame.current);
      }
      pendingFrame.current = requestAnimationFrame(() => {
        pendingFrame.current = null;
        itemRefs.current[next]?.focus();
      });
    },
    [count, setActiveIndex],
  );

  const getItemProps = React.useCallback(
    (index: number): RovingFocusItemProps<T> => ({
      ref: (el) => {
        itemRefs.current[index] = el;
      },
      tabIndex: index === activeIndex ? 0 : -1,
      "data-roving-index": index,
      onFocus: () => {
        // Mouse focus / programmatic focus should keep the cursor in
        // sync without needing an arrow-key round-trip.
        if (index !== activeIndex) {
          setActiveIndex(index);
        }
      },
      onKeyDown: (event) => {
        const forward =
          (orientation === "vertical" && event.key === "ArrowDown") ||
          (orientation === "horizontal" && event.key === "ArrowRight");
        const backward =
          (orientation === "vertical" && event.key === "ArrowUp") ||
          (orientation === "horizontal" && event.key === "ArrowLeft");

        if (forward) {
          event.preventDefault();
          const next = (activeIndex + 1) % count;
          setActiveIndex(next);
          itemRefs.current[next]?.focus();
          return;
        }
        if (backward) {
          event.preventDefault();
          const next = (activeIndex - 1 + count) % count;
          setActiveIndex(next);
          itemRefs.current[next]?.focus();
          return;
        }
        if (event.key === "Home") {
          event.preventDefault();
          setActiveIndex(0);
          itemRefs.current[0]?.focus();
          return;
        }
        if (event.key === "End") {
          event.preventDefault();
          const last = count - 1;
          setActiveIndex(last);
          itemRefs.current[last]?.focus();
          return;
        }
        if (event.key === "Enter" && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          onActivate?.(activeIndex);
          return;
        }
      },
    }),
    [activeIndex, count, onActivate, orientation, setActiveIndex],
  );

  return { activeIndex, setActiveIndex, focusItem, getItemProps };
}

function clampIndex(i: number, count: number): number {
  if (count <= 0) return 0;
  if (i < 0) return 0;
  if (i >= count) return count - 1;
  return i;
}
