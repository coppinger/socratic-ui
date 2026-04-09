"use client";

import * as React from "react";

export interface KeyboardHint {
  /** Visual key cap text (e.g. "↑↓", "Enter", "⌘ Enter", "Esc"). */
  keys: React.ReactNode;
  /** Descriptive label rendered after the keys (e.g. "to navigate"). */
  label: string;
}

/**
 * Muted hint strip rendered below the question card by
 * `QuestionSequence`. Always visible per the design decision — if we
 * ever need a focus-gated variant, add a `visibility` prop.
 */
export function KeyboardHintFooter({ hints }: { hints: KeyboardHint[] }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
      {hints.map((hint, index) => (
        <React.Fragment key={index}>
          {index > 0 ? (
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
          ) : null}
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-foreground/80">{hint.keys}</span>
            <span>{hint.label}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Preset hint lists per question kind ───────────────────────────────────

export const SINGLE_SELECT_HINTS: KeyboardHint[] = [
  { keys: "↑↓", label: "to navigate" },
  { keys: "Enter", label: "to select" },
  { keys: "Esc", label: "to skip" },
];

export const MULTI_SELECT_HINTS: KeyboardHint[] = [
  { keys: "↑↓", label: "to navigate" },
  { keys: "Enter", label: "to select" },
  { keys: "⌘ Enter", label: "to submit" },
  { keys: "Esc", label: "to skip" },
];

export const PRIORITY_RANK_HINTS: KeyboardHint[] = [
  { keys: "Drag", label: "to reorder" },
  { keys: "⌘ Enter", label: "to submit" },
  { keys: "Esc", label: "to skip" },
];

export const FILL_BLANK_HINTS: KeyboardHint[] = [
  { keys: "Tab", label: "to move between fields" },
  { keys: "⌘ Enter", label: "to submit" },
  { keys: "Esc", label: "to skip" },
];

export const NEGATION_SELECT_HINTS: KeyboardHint[] = [
  { keys: "↑↓", label: "to navigate" },
  { keys: "Enter", label: "to eliminate" },
  { keys: "⌘ Enter", label: "to submit" },
  { keys: "Esc", label: "to skip" },
];

export const OPEN_QUESTIONS_HINTS: KeyboardHint[] = [
  { keys: "Tab", label: "to move between fields" },
  { keys: "⌘ Enter", label: "to submit" },
  { keys: "Esc", label: "to skip" },
];

export const SPECTRUM_HINTS: KeyboardHint[] = [
  { keys: "← →", label: "to adjust" },
  { keys: "⌘ Enter", label: "to submit" },
  { keys: "Esc", label: "to skip" },
];

export const AGREEMENT_SPECTRUM_HINTS: KeyboardHint[] = [
  { keys: "Tab", label: "between statements" },
  { keys: "← →", label: "to rate" },
  { keys: "⌘ Enter", label: "to submit" },
  { keys: "Esc", label: "to skip" },
];
