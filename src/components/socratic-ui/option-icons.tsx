"use client";

import { useMemo } from "react";
import {
  Compass,
  Feather,
  Flame,
  Gem,
  Heart,
  Leaf,
  Lightbulb,
  Moon,
  Mountain,
  Palette,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

// Index-based so re-renders at the same position yield the same icon.
const ICON_POOL = [
  Sparkles,
  Compass,
  Rocket,
  Heart,
  Flame,
  Star,
  Leaf,
  Mountain,
  Gem,
  Lightbulb,
  Zap,
  Shield,
  Target,
  Trophy,
  Sun,
  Moon,
  Feather,
  Palette,
] as const;

export function generatedOptionIcon(index: number) {
  const Icon = ICON_POOL[index % ICON_POOL.length];
  return <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />;
}

/**
 * Returns a new items array with a generated lucide icon injected per
 * position when `enabled` is true; otherwise returns the input untouched.
 * Memoised on `[items, enabled]` so scenario tweaks don't reallocate.
 */
export function useGeneratedOptionIcons<T extends object>(
  items: T[],
  enabled: boolean | undefined,
): T[] {
  return useMemo(
    () =>
      enabled
        ? items.map((item, index) => ({
            ...item,
            icon: generatedOptionIcon(index),
          }))
        : items,
    [items, enabled],
  );
}
