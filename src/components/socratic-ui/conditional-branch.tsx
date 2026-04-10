"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

import type { SocraticMotion } from "./motion";
import {
  CONDITIONAL_BRANCH_HINTS,
  MotionItem,
  MotionStage,
  OptionRow,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";

export type ConditionalBranchFollowUp =
  | {
      kind: "single-select";
      question: string;
      options: Array<{ title: string; subtitle?: string }>;
    }
  | {
      kind: "text";
      question: string;
      placeholder?: string;
    };

export type ConditionalBranchOption = {
  /** Stable identifier used as the key in `value`. */
  id: string;
  title: string;
  subtitle?: string;
  followUp?: ConditionalBranchFollowUp;
};

export interface ConditionalBranchValue {
  /** Id of the primary option the user picked. */
  selectedId: string | null;
  /**
   * The follow-up answer for the currently selected option — either
   * a sub-option title (for single-select follow-ups) or freeform text.
   */
  followUpValue: string | null;
}

export interface ConditionalBranchProps {
  question: string;
  subtitle?: string;
  options: ConditionalBranchOption[];
  value: ConditionalBranchValue;
  onChange: (value: ConditionalBranchValue) => void;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Binary (or up to four-way) choice that reveals a follow-up UI beneath
 * the picked branch. Switching branches clears the follow-up value so
 * stale answers from a different path never leak through.
 */
export function ConditionalBranch({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  motion,
}: ConditionalBranchProps) {
  const selectedOption = options.find(
    (option) => option.id === value.selectedId,
  );

  const pickOption = (optionId: string) => {
    // Changing branches always resets the follow-up — the new branch
    // may have a different shape or expect a different value type.
    onChange({ selectedId: optionId, followUpValue: null });
  };

  const setFollowUpValue = (next: string | null) => {
    onChange({ ...value, followUpValue: next });
  };

  const { activeIndex, getItemProps, focusItem } = useRovingFocus({
    count: options.length,
    onActivate: (index) => {
      const option = options[index];
      if (!option) return;
      pickOption(option.id);
    },
  });

  const followUpSelectedTitle =
    selectedOption?.followUp?.kind === "single-select" &&
    value.followUpValue !== null
      ? value.followUpValue
      : null;

  const canSubmit = React.useMemo(() => {
    if (!selectedOption) return false;
    if (!selectedOption.followUp) return true;
    const followUpValue = value.followUpValue ?? "";
    return followUpValue.trim() !== "";
  }, [selectedOption, value.followUpValue]);

  const focusFirst = React.useCallback(() => focusItem(0), [focusItem]);
  const sequence = useSequenceQuestion({
    canSubmit,
    focusFirst,
    hints: CONDITIONAL_BRANCH_HINTS,
  });

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={sequence ? <QuestionFooter /> : null}
    >
      <MotionStage motion={motion} className="divide-y divide-border/60">
        {options.map((option, index) => {
          const isSelected = option.id === value.selectedId;
          return (
            <MotionItem motion={motion} key={option.id}>
              <OptionRow
                title={option.title}
                subtitle={option.subtitle}
                selected={isSelected}
                focused={activeIndex === index}
                onSelect={() => pickOption(option.id)}
                leading={{ kind: "number", value: index + 1 }}
                trailing={
                  isSelected ? <ArrowRight className="size-4" /> : null
                }
                rowProps={getItemProps(index)}
              />
            </MotionItem>
          );
        })}
      </MotionStage>
      {selectedOption?.followUp ? (
        <div className="px-7 pb-2 pt-4">
          <FollowUpPanel
            key={selectedOption.id}
            followUp={selectedOption.followUp}
            value={value.followUpValue}
            onChange={setFollowUpValue}
            selectedTitle={followUpSelectedTitle}
          />
        </div>
      ) : null}
    </QuestionCard>
  );
}

function FollowUpPanel({
  followUp,
  value,
  onChange,
  selectedTitle,
}: {
  followUp: ConditionalBranchFollowUp;
  value: string | null;
  onChange: (next: string | null) => void;
  selectedTitle: string | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-4">
      <p className="mb-3 text-[13px] font-semibold text-foreground">
        {followUp.question}
      </p>
      {followUp.kind === "text" ? (
        <Textarea
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder={followUp.placeholder ?? "Type your answer…"}
          rows={3}
          className="resize-none bg-card text-[14px] leading-relaxed"
        />
      ) : (
        <FollowUpOptions
          options={followUp.options}
          selectedTitle={selectedTitle}
          onSelect={(title) =>
            onChange(selectedTitle === title ? null : title)
          }
        />
      )}
    </div>
  );
}

function FollowUpOptions({
  options,
  selectedTitle,
  onSelect,
}: {
  options: Array<{ title: string; subtitle?: string }>;
  selectedTitle: string | null;
  onSelect: (title: string) => void;
}) {
  const { activeIndex, getItemProps } = useRovingFocus({
    count: options.length,
    onActivate: (index) => {
      const option = options[index];
      if (!option) return;
      onSelect(option.title);
    },
  });

  return (
    <div className="flex flex-col gap-1.5">
      {options.map((option, index) => {
        const isSelected = option.title === selectedTitle;
        const focused = activeIndex === index;
        return (
          <button
            key={option.title}
            type="button"
            onClick={() => onSelect(option.title)}
            aria-pressed={isSelected}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors",
              "outline-hidden focus-visible:bg-card",
              focused && !isSelected && "bg-card",
              isSelected
                ? "border-primary bg-[var(--accent-soft)]"
                : "border-border bg-card/60 hover:bg-card",
            )}
            {...getItemProps(index)}
          >
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "text-[13px] font-semibold leading-tight",
                  isSelected ? "text-primary" : "text-foreground",
                )}
              >
                {option.title}
              </div>
              {option.subtitle ? (
                <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                  {option.subtitle}
                </div>
              ) : null}
            </div>
            {isSelected ? (
              <span aria-hidden className="shrink-0 text-primary">
                ✓
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
