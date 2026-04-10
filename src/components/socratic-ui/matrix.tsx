"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  MATRIX_HINTS,
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";

export type MatrixRow = {
  /** Stable identifier used as the key in the ratings map. */
  id: string;
  title: string;
  subtitle?: string;
};

export interface MatrixProps {
  question: string;
  subtitle?: string;
  rows: MatrixRow[];
  /** Ordered level labels — index 0 is the lowest level. */
  levels: string[];
  /** Map of row id → 0-based level index. */
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Grid assessment with a fill-bar feel. Each row is rated on the same
 * ordered level scale; selecting a level "fills" every cell from the
 * start up to and including the chosen index so the row reads as a
 * progress bar at a glance. Rows are independent horizontal roving
 * lists — arrow keys change the level, Tab moves between rows.
 */
export function Matrix({
  question,
  subtitle,
  rows,
  levels,
  value,
  onChange,
  number,
  motion,
}: MatrixProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);

  const setLevel = (rowId: string, levelIndex: number) => {
    onChange({ ...value, [rowId]: levelIndex });
  };

  const ratedCount = rows.reduce(
    (count, row) => (value[row.id] !== undefined ? count + 1 : count),
    0,
  );
  const allRated = ratedCount === rows.length;

  const focusFirst = React.useCallback(() => {
    const first = stageRef.current?.querySelector<HTMLElement>(
      '[data-matrix-row="0"] [data-roving-index="0"]',
    );
    first?.focus();
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit: allRated,
    focusFirst,
    hints: MATRIX_HINTS,
  });

  const statusText = allRated
    ? `All ${rows.length} rated`
    : `${ratedCount} of ${rows.length} rated`;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        sequence || ratedCount > 0 ? (
          <QuestionFooter statusText={statusText} />
        ) : null
      }
    >
      <div ref={stageRef} className="px-7 pb-2">
        <MotionStage motion={motion} className="flex flex-col gap-3.5">
          {rows.map((row, rowIndex) => (
            <MotionItem motion={motion} key={row.id}>
              <MatrixRowControl
                rowIndex={rowIndex}
                row={row}
                levels={levels}
                selectedIndex={value[row.id]}
                onSelect={(levelIndex) => setLevel(row.id, levelIndex)}
              />
            </MotionItem>
          ))}
        </MotionStage>
      </div>
    </QuestionCard>
  );
}

function MatrixRowControl({
  rowIndex,
  row,
  levels,
  selectedIndex,
  onSelect,
}: {
  rowIndex: number;
  row: MatrixRow;
  levels: string[];
  selectedIndex: number | undefined;
  onSelect: (levelIndex: number) => void;
}) {
  const { getItemProps } = useRovingFocus({
    count: levels.length,
    orientation: "horizontal",
    initialIndex: selectedIndex ?? 0,
    onActivate: onSelect,
  });

  const rated = selectedIndex !== undefined;

  return (
    <div
      data-matrix-row={rowIndex}
      className={cn(
        "rounded-xl border px-4 py-3.5 transition-colors",
        rated ? "border-primary/40 bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="mb-2.5">
        <span className="text-[14px] font-semibold leading-tight text-foreground">
          {row.title}
        </span>
        {row.subtitle ? (
          <span className="ml-2 text-[12px] text-muted-foreground">
            {row.subtitle}
          </span>
        ) : null}
      </div>
      <div
        role="radiogroup"
        aria-label={row.title}
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))`,
        }}
      >
        {levels.map((level, levelIndex) => {
          const isSelected = selectedIndex === levelIndex;
          const isFilled = selectedIndex !== undefined && levelIndex <= selectedIndex;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${row.title}: ${level}`}
              onClick={() => onSelect(levelIndex)}
              className={cn(
                "rounded-lg px-1 py-2 text-[11px] font-medium transition-colors",
                "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isFilled
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
              {...getItemProps(levelIndex)}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
}
