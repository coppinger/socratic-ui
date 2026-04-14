"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

import type { SocraticMotion } from "./motion";
import {
  MotionItem,
  MotionStage,
  OPEN_QUESTIONS_HINTS,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SuccessSummary,
  useSequenceQuestion,
} from "./shared";

export type OpenQuestionPrompt = {
  /** Stable identifier used as a key in `value`. */
  id: string;
  /** The question text shown above its textarea. */
  text: string;
  placeholder?: string;
};

export interface OpenQuestionsProps {
  /** Overall framing for the set of prompts. */
  question: string;
  subtitle?: string;
  prompts: OpenQuestionPrompt[];
  /** Map of prompt id → user-entered text. */
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  number?: string;
  /** Summary text shown when every prompt has a non-empty answer. */
  completeMessage?: string;
  motion?: SocraticMotion;
}

/**
 * Stacked open-ended questions. Renders one auto-growing textarea per
 * prompt. All answers are required before the sequence Submit button
 * activates — partial submissions are intentionally not supported, so
 * this is the right component when the AI needs every blank filled.
 */
export function OpenQuestions({
  question,
  subtitle,
  prompts,
  value,
  onChange,
  number,
  completeMessage = "Thanks — that gives me what I need to dig in.",
  motion,
}: OpenQuestionsProps) {
  const setAnswer = (id: string, next: string) =>
    onChange({ ...value, [id]: next });

  const filledCount = prompts.reduce(
    (count, p) => count + ((value[p.id] ?? "").trim() !== "" ? 1 : 0),
    0,
  );
  const allFilled = filledCount === prompts.length;

  const firstTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const focusFirst = React.useCallback(() => {
    firstTextareaRef.current?.focus();
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit: allFilled,
    focusFirst,
    hints: OPEN_QUESTIONS_HINTS,
  });

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={sequence ? <QuestionFooter /> : null}
    >
      <div>
        <div aria-live="polite" className="sr-only">
          {filledCount} of {prompts.length} answered
        </div>
        <MotionStage motion={motion} className="p-1.5">
          {prompts.map((prompt, index) => {
            const promptValue = value[prompt.id] ?? "";
            const filled = promptValue.trim() !== "";
            return (
              <MotionItem motion={motion} key={prompt.id}>
                <div className="flex gap-4 px-7 py-5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-semibold tabular-nums transition-colors",
                      filled
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                    <span className="sr-only">
                      {filled ? "answered" : "unanswered"}
                    </span>
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <label
                      htmlFor={`open-question-${prompt.id}`}
                      className="text-[15px] font-semibold leading-snug text-foreground"
                    >
                      {prompt.text}
                    </label>
                    <Textarea
                      id={`open-question-${prompt.id}`}
                      ref={index === 0 ? firstTextareaRef : undefined}
                      value={promptValue}
                      onChange={(event) =>
                        setAnswer(prompt.id, event.target.value)
                      }
                      placeholder={prompt.placeholder ?? "Type your answer…"}
                      rows={2}
                      className={cn(
                        "resize-none bg-muted/40 text-[14px] leading-relaxed",
                        filled && "border-primary/40",
                      )}
                    />
                  </div>
                </div>
              </MotionItem>
            );
          })}
        </MotionStage>
      </div>
      {allFilled ? (
        <div className="px-7 pb-2">
          <SuccessSummary>{completeMessage}</SuccessSummary>
        </div>
      ) : null}
    </QuestionCard>
  );
}
