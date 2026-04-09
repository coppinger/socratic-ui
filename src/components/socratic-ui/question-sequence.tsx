"use client";

/**
 * Public entry for the Question Sequence primitive.
 *
 * The primitive splits into two pieces that are imported together:
 *
 * - `useQuestionSequence` — the state machine (current id, answers, next
 *   / previous / skip, validity). Lives in `./use-question-sequence`.
 * - `SequenceShell` — the surrounding chrome (animated step swap, window
 *   keyboard bindings, keyboard-hint footer, sequence context). Lives in
 *   `./sequence-shell`.
 *
 * The split exists because the earlier single-component shape conflated a
 * state machine, a slot parser, a keyboard controller, and a layout
 * primitive; consumers ended up writing dispatch tables to thread values
 * through render-prop children. With the split, consumers call the hook
 * and render a normal `switch` on `currentId` inside the shell.
 */

export {
  useQuestionSequence,
  type QuestionId,
  type QuestionSequenceController,
  type UseQuestionSequenceOptions,
} from "./use-question-sequence";

export { SequenceShell, type SequenceShellProps } from "./sequence-shell";
