"use client";

import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import type { SocraticMotion } from "./motion";
import {
  MotionCard,
  MotionItem,
  MotionStage,
  OptionCard,
  SectionLabel,
} from "./shared";

export type SingleSelectOption = {
  title: string;
  subtitle?: string;
};

export interface SingleSelectProps {
  question: string;
  subtitle?: string;
  options: SingleSelectOption[];
  /** Title of the currently selected option, or null when nothing is picked. */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Optional question number shown in the header (e.g. "01"). */
  number?: string;
  freeformPlaceholder?: string;
  freeformValue?: string;
  onFreeformChange?: (value: string) => void;
  motion?: SocraticMotion;
}

export function SingleSelect({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  freeformPlaceholder,
  freeformValue,
  onFreeformChange,
  motion,
}: SingleSelectProps) {
  const showFreeform =
    freeformPlaceholder !== undefined && onFreeformChange !== undefined;

  return (
    <MotionCard motion={motion} className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        <MotionStage motion={motion} className="flex flex-col gap-2">
          {/*
            Tapping an already-selected option deselects it (clears to null).
            This diverges from the reference JSX, which is commit-only — kept
            here as an explicit affordance so a user can change their mind
            without picking something else first.
          */}
          {options.map((option) => (
            <MotionItem motion={motion} key={option.title}>
              <OptionCard
                title={option.title}
                subtitle={option.subtitle}
                selected={value === option.title}
                onSelect={() =>
                  onChange(value === option.title ? null : option.title)
                }
              />
            </MotionItem>
          ))}
        </MotionStage>
        {showFreeform ? (
          <Textarea
            placeholder={freeformPlaceholder}
            value={freeformValue ?? ""}
            onChange={(event) => onFreeformChange(event.target.value)}
            rows={2}
            className="mt-3 resize-y bg-muted"
          />
        ) : null}
      </CardContent>
    </MotionCard>
  );
}
