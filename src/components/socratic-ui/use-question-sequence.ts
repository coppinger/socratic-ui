"use client";

import * as React from "react";

export type QuestionId = string;

export interface UseQuestionSequenceOptions {
  /** Ordered list of question ids. Drives pagination and keys the transition. */
  ids: QuestionId[];
  /** Uncontrolled initial answers map. Ignored if `answers` is provided. */
  defaultAnswers?: Record<QuestionId, unknown>;
  /** Controlled answers map. When provided the hook becomes a pure dispatcher. */
  answers?: Record<QuestionId, unknown>;
  /** Fires whenever a question's answer changes, regardless of controlled mode. */
  onAnswerChange?: (id: QuestionId, value: unknown) => void;
  /** Fires when the user submits from the terminal question. */
  onComplete?: (answers: Record<QuestionId, unknown>) => void;
  /** Fires when the user closes the sequence (× button or Esc on terminal). */
  onClose?: () => void;
}

export interface QuestionSequenceController {
  ids: QuestionId[];
  currentId: QuestionId;
  currentIndex: number;
  total: number;
  isTerminal: boolean;
  /** +1 when advancing, -1 when going back. Drives `SequenceShell` transitions. */
  direction: 1 | -1;
  answers: Record<QuestionId, unknown>;
  /** True once the active question reports a valid answer via `useSequenceQuestion`. */
  canSubmit: boolean;
  setAnswer: (id: QuestionId, value: unknown) => void;
  /** Advance to the next question, or call `onComplete` on the terminal step. */
  next: () => void;
  /** Step back to the previous question. No-op at index 0. */
  previous: () => void;
  /** Skip the current question, or call `onClose` on the terminal step. */
  skip: () => void;
  /**
   * Convenience helper for rendering. Returns `{ value, onChange }` wired to
   * the sequence's answers map, with `undefined` answers falling back to the
   * supplied default so inputs can stay typed.
   */
  bind: <T>(
    id: QuestionId,
    fallback: T,
  ) => { value: T; onChange: (value: T) => void };
  /** Shell-internal: propagated to `onClose` context consumer. */
  onClose?: () => void;
  /** Shell-internal: called by inputs via `useSequenceQuestion` to report validity. */
  reportCanSubmit: (canSubmit: boolean) => void;
}

/**
 * State machine for a question sequence. Pair with `<SequenceShell>` for the
 * surrounding chrome (animated step swap, keyboard bindings, hint footer), or
 * drive custom UI by reading the controller directly.
 *
 * The hook is the single source of truth for which question is active, the
 * per-id answers map, and whether the active question is ready to submit.
 * Rendering which input shows up for each id is the caller's responsibility
 * — typically a `switch` on `controller.currentId` inside the shell's render
 * prop.
 */
export function useQuestionSequence({
  ids,
  defaultAnswers,
  answers: answersProp,
  onAnswerChange,
  onComplete,
  onClose,
}: UseQuestionSequenceOptions): QuestionSequenceController {
  const total = ids.length;
  const isControlled = answersProp !== undefined;

  const [internalAnswers, setInternalAnswers] = React.useState<
    Record<QuestionId, unknown>
  >(() => defaultAnswers ?? {});
  const answers = isControlled ? answersProp : internalAnswers;

  // Live ref for `answers` so `next` can read the latest snapshot without
  // taking `answers` as a dep — otherwise every keystroke rebuilds `next`
  // and cascades into the shell's context-value memo + window keyboard
  // effect. Updated post-commit, which is fine because `next` is only
  // ever called from event handlers (after all commits have flushed).
  const answersRef = React.useRef(answers);
  React.useEffect(() => {
    answersRef.current = answers;
  });

  const setAnswer = React.useCallback(
    (id: QuestionId, value: unknown) => {
      if (!isControlled) {
        setInternalAnswers((prev) => ({ ...prev, [id]: value }));
      }
      onAnswerChange?.(id, value);
    },
    [isControlled, onAnswerChange],
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [canSubmit, setCanSubmit] = React.useState(false);

  // Reset canSubmit whenever the active step changes — the newly mounted
  // input reports its local validity via `useSequenceQuestion` on mount.
  React.useEffect(() => {
    setCanSubmit(false);
  }, [currentIndex]);

  // Clamp the stored index so a shrinking `ids` array never points past
  // the end of the sequence. Non-empty `ids` is a caller precondition.
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0;
  const isTerminal = safeIndex >= total - 1;
  const currentId = ids[safeIndex] ?? ("" as QuestionId);

  const next = React.useCallback(() => {
    if (isTerminal) {
      onComplete?.(answersRef.current);
      return;
    }
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  }, [isTerminal, onComplete, total]);

  const previous = React.useCallback(() => {
    setDirection(-1);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const skip = React.useCallback(() => {
    if (isTerminal) {
      onClose?.();
      return;
    }
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  }, [isTerminal, onClose, total]);

  // Plain function — a `useCallback` here would need `answers` in its
  // dep list and would invalidate on every keystroke anyway, so the
  // memo wouldn't buy anything.
  const bind = <T,>(id: QuestionId, fallback: T) => ({
    value: (answers[id] ?? fallback) as T,
    onChange: (value: T) => setAnswer(id, value),
  });

  return {
    ids,
    currentId,
    currentIndex,
    total,
    isTerminal,
    direction,
    answers,
    canSubmit,
    setAnswer,
    next,
    previous,
    skip,
    bind,
    onClose,
    reportCanSubmit: setCanSubmit,
  };
}
