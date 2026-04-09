// Re-export barrel. The actual primitives live under `./shared/*` — see the
// redesign plan at /Users/charliecoppinger/.claude/plans/enumerated-herding-meadow.md.
// This file exists so existing imports (`./shared` and
// `@/components/socratic-ui/shared`) keep working without churn.

export { SectionLabel } from "./shared/section-label";
export { OptionCard } from "./shared/option-card";
export { SuccessSummary } from "./shared/success-summary";
export {
  MotionCard,
  MotionItem,
  MotionStage,
} from "./shared/motion-primitives";
export {
  type OptionIconAlignment,
  type OptionIconLayout,
  type OptionIconSettings,
  optionListClass,
} from "./shared/icon-settings";

// New primitives introduced by the Claude-style redesign.
export { OptionRow, type OptionRowProps } from "./shared/option-row";
export {
  QuestionCard,
  QuestionHeader,
  QuestionFooter,
} from "./shared/question-card";
export {
  KeyboardHintFooter,
  SINGLE_SELECT_HINTS,
  MULTI_SELECT_HINTS,
  PRIORITY_RANK_HINTS,
  FILL_BLANK_HINTS,
  NEGATION_SELECT_HINTS,
  OPEN_QUESTIONS_HINTS,
  type KeyboardHint,
} from "./shared/keyboard-hint";
export {
  SequenceContext,
  useSequenceContext,
  type SequenceContextValue,
} from "./shared/sequence-context";
export {
  useRovingFocus,
  type RovingFocusItemProps,
} from "./shared/use-roving-focus";
export { useSequenceQuestion } from "./shared/use-sequence-question";
