"use client";

import { useState } from "react";

import {
  GoalsNonGoals,
  type GoalsNonGoalsPair,
} from "@/components/socratic-ui/goals-non-goals";
import { goalsNonGoalsQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function GoalsNonGoalsRenderer({
  node,
  motion,
}: RendererProps<"goals-non-goals">) {
  // Seed from suggestions on mount; reset when suggestions change.
  const suggestionKey = (node.props.suggestions ?? [])
    .map((p) => `${p.goal}|${p.nonGoal}`)
    .join(",");
  const [value, setValue] = useState<GoalsNonGoalsPair[]>(
    () => node.props.suggestions ?? [],
  );

  return (
    <GoalsNonGoals
      key={suggestionKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      value={value}
      onChange={setValue}
      goalPlaceholder={node.props.goalPlaceholder}
      nonGoalPlaceholder={node.props.nonGoalPlaceholder}
      maxPairs={node.props.maxPairs}
      motion={motion}
    />
  );
}

export const goalsNonGoalsEntry: PlaygroundEntry<"goals-non-goals"> = {
  slug: "goals-non-goals",
  label: "Goals / Non-Goals",
  description:
    "For every goal, name the non-goal that frames it. The symmetry is the whole point.",
  schema: goalsNonGoalsQuestionSchema,
  Renderer: GoalsNonGoalsRenderer,
  tweakers: [
    { kind: "string", path: "question", label: "Question", multiline: true },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
    {
      kind: "string",
      path: "goalPlaceholder",
      label: "Goal placeholder",
      placeholder: "(default)",
    },
    {
      kind: "string",
      path: "nonGoalPlaceholder",
      label: "Non-goal placeholder",
      placeholder: "(default)",
    },
    {
      kind: "number",
      path: "maxPairs",
      label: "Max pairs",
      min: 1,
      max: 10,
      step: 1,
    },
  ],
  scenarios: [
    {
      id: "spec-framing",
      label: "Frame a spec",
      description: "Pin down what this project is — and what it isn't.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "Help me write a goals and non-goals section for this thing before I start building.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "goals-non-goals",
            props: {
              question: "Goals & non-goals",
              subtitle:
                "For each goal, name a non-goal — what you're explicitly choosing not to do.",
              goalPlaceholder: "e.g. ship a working MVP in 4 weeks",
              nonGoalPlaceholder: "e.g. nail the visual polish",
              maxPairs: 5,
              suggestions: [
                {
                  goal: "Ship a working MVP in 4 weeks",
                  nonGoal: "Nail the visual polish",
                },
                {
                  goal: "Validate the core user journey",
                  nonGoal: "Support every edge-case workflow",
                },
              ],
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "empty-start",
      label: "Empty start",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          suggestions: undefined,
        },
      }),
    },
    {
      id: "max-two",
      label: "Max 2 pairs",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          maxPairs: 2,
          suggestions: undefined,
        },
      }),
    },
  ],
};
