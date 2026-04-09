"use client";

import { QuestionSequence } from "@/components/socratic-ui/question-sequence";
import {
  MULTI_SELECT_HINTS,
  PRIORITY_RANK_HINTS,
  SINGLE_SELECT_HINTS,
} from "@/components/socratic-ui/shared";
import { SingleSelect } from "@/components/socratic-ui/single-select";
import { MultiSelect } from "@/components/socratic-ui/multi-select";
import { PriorityRank } from "@/components/socratic-ui/priority-rank";

export function QuestionSequenceDemo() {
  return (
    <QuestionSequence
      onComplete={(answers) => {
        console.log("Sequence complete", answers);
      }}
    >
      <QuestionSequence.Item id="vibe" hints={SINGLE_SELECT_HINTS}>
        {({ value, onChange }) => (
          <SingleSelect
            question="What's your vibe right now?"
            options={[
              { title: "Building mode" },
              { title: "Planning mode" },
              { title: "Procrastinating" },
              { title: "Just vibing" },
            ]}
            value={(value as string | null) ?? null}
            onChange={(next) => onChange(next)}
            freeformPlaceholder="Something else"
          />
        )}
      </QuestionSequence.Item>

      <QuestionSequence.Item id="tools" hints={MULTI_SELECT_HINTS}>
        {({ value, onChange }) => (
          <MultiSelect
            question="Which of these are you actively using?"
            max={4}
            options={[
              { title: "Claude Code" },
              { title: "Todoist" },
              { title: "Granola" },
              { title: "Buildstory" },
              { title: "Something else" },
            ]}
            value={(value as string[] | undefined) ?? []}
            onChange={(next) => onChange(next)}
          />
        )}
      </QuestionSequence.Item>

      <QuestionSequence.Item id="priorities" hints={PRIORITY_RANK_HINTS}>
        {({ value, onChange }) => (
          <PriorityRank
            question="Rank what matters most for Buildstory right now"
            items={[
              { title: "Ship features" },
              { title: "Grow community" },
              { title: "Polish UX" },
              { title: "Content & marketing" },
            ]}
            value={(value as string[] | undefined) ?? []}
            onChange={(next) => onChange(next)}
          />
        )}
      </QuestionSequence.Item>
    </QuestionSequence>
  );
}
