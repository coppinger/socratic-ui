"use client";

import { createContext, useContext } from "react";

import type { KeyboardHint } from "./keyboard-hint";

/**
 * Cross-component sequence state provided by `<SequenceShell>`.
 *
 * `null` outside a sequence — every consumer must degrade gracefully so
 * individual input components stay usable standalone. See
 * `sequence-shell.tsx` for the provider and `question-card.tsx` for the
 * primary consumers (header stepper + footer skip/next buttons).
 */
export interface SequenceContextValue {
  /** 1-based index of the currently rendered question. */
  step: number;
  total: number;
  /** Advance to the next question (or complete the sequence). */
  onNext?: () => void;
  /** Skip the current question. Advances or closes on the terminal step. */
  onSkip?: () => void;
  /** Close the sequence entirely. Renders the `×` button when present. */
  onClose?: () => void;
  /** Go back to the previous question. Restores its prior answer. */
  onPrevious?: () => void;
  /**
   * Whether the current question has a valid answer that can be committed.
   * Drives the primary action button's enabled state and the sequence's
   * `⌘Enter` handler. Inputs report their local `canSubmit` up via
   * `reportCanSubmit` below (through `useSequenceQuestion`).
   */
  canSubmit: boolean;
  /** True iff the current step is the last question in the sequence. */
  isTerminal: boolean;
  /** Reports the current question's validity to the sequence. */
  reportCanSubmit?: (canSubmit: boolean) => void;
  /**
   * Reports the active question's preferred keyboard hints so the shell can
   * render an accurate hint footer without the sequence consumer having to
   * know which hint preset belongs to which input kind.
   */
  reportHints?: (hints: KeyboardHint[]) => void;
}

export const SequenceContext = createContext<SequenceContextValue | null>(null);

export function useSequenceContext(): SequenceContextValue | null {
  return useContext(SequenceContext);
}
