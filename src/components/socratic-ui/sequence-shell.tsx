"use client";

import * as React from "react";
import { AnimatePresence, motion as m } from "motion/react";

import {
  type KeyboardHint,
  SequenceContext,
  type SequenceContextValue,
  SINGLE_SELECT_HINTS,
} from "./shared";
import type {
  QuestionId,
  QuestionSequenceController,
} from "./use-question-sequence";

export interface SequenceShellProps {
  /** Controller produced by `useQuestionSequence`. */
  controller: QuestionSequenceController;
  /**
   * Render the input for the active question. The shell handles the
   * animated crossfade between steps; this callback just needs to return
   * the element that belongs to `currentId` — typically a `switch`.
   */
  render: (currentId: QuestionId) => React.ReactNode;
}

/**
 * Chrome for a `useQuestionSequence` controller. Owns the animated step
 * swap, window-level keyboard bindings (`⌘Enter` / `Esc` / `←` / `→`),
 * the sequence context provider, and the keyboard-hint footer.
 *
 * The shell deliberately does not know which inputs it's rendering — the
 * consumer picks that via the `render` prop, and each input opts into
 * sequence behavior by calling `useSequenceQuestion`.
 */
export function SequenceShell({ controller, render }: SequenceShellProps) {
  const {
    currentId,
    currentIndex,
    total,
    direction,
    canSubmit,
    isTerminal,
    next,
    previous,
    skip,
    onClose,
    reportCanSubmit,
  } = controller;

  // Inputs report their preferred hints on mount via `useSequenceQuestion`.
  // We default to `SINGLE_SELECT_HINTS` so the initial paint has a sensible
  // hint strip before the first effect lands.
  const [activeHints, setActiveHints] =
    React.useState<KeyboardHint[]>(SINGLE_SELECT_HINTS);

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        if (canSubmit) {
          event.preventDefault();
          next();
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
        return;
      }
      if (event.key === "ArrowRight" && !isEditable) {
        if (!isTerminal && canSubmit) {
          event.preventDefault();
          next();
        }
        return;
      }
      if (event.key === "ArrowLeft" && !isEditable) {
        if (currentIndex > 0) {
          event.preventDefault();
          previous();
        }
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canSubmit, currentIndex, next, previous, isTerminal, skip]);

  const contextValue = React.useMemo<SequenceContextValue>(
    () => ({
      step: currentIndex + 1,
      total,
      onNext: next,
      onSkip: skip,
      onPrevious: currentIndex > 0 ? previous : undefined,
      onClose,
      canSubmit,
      isTerminal,
      reportCanSubmit,
      reportHints: setActiveHints,
    }),
    [
      currentIndex,
      total,
      next,
      skip,
      previous,
      onClose,
      canSubmit,
      isTerminal,
      reportCanSubmit,
    ],
  );

  return (
    <SequenceContext.Provider value={contextValue}>
      <div className="flex w-full flex-col">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <m.div
            key={currentId}
            custom={direction}
            initial={{ opacity: 0, x: direction * 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -16 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {render(currentId)}
          </m.div>
        </AnimatePresence>
      </div>
    </SequenceContext.Provider>
  );
}
