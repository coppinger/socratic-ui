"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  MotionItem,
  MotionStage,
  OptionRow,
  QUICK_ESTIMATE_HINTS,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SuccessSummary,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";

export type QuickEstimateDimension = {
  /** Stable identifier used as the key in `value`. */
  id: string;
  label: string;
  options: Array<{ title: string; subtitle?: string }>;
};

export interface QuickEstimateProps {
  question: string;
  subtitle?: string;
  dimensions: QuickEstimateDimension[];
  /** Map of dimension id → selected option title (or null). */
  value: Record<string, string | null>;
  onChange: (value: Record<string, string | null>) => void;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Two or three related single-select dimensions stacked vertically.
 * Purpose-built for constraints that only make sense in pairs — budget
 * + timeline, scope + quality, that sort of thing. Each dimension is an
 * independent roving list so keyboard users can Tab between dimensions
 * and arrow-key within them.
 */
export function QuickEstimate({
  question,
  subtitle,
  dimensions,
  value,
  onChange,
  number,
  motion,
}: QuickEstimateProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);

  const selectOption = (dimensionId: string, optionTitle: string) => {
    const current = value[dimensionId] ?? null;
    onChange({
      ...value,
      [dimensionId]: current === optionTitle ? null : optionTitle,
    });
  };

  const allAnswered = dimensions.every(
    (dimension) => (value[dimension.id] ?? null) !== null,
  );

  const focusFirst = React.useCallback(() => {
    // Each `DimensionSection` tags itself with `data-dimension-index` so
    // we can target the first dimension's first option without threading
    // a ref through every section.
    const first = stageRef.current?.querySelector<HTMLElement>(
      '[data-dimension-index="0"] [data-roving-index="0"]',
    );
    first?.focus();
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit: allAnswered,
    focusFirst,
    hints: QUICK_ESTIMATE_HINTS,
  });

  const summary = dimensions
    .map((dimension) => value[dimension.id])
    .filter((picked): picked is string => Boolean(picked))
    .join(" · ");

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={sequence ? <QuestionFooter /> : null}
    >
      <div ref={stageRef} className="flex flex-col gap-5 px-7 pb-2">
        {dimensions.map((dimension, dimensionIndex) => (
          <DimensionSection
            key={dimension.id}
            index={dimensionIndex}
            dimension={dimension}
            selected={value[dimension.id] ?? null}
            onSelect={(optionTitle) => selectOption(dimension.id, optionTitle)}
            motion={motion}
          />
        ))}
        {allAnswered ? <SuccessSummary>{summary} — got it.</SuccessSummary> : null}
      </div>
    </QuestionCard>
  );
}

function DimensionSection({
  dimension,
  selected,
  onSelect,
  motion,
  index,
}: {
  dimension: QuickEstimateDimension;
  selected: string | null;
  onSelect: (optionTitle: string) => void;
  motion?: SocraticMotion;
  index: number;
}) {
  const { activeIndex, getItemProps } = useRovingFocus({
    count: dimension.options.length,
    onActivate: (i) => {
      const option = dimension.options[i];
      if (!option) return;
      onSelect(option.title);
    },
  });

  return (
    <div className="flex flex-col gap-2" data-dimension-index={index}>
      <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
        {dimension.label}
      </p>
      <MotionStage
        motion={motion}
        className="overflow-hidden rounded-xl border border-border divide-y divide-border/60"
      >
        {dimension.options.map((option, optionIndex) => {
          const isSelected = selected === option.title;
          return (
            <MotionItem motion={motion} key={option.title}>
              <OptionRow
                title={option.title}
                subtitle={option.subtitle}
                selected={isSelected}
                focused={activeIndex === optionIndex}
                onSelect={() => onSelect(option.title)}
                leading={{ kind: "none" }}
                rowProps={getItemProps(optionIndex)}
                className={cn("px-4 py-3")}
              />
            </MotionItem>
          );
        })}
      </MotionStage>
    </div>
  );
}
