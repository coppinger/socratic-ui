"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SPECTRUM_HINTS,
  useSequenceQuestion,
} from "./shared";

const LIT_SIDE_RATIO = 0.4;

export interface SpectrumProps {
  question: string;
  subtitle?: string;
  leftLabel: string;
  leftDescription?: string;
  rightLabel: string;
  rightDescription?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Resolves the initial slider value for a spectrum from its schema props.
 * Shared by the playground and question-sequence renderers so the
 * midpoint formula lives in one place.
 */
export function spectrumInitialValue({
  min,
  max,
  defaultValue,
}: {
  min?: number;
  max?: number;
  defaultValue?: number;
}): number {
  const lo = min ?? 0;
  const hi = max ?? 100;
  return defaultValue ?? lo + (hi - lo) / 2;
}

export function Spectrum({
  question,
  subtitle,
  leftLabel,
  leftDescription,
  rightLabel,
  rightDescription,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  number,
  motion,
}: SpectrumProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);

  const focusFirst = React.useCallback(() => {
    // `data-slot="slider-thumb"` is set by the project's own Slider
    // wrapper (see components/ui/slider.tsx) — a stable contract owned
    // by this repo, not upstream Base UI.
    const thumb = stageRef.current?.querySelector<HTMLElement>(
      '[data-slot="slider-thumb"]',
    );
    thumb?.focus();
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit: true,
    focusFirst,
    hints: SPECTRUM_HINTS,
  });

  const range = max - min;
  const midpoint = min + range / 2;
  const threshold = range * (LIT_SIDE_RATIO / 2);
  const leftLit = value <= midpoint - threshold;
  const rightLit = value >= midpoint + threshold;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={sequence ? <QuestionFooter /> : null}
    >
      <div ref={stageRef} className="flex flex-col gap-5 px-7 pb-2">
        <MotionStage motion={motion} className="flex items-stretch gap-4">
          <MotionItem motion={motion}>
            <PoleTile
              title={leftLabel}
              description={leftDescription}
              align="left"
              lit={leftLit}
            />
          </MotionItem>
          <MotionItem motion={motion}>
            <PoleTile
              title={rightLabel}
              description={rightDescription}
              align="right"
              lit={rightLit}
            />
          </MotionItem>
        </MotionStage>
        <div className="px-1">
          <Slider
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={(next) => {
              const scalar = Array.isArray(next) ? next[0] : next;
              if (typeof scalar === "number") onChange(scalar);
            }}
            aria-label={question}
            aria-valuetext={describePosition(
              value,
              midpoint,
              threshold,
              leftLabel,
              rightLabel,
            )}
          />
        </div>
      </div>
    </QuestionCard>
  );
}

function PoleTile({
  title,
  description,
  align,
  lit,
}: {
  title: string;
  description?: string;
  align: "left" | "right";
  lit: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl border px-4 py-3 transition-colors",
        lit ? "border-primary/60 bg-primary/5" : "border-border bg-card",
        align === "right" && "text-right",
      )}
    >
      <div
        className={cn(
          "text-[14px] font-semibold leading-snug",
          lit ? "text-primary" : "text-foreground",
        )}
      >
        {title}
      </div>
      {description ? (
        <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
          {description}
        </div>
      ) : null}
    </div>
  );
}

function describePosition(
  value: number,
  midpoint: number,
  threshold: number,
  leftLabel: string,
  rightLabel: string,
): string {
  if (value <= midpoint - threshold) return `leaning ${leftLabel}`;
  if (value >= midpoint + threshold) return `leaning ${rightLabel}`;
  return "in the middle";
}
