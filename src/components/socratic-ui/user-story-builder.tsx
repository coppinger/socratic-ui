"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { SocraticMotion } from "./motion";
import {
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  USER_STORY_BUILDER_HINTS,
  useSequenceQuestion,
} from "./shared";

export type UserStory = {
  persona: string;
  action: string;
  outcome: string;
};

export interface UserStoryBuilderProps {
  question: string;
  subtitle?: string;
  value: UserStory[];
  onChange: (value: UserStory[]) => void;
  /** Suggestion chips for each slot. Clicking a chip fills the field. */
  personas?: string[];
  actions?: string[];
  outcomes?: string[];
  /** Upper bound on how many stories the user can add. */
  maxStories?: number;
  number?: string;
  motion?: SocraticMotion;
}

/**
 * Repeatable "As a ___, I want ___, so that ___" story composer with
 * chip-suggestions per slot. Users can type freely or click a chip to
 * fill a field. Canonical for product specs — every story is an
 * explicit user + outcome pair, not a vague feature blurb.
 */
export function UserStoryBuilder({
  question,
  subtitle,
  value,
  onChange,
  personas = [],
  actions = [],
  outcomes = [],
  maxStories = 5,
  number,
  motion,
}: UserStoryBuilderProps) {
  const storiesForDisplay = React.useMemo<UserStory[]>(
    () =>
      value.length === 0
        ? [{ persona: "", action: "", outcome: "" }]
        : value,
    [value],
  );

  const stageRef = React.useRef<HTMLDivElement>(null);

  const updateStory = (index: number, patch: Partial<UserStory>) => {
    // Spreading `storiesForDisplay` promotes the synthetic blank to a
    // real story on first edit.
    const next = [...storiesForDisplay];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeStory = (index: number) => {
    // Only reachable when `storiesForDisplay.length > 1`, which requires
    // `value.length >= 2`.
    onChange(value.filter((_, i) => i !== index));
  };

  const addStory = () => {
    if (storiesForDisplay.length >= maxStories) return;
    onChange([
      ...storiesForDisplay,
      { persona: "", action: "", outcome: "" },
    ]);
  };

  const completedCount = storiesForDisplay.reduce(
    (count, story) =>
      story.persona.trim() !== "" &&
      story.action.trim() !== "" &&
      story.outcome.trim() !== ""
        ? count + 1
        : count,
    0,
  );
  const canSubmit = completedCount > 0;

  const focusFirst = React.useCallback(() => {
    const first = stageRef.current?.querySelector<HTMLInputElement>(
      'input[data-story-field="persona-0"]',
    );
    first?.focus();
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit,
    focusFirst,
    hints: USER_STORY_BUILDER_HINTS,
  });

  const canAdd = storiesForDisplay.length < maxStories;
  const statusText =
    completedCount > 0
      ? `${completedCount} complete stor${completedCount === 1 ? "y" : "ies"}`
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
      <div ref={stageRef} className="flex flex-col gap-3.5 px-7 pb-2">
        <MotionStage motion={motion} className="flex flex-col gap-3">
          {storiesForDisplay.map((story, index) => (
            <MotionItem motion={motion} key={index}>
              <StoryCard
                index={index}
                story={story}
                personas={personas}
                actions={actions}
                outcomes={outcomes}
                onChangePersona={(next) => updateStory(index, { persona: next })}
                onChangeAction={(next) => updateStory(index, { action: next })}
                onChangeOutcome={(next) => updateStory(index, { outcome: next })}
                onRemove={
                  storiesForDisplay.length > 1
                    ? () => removeStory(index)
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
            onClick={addStory}
            disabled={!canAdd}
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            Add another story
          </Button>
        </div>
      </div>
    </QuestionCard>
  );
}

function StoryCard({
  index,
  story,
  personas,
  actions,
  outcomes,
  onChangePersona,
  onChangeAction,
  onChangeOutcome,
  onRemove,
}: {
  index: number;
  story: UserStory;
  personas: string[];
  actions: string[];
  outcomes: string[];
  onChangePersona: (next: string) => void;
  onChangeAction: (next: string) => void;
  onChangeOutcome: (next: string) => void;
  onRemove?: () => void;
}) {
  const complete =
    story.persona.trim() !== "" &&
    story.action.trim() !== "" &&
    story.outcome.trim() !== "";

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-4 transition-colors",
        complete ? "border-primary/40 bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Story {index + 1}
        </span>
        <button
          type="button"
          aria-label={`Remove story ${index + 1}`}
          onClick={onRemove}
          disabled={!onRemove}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
            "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
            onRemove
              ? "hover:bg-muted hover:text-foreground"
              : "cursor-default opacity-40",
          )}
        >
          <X className="size-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <StorySlot
          label="As a"
          fieldKey={`persona-${index}`}
          value={story.persona}
          onChange={onChangePersona}
          suggestions={personas}
          placeholder="persona"
        />
        <StorySlot
          label="I want to"
          fieldKey={`action-${index}`}
          value={story.action}
          onChange={onChangeAction}
          suggestions={actions}
          placeholder="action"
        />
        <StorySlot
          label="so that"
          fieldKey={`outcome-${index}`}
          value={story.outcome}
          onChange={onChangeOutcome}
          suggestions={outcomes}
          placeholder="outcome"
        />
      </div>
    </div>
  );
}

function StorySlot({
  label,
  fieldKey,
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  fieldKey: string;
  value: string;
  onChange: (next: string) => void;
  suggestions: string[];
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <span className="w-[70px] shrink-0 text-[12px] font-semibold text-muted-foreground">
          {label}
        </span>
        <Input
          data-story-field={fieldKey}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={`${label} ${placeholder}`}
          className="bg-background"
        />
      </div>
      {suggestions.length > 0 ? (
        <div className="ml-[82px] flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => {
            const picked = value === suggestion;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(picked ? "" : suggestion)}
                aria-pressed={picked}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                  "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
                  picked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted/50 text-muted-foreground hover:border-primary/40 hover:bg-muted",
                )}
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
