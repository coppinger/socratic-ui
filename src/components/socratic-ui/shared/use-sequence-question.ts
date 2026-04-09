"use client";

import * as React from "react";

import {
  type SequenceContextValue,
  useSequenceContext,
} from "./sequence-context";

/**
 * Binds a single-question component to an enclosing `QuestionSequence`.
 *
 * Every question component needs the same two side-effects when it
 * lives inside a sequence: report its local validity up so the
 * sequence's Next button + ⌘Enter handler can gate on it, and pull
 * keyboard focus into its first focusable element whenever the active
 * step changes. Returning the sequence value (or null outside a
 * sequence) lets callers gate on sequence-specific chrome like
 * `<QuestionFooter>`.
 */
export function useSequenceQuestion({
  canSubmit,
  focusFirst,
}: {
  canSubmit: boolean;
  focusFirst?: () => void;
}): SequenceContextValue | null {
  const sequence = useSequenceContext();
  const reportCanSubmit = sequence?.reportCanSubmit;
  const step = sequence?.step;

  React.useEffect(() => {
    reportCanSubmit?.(canSubmit);
  }, [reportCanSubmit, canSubmit]);

  React.useEffect(() => {
    if (step === undefined) return;
    focusFirst?.();
  }, [step, focusFirst]);

  return sequence;
}
