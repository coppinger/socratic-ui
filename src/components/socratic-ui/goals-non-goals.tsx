"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { SocraticMotion } from "./motion";
import {
  GOALS_NON_GOALS_HINTS,
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  useSequenceQuestion,
} from "./shared";

export type GoalsNonGoalsPair = {
  goal: string;
  nonGoal: string;
};

export interface GoalsNonGoalsProps {
  question: string;
  subtitle?: string;
  /** Controlled list of pair rows. Always includes the partial, in-progress rows. */
  value: GoalsNonGoalsPair[];
  onChange: (value: GoalsNonGoalsPair[]) => void;
  goalPlaceholder?: string;
  nonGoalPlaceholder?: string;
  /** Upper bound on how many rows the user can add. */
  maxPairs?: number;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Paired goals vs non-goals list builder. For every goal the user names,
 * they also name the non-goal that frames it — the symmetry is the whole
 * point, which is why this isn't just a CardSort with two buckets. The
 * component always renders at least one editable row so there's never
 * an empty-state dead-zone; completing a row unlocks the "add another"
 * affordance.
 */
export function GoalsNonGoals({
  question,
  subtitle,
  value,
  onChange,
  goalPlaceholder = "e.g. ship a working MVP in 4 weeks",
  nonGoalPlaceholder = "e.g. nail the visual polish",
  maxPairs = 5,
  number,
  motion,
}: GoalsNonGoalsProps) {
  // The component always surfaces at least one row, even if `value` is
  // empty — otherwise users would face an empty state with no obvious
  // action. The blank row is local-only until the user types into it;
  // nothing is reported to `onChange` unless they actually edit a field.
  const rowsForDisplay = React.useMemo<GoalsNonGoalsPair[]>(
    () => (value.length === 0 ? [{ goal: "", nonGoal: "" }] : value),
    [value],
  );

  const stageRef = React.useRef<HTMLDivElement>(null);

  const updateRow = (index: number, patch: Partial<GoalsNonGoalsPair>) => {
    // Spreading `rowsForDisplay` promotes the synthetic blank row to a
    // real row on first edit, in one branch.
    const next = [...rowsForDisplay];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeRow = (index: number) => {
    // Only reachable when `rowsForDisplay.length > 1`, which requires
    // `value.length >= 2` — no length-zero guard needed.
    onChange(value.filter((_, i) => i !== index));
  };

  const addRow = () => {
    if (rowsForDisplay.length >= maxPairs) return;
    onChange([...rowsForDisplay, { goal: "", nonGoal: "" }]);
  };

  const completedCount = rowsForDisplay.reduce(
    (count, row) =>
      row.goal.trim() !== "" && row.nonGoal.trim() !== "" ? count + 1 : count,
    0,
  );
  const canSubmit = completedCount > 0;

  const focusFirst = React.useCallback(() => {
    const first = stageRef.current?.querySelector<HTMLInputElement>(
      'input[data-goals-field="goal-0"]',
    );
    first?.focus();
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit,
    focusFirst,
    hints: GOALS_NON_GOALS_HINTS,
  });

  const canAdd = rowsForDisplay.length < maxPairs;
  const statusText =
    completedCount > 0
      ? `${completedCount} complete pair${completedCount === 1 ? "" : "s"}`
      : null;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        sequence || completedCount > 0 ? (
          <QuestionFooter statusText={statusText} />
        ) : null
      }
    >
      <div ref={stageRef} className="flex flex-col gap-4 px-7 pb-2">
        <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Goal</span>
          <span>Non-goal</span>
          <span className="sr-only">Actions</span>
        </div>
        <MotionStage motion={motion} className="flex flex-col gap-2.5">
          {rowsForDisplay.map((row, index) => (
            <MotionItem motion={motion} key={index}>
              <PairRow
                index={index}
                row={row}
                goalPlaceholder={goalPlaceholder}
                nonGoalPlaceholder={nonGoalPlaceholder}
                onChangeGoal={(next) => updateRow(index, { goal: next })}
                onChangeNonGoal={(next) => updateRow(index, { nonGoal: next })}
                onRemove={
                  rowsForDisplay.length > 1
                    ? () => removeRow(index)
                    : undefined
                }
              />
            </MotionItem>
          ))}
        </MotionStage>
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={!canAdd}
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            Add pair
          </Button>
        </div>
      </div>
    </QuestionCard>
  );
}

function PairRow({
  index,
  row,
  goalPlaceholder,
  nonGoalPlaceholder,
  onChangeGoal,
  onChangeNonGoal,
  onRemove,
}: {
  index: number;
  row: GoalsNonGoalsPair;
  goalPlaceholder: string;
  nonGoalPlaceholder: string;
  onChangeGoal: (next: string) => void;
  onChangeNonGoal: (next: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-3">
      <Input
        data-goals-field={`goal-${index}`}
        value={row.goal}
        onChange={(event) => onChangeGoal(event.target.value)}
        placeholder={goalPlaceholder}
        aria-label={`Goal ${index + 1}`}
        className="bg-card"
      />
      <Input
        data-goals-field={`non-goal-${index}`}
        value={row.nonGoal}
        onChange={(event) => onChangeNonGoal(event.target.value)}
        placeholder={nonGoalPlaceholder}
        aria-label={`Non-goal ${index + 1}`}
        className={cn(
          "bg-card",
          // Visually key the non-goal column so the "what we're NOT
          // doing" half is distinguishable at a glance. The tint is
          // intentionally very soft — we want it to feel like a second
          // voice in the pair, not a warning.
          "border-[color-mix(in_oklab,var(--muted-foreground)_10%,var(--border))] bg-muted/30",
        )}
      />
      <button
        type="button"
        aria-label={`Remove pair ${index + 1}`}
        onClick={onRemove}
        disabled={!onRemove}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors",
          "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
          onRemove
            ? "hover:bg-muted hover:text-foreground"
            : "cursor-default opacity-40",
        )}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
