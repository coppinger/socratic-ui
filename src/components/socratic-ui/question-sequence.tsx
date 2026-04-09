"use client";

import * as React from "react";
import { AnimatePresence, motion as m } from "motion/react";

import {
  type KeyboardHint,
  KeyboardHintFooter,
  SequenceContext,
  type SequenceContextValue,
  SINGLE_SELECT_HINTS,
} from "./shared";

type QuestionId = string;

/**
 * Children receive the current answer for their question and an
 * `onChange` that writes back into the sequence's answers map. Keeps
 * the five Socratic components unaware of sequences — they stay
 * controlled components with their existing public APIs.
 */
export interface QuestionRenderProps<T = unknown> {
  value: T | undefined;
  onChange: (value: T) => void;
}

export interface QuestionSequenceItemProps {
  id: QuestionId;
  /** Keyboard-hint preset shown under the card while this item is active. */
  hints?: KeyboardHint[];
  children: (props: QuestionRenderProps) => React.ReactNode;
}

function Item(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: QuestionSequenceItemProps,
): React.ReactElement | null {
  throw new Error(
    "<QuestionSequence.Item> must be rendered inside <QuestionSequence>.",
  );
}

export interface QuestionSequenceProps {
  children: React.ReactNode;
  defaultAnswers?: Record<QuestionId, unknown>;
  answers?: Record<QuestionId, unknown>;
  onChange?: (id: QuestionId, value: unknown) => void;
  onComplete?: (answers: Record<QuestionId, unknown>) => void;
  onClose?: () => void;
}

interface ParsedItem {
  id: QuestionId;
  hints: KeyboardHint[];
  render: (props: QuestionRenderProps) => React.ReactNode;
}

function parseItems(children: React.ReactNode): ParsedItem[] {
  const items: ParsedItem[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type !== Item) return;
    const props = child.props as QuestionSequenceItemProps;
    items.push({
      id: props.id,
      hints: props.hints ?? SINGLE_SELECT_HINTS,
      render: props.children,
    });
  });
  return items;
}

export function QuestionSequence({
  children,
  defaultAnswers,
  answers: answersProp,
  onChange,
  onComplete,
  onClose,
}: QuestionSequenceProps) {
  const items = React.useMemo(() => parseItems(children), [children]);
  const total = items.length;

  const isControlled = answersProp !== undefined;
  const [internalAnswers, setInternalAnswers] = React.useState<
    Record<QuestionId, unknown>
  >(() => defaultAnswers ?? {});
  const answers = isControlled ? answersProp : internalAnswers;

  const writeAnswer = React.useCallback(
    (id: QuestionId, value: unknown) => {
      if (!isControlled) {
        setInternalAnswers((prev) => ({ ...prev, [id]: value }));
      }
      onChange?.(id, value);
    },
    [isControlled, onChange],
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [canSubmit, setCanSubmit] = React.useState(false);

  const currentItem = items[currentIndex];
  const isTerminal = currentIndex >= total - 1;

  const goNext = React.useCallback(() => {
    if (isTerminal) {
      onComplete?.(answers);
      return;
    }
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  }, [isTerminal, onComplete, answers, total]);

  const goPrevious = React.useCallback(() => {
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

  // Reset canSubmit when the active step changes; the newly mounted
  // child will re-report via `useSequenceQuestion`.
  React.useEffect(() => {
    setCanSubmit(false);
  }, [currentIndex]);

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
          goNext();
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
          goNext();
        }
        return;
      }
      if (event.key === "ArrowLeft" && !isEditable) {
        if (currentIndex > 0) {
          event.preventDefault();
          goPrevious();
        }
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canSubmit, currentIndex, goNext, goPrevious, isTerminal, skip]);

  const contextValue = React.useMemo<SequenceContextValue>(
    () => ({
      step: currentIndex + 1,
      total,
      onNext: goNext,
      onSkip: skip,
      onPrevious: currentIndex > 0 ? goPrevious : undefined,
      onClose,
      canSubmit,
      isTerminal,
      reportCanSubmit: setCanSubmit,
    }),
    [
      currentIndex,
      total,
      goNext,
      skip,
      goPrevious,
      onClose,
      canSubmit,
      isTerminal,
    ],
  );

  if (!currentItem) {
    return null;
  }

  const renderProps: QuestionRenderProps = {
    value: answers[currentItem.id],
    onChange: (value) => writeAnswer(currentItem.id, value),
  };

  return (
    <SequenceContext.Provider value={contextValue}>
      <div className="flex w-full flex-col">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <m.div
            key={currentItem.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -16 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {currentItem.render(renderProps)}
          </m.div>
        </AnimatePresence>
        <KeyboardHintFooter hints={currentItem.hints} />
      </div>
    </SequenceContext.Provider>
  );
}

QuestionSequence.Item = Item;
