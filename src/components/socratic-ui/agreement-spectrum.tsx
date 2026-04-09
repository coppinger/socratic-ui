"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  AGREEMENT_SPECTRUM_HINTS,
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";

const DEFAULT_SCALE_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

export interface AgreementStatement {
  /** Stable identifier used as the key in the value/ratings object. */
  id: string;
  text: string;
  /** Optional "% of others who agree" figure to render alongside the answer. */
  crowd?: number;
}

export interface AgreementSpectrumProps {
  question: string;
  subtitle?: string;
  statements: AgreementStatement[];
  /** Labels for the 5-point scale. Defaults to Strongly disagree → Strongly agree. */
  scaleLabels?: string[];
  /** Map of statement id → 0-4 scale index. */
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  number?: string;
  motion?: SocraticMotion;
}

export function AgreementSpectrum({
  question,
  subtitle,
  statements,
  scaleLabels,
  value,
  onChange,
  number,
  motion,
}: AgreementSpectrumProps) {
  const labels =
    scaleLabels && scaleLabels.length === 5 ? scaleLabels : DEFAULT_SCALE_LABELS;
  const shortLabels = labels.map((l) => l.split(" ").pop() ?? l);

  const stageRef = React.useRef<HTMLDivElement>(null);

  const focusFirst = React.useCallback(() => {
    const firstButton = stageRef.current?.querySelector<HTMLElement>(
      '[data-agreement-row="0"] [data-roving-index="0"]',
    );
    firstButton?.focus();
  }, []);

  let rated = 0;
  for (const s of statements) {
    if (value[s.id] !== undefined) rated++;
  }
  const allRated = rated === statements.length;

  const sequence = useSequenceQuestion({
    canSubmit: allRated,
    focusFirst,
    hints: AGREEMENT_SPECTRUM_HINTS,
  });

  const statusText = allRated
    ? `All ${statements.length} rated`
    : `${rated} of ${statements.length} rated`;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        sequence || rated > 0 ? (
          <QuestionFooter statusText={statusText} />
        ) : null
      }
    >
      <div ref={stageRef} className="px-7">
        <MotionStage motion={motion} className="flex flex-col gap-3.5 pb-2">
          {statements.map((statement, rowIndex) => (
            <MotionItem motion={motion} key={statement.id}>
              <StatementRow
                rowIndex={rowIndex}
                statement={statement}
                rating={value[statement.id]}
                labels={labels}
                shortLabels={shortLabels}
                onRate={(index) =>
                  onChange({ ...value, [statement.id]: index })
                }
              />
            </MotionItem>
          ))}
        </MotionStage>
      </div>
    </QuestionCard>
  );
}

function StatementRow({
  rowIndex,
  statement,
  rating,
  labels,
  shortLabels,
  onRate,
}: {
  rowIndex: number;
  statement: AgreementStatement;
  rating: number | undefined;
  labels: string[];
  shortLabels: string[];
  onRate: (index: number) => void;
}) {
  const rated = rating !== undefined;

  // `initialIndex: rating ?? 2` handles mount; subsequent click → focus →
  // `useRovingFocus`'s onFocus keeps its internal cursor in sync, so no
  // separate effect is needed.
  const { getItemProps } = useRovingFocus({
    count: labels.length,
    orientation: "horizontal",
    initialIndex: rating ?? 2,
    onActivate: onRate,
  });

  return (
    <div
      data-agreement-row={rowIndex}
      className={cn(
        "rounded-xl border px-4 py-3.5 transition-colors",
        rated ? "border-primary/50 bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="mb-2.5 text-[14px] font-semibold leading-snug text-foreground">
        {statement.text}
      </div>
      <div
        role="radiogroup"
        aria-label={statement.text}
        className="grid grid-cols-5 gap-1"
      >
        {labels.map((label, index) => {
          const selected = rating === index;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              onClick={() => onRate(index)}
              className={cn(
                "rounded-lg px-1 py-2 text-[11px] font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
              {...getItemProps(index)}
            >
              {shortLabels[index]}
            </button>
          );
        })}
      </div>
      {rated && statement.crowd !== undefined ? (
        <CrowdBar crowd={statement.crowd} />
      ) : null}
    </div>
  );
}

function CrowdBar({ crowd }: { crowd: number }) {
  const pct = Math.max(0, Math.min(100, crowd));
  return (
    <div className="mt-2.5 text-[12px] text-muted-foreground">
      <span className="font-semibold text-primary">{pct}%</span> of similar
      builders agree
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
