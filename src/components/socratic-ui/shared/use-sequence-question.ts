"use client";

import * as React from "react";

import type { KeyboardHint } from "./keyboard-hint";
import {
  type SequenceContextValue,
  useSequenceContext,
} from "./sequence-context";

/**
 * Binds a single-question component to an enclosing `<SequenceShell>`.
 *
 * Every input needs the same side-effects when living inside a sequence:
 * report its local validity up so the sequence's Next button and `⌘Enter`
 * handler can gate on it, announce its preferred keyboard hints so the
 * shell can render the hint footer accurately, and pull focus into its
 * first focusable element whenever the active step changes. Returning the
 * sequence value (or `null` outside a sequence) lets callers gate on
 * sequence-specific chrome like `<QuestionFooter>`.
 */
export function useSequenceQuestion({
  canSubmit,
  focusFirst,
  hints,
}: {
  canSubmit: boolean;
  focusFirst?: () => void;
  /**
   * Preferred keyboard-hint preset for this input. Reported up to the
   * shell so the hint footer matches the currently active question. The
   * value should be a stable module-level constant (e.g. one of the
   * `*_HINTS` presets) to avoid unnecessary re-reports.
   */
  hints?: KeyboardHint[];
}): SequenceContextValue | null {
  const sequence = useSequenceContext();
  const reportCanSubmit = sequence?.reportCanSubmit;
  const reportHints = sequence?.reportHints;
  const step = sequence?.step;

  React.useEffect(() => {
    reportCanSubmit?.(canSubmit);
  }, [reportCanSubmit, canSubmit]);

  // Layout effect so the shell's hint strip updates synchronously before
  // the next paint — otherwise the initial mount flashes the shell's
  // default preset for a frame before the right hints land.
  React.useLayoutEffect(() => {
    if (!hints) return;
    reportHints?.(hints);
  }, [reportHints, hints]);

  React.useEffect(() => {
    if (step === undefined) return;
    focusFirst?.();
  }, [step, focusFirst]);

  return sequence;
}
