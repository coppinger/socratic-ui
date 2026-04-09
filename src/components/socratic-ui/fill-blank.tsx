"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  FILL_BLANK_HINTS,
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SuccessSummary,
  useSequenceQuestion,
} from "./shared";

export type FillBlankSlot = {
  /** Stable identifier used as a key in `value`. */
  id: string;
  placeholder: string;
};

export interface FillBlankProps {
  question: string;
  subtitle?: string;
  /**
   * Sentence template. Use `{slot-id}` to mark each blank, e.g.
   * "I want to build a {what} for {who} that helps them {outcome}."
   *
   * Literal `{` / `}` are not currently escapable — add an escape syntax if a
   * caller ever needs to render literal braces inside the template.
   */
  template: string;
  slots: FillBlankSlot[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  number?: string;
  /** Optional summary text shown when every slot is filled. */
  completeMessage?: string;
  motion?: SocraticMotion;
}

type Segment =
  | { kind: "text"; content: string }
  | { kind: "slot"; id: string };

const SLOT_PATTERN = /\{([^{}]+)\}/g;

function parseTemplate(template: string, slotIds: Set<string>): Segment[] {
  const segments: Segment[] = [];
  SLOT_PATTERN.lastIndex = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = SLOT_PATTERN.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        content: template.slice(lastIndex, match.index),
      });
    }
    if (slotIds.has(match[1])) {
      segments.push({ kind: "slot", id: match[1] });
    } else {
      segments.push({ kind: "text", content: match[0] });
    }
    lastIndex = SLOT_PATTERN.lastIndex;
  }

  if (lastIndex < template.length) {
    segments.push({ kind: "text", content: template.slice(lastIndex) });
  }
  return segments;
}

export function FillBlank({
  question,
  subtitle,
  template,
  slots,
  value,
  onChange,
  number,
  completeMessage = "Clear and scoped — that's a strong starting point.",
  motion,
}: FillBlankProps) {
  const slotById = React.useMemo(
    () => new Map(slots.map((slot) => [slot.id, slot])),
    [slots],
  );
  const segments = React.useMemo(
    () => parseTemplate(template, new Set(slotById.keys())),
    [template, slotById],
  );

  const setSlot = (id: string, next: string) =>
    onChange({ ...value, [id]: next });

  const allFilled = slots.every((slot) => (value[slot.id] ?? "").trim() !== "");

  const sequence = useSequenceQuestion({
    canSubmit: allFilled,
    hints: FILL_BLANK_HINTS,
  });

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={sequence ? <QuestionFooter /> : null}
    >
      <div className="px-7 pb-2">
        <MotionStage motion={motion}>
          <MotionItem motion={motion}>
            <div className="text-base leading-[2.4] text-foreground">
              {segments.map((segment, index) => {
                if (segment.kind === "text") {
                  return <span key={index}>{segment.content}</span>;
                }
                const slot = slotById.get(segment.id);
                if (!slot) return null;
                const slotValue = value[slot.id] ?? "";
                return (
                  <input
                    key={`${slot.id}-${index}`}
                    type="text"
                    placeholder={slot.placeholder}
                    aria-label={slot.placeholder}
                    value={slotValue}
                    onChange={(event) => setSlot(slot.id, event.target.value)}
                    className={cn(
                      "mx-1 inline-block min-w-[100px] border-0 border-b-2 bg-transparent px-1 py-0.5 text-base font-semibold text-primary outline-hidden transition-colors",
                      slotValue ? "border-primary" : "border-border",
                      "placeholder:font-normal placeholder:text-muted-foreground/70",
                    )}
                    style={{
                      width: `${Math.max(100, slotValue.length * 10 + 24)}px`,
                    }}
                  />
                );
              })}
            </div>
          </MotionItem>
        </MotionStage>
        {allFilled ? <SuccessSummary>{completeMessage}</SuccessSummary> : null}
      </div>
    </QuestionCard>
  );
}
