"use client";

import type * as React from "react";

import type { SocraticMotion } from "@/components/socratic-ui/motion";
import { FillBlank } from "@/components/socratic-ui/fill-blank";
import { MultiSelect } from "@/components/socratic-ui/multi-select";
import { NegationSelect } from "@/components/socratic-ui/negation-select";
import { PriorityRank } from "@/components/socratic-ui/priority-rank";
import {
  QuestionSequence,
  type QuestionRenderProps,
} from "@/components/socratic-ui/question-sequence";
import type { QuestionSequenceItemNode } from "@/components/socratic-ui/schemas";
import { questionSequenceQuestionSchema } from "@/components/socratic-ui/schemas";
import {
  FILL_BLANK_HINTS,
  MULTI_SELECT_HINTS,
  NEGATION_SELECT_HINTS,
  PRIORITY_RANK_HINTS,
  SINGLE_SELECT_HINTS,
  type KeyboardHint,
  type OptionIconAlignment,
  type OptionIconLayout,
} from "@/components/socratic-ui/shared";
import { SingleSelect } from "@/components/socratic-ui/single-select";

import type { PlaygroundEntry, RendererProps } from "../registry";

interface ItemDispatch {
  hints: KeyboardHint[];
  render: (args: {
    itemNode: QuestionSequenceItemNode;
    renderProps: QuestionRenderProps;
    motion: SocraticMotion | undefined;
    iconLayout: OptionIconLayout | undefined;
    iconAlignment: OptionIconAlignment | undefined;
  }) => React.ReactNode;
}

// Single source of truth for per-kind keyboard hints + rendering.
// Adding a new question kind to sequences means adding one entry here
// and widening `QuestionSequenceItemNode` in schemas.ts.
const DISPATCH: Record<QuestionSequenceItemNode["kind"], ItemDispatch> = {
  "single-select": {
    hints: SINGLE_SELECT_HINTS,
    render: ({ itemNode, renderProps, motion, iconLayout, iconAlignment }) => {
      if (itemNode.kind !== "single-select") return null;
      return (
        <SingleSelect
          {...itemNode.props}
          value={(renderProps.value as string | null) ?? null}
          onChange={renderProps.onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    },
  },
  "multi-select": {
    hints: MULTI_SELECT_HINTS,
    render: ({ itemNode, renderProps, motion, iconLayout, iconAlignment }) => {
      if (itemNode.kind !== "multi-select") return null;
      return (
        <MultiSelect
          {...itemNode.props}
          value={(renderProps.value as string[] | undefined) ?? []}
          onChange={renderProps.onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    },
  },
  "priority-rank": {
    hints: PRIORITY_RANK_HINTS,
    render: ({ itemNode, renderProps, motion, iconLayout, iconAlignment }) => {
      if (itemNode.kind !== "priority-rank") return null;
      return (
        <PriorityRank
          {...itemNode.props}
          value={(renderProps.value as string[] | undefined) ?? []}
          onChange={renderProps.onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    },
  },
  "fill-blank": {
    hints: FILL_BLANK_HINTS,
    render: ({ itemNode, renderProps, motion }) => {
      if (itemNode.kind !== "fill-blank") return null;
      return (
        <FillBlank
          {...itemNode.props}
          value={
            (renderProps.value as Record<string, string> | undefined) ?? {}
          }
          onChange={renderProps.onChange}
          motion={motion}
        />
      );
    },
  },
  "negation-select": {
    hints: NEGATION_SELECT_HINTS,
    render: ({ itemNode, renderProps, motion, iconLayout, iconAlignment }) => {
      if (itemNode.kind !== "negation-select") return null;
      return (
        <NegationSelect
          {...itemNode.props}
          value={(renderProps.value as string[] | undefined) ?? []}
          onChange={renderProps.onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    },
  },
};

function QuestionSequenceRenderer({
  node,
  motion,
  optionIcons,
}: RendererProps<"question-sequence">) {
  return (
    <QuestionSequence>
      {node.props.items.map((item) => {
        const dispatch = DISPATCH[item.node.kind];
        return (
          <QuestionSequence.Item
            key={item.id}
            id={item.id}
            hints={dispatch.hints}
          >
            {(renderProps) =>
              dispatch.render({
                itemNode: item.node,
                renderProps,
                motion,
                iconLayout: optionIcons?.layout,
                iconAlignment: optionIcons?.alignment,
              })
            }
          </QuestionSequence.Item>
        );
      })}
    </QuestionSequence>
  );
}

export const questionSequenceEntry: PlaygroundEntry<"question-sequence"> = {
  slug: "question-sequence",
  label: "Question Sequence",
  description:
    "Chain multiple Socratic components into a one-question-at-a-time flow with pagination, skip/next, and keyboard navigation.",
  schema: questionSequenceQuestionSchema,
  Renderer: QuestionSequenceRenderer,
  // Tweakers intentionally minimal — the nested shape doesn't map cleanly
  // onto the rail's flat field editor. Use scenarios and edge cases to
  // explore sequence variants instead.
  tweakers: [],
  scenarios: [
    {
      id: "onboarding",
      label: "Founder onboarding",
      description: "A three-step warm-up that echoes the Claude-style screenshots.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I'm ramping up on a new side project and need to get out of my own head. Ask me a few things.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Great — let's work through a few quick questions together.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "question-sequence",
            props: {
              items: [
                {
                  id: "vibe",
                  node: {
                    kind: "single-select",
                    props: {
                      question: "What's your vibe right now?",
                      options: [
                        { title: "Building mode" },
                        { title: "Planning mode" },
                        { title: "Procrastinating" },
                        { title: "Just vibing" },
                      ],
                      freeformPlaceholder: "Something else",
                    },
                  },
                },
                {
                  id: "tools",
                  node: {
                    kind: "multi-select",
                    props: {
                      question: "Which of these are you actively using?",
                      max: 4,
                      options: [
                        { title: "Claude Code" },
                        { title: "Todoist" },
                        { title: "Granola" },
                        { title: "Buildstory" },
                        { title: "Something else" },
                      ],
                    },
                  },
                },
                {
                  id: "priorities",
                  node: {
                    kind: "priority-rank",
                    props: {
                      question: "Rank what matters most for Buildstory right now",
                      items: [
                        { title: "Ship features" },
                        { title: "Grow community" },
                        { title: "Polish UX" },
                        { title: "Content & marketing" },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "scoping",
      label: "Scope a project",
      description: "Fill in a pitch, then eliminate what isn't needed.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "Help me scope the next thing I'm building before I run off.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "question-sequence",
            props: {
              items: [
                {
                  id: "pitch",
                  node: {
                    kind: "fill-blank",
                    props: {
                      question: "Describe it in one sentence",
                      subtitle: "Fill in the blanks — constraints spark clarity.",
                      template:
                        "I want to build a {what} for {who} that helps them {outcome}.",
                      slots: [
                        { id: "what", placeholder: "product type" },
                        { id: "who", placeholder: "audience" },
                        { id: "outcome", placeholder: "outcome" },
                      ],
                    },
                  },
                },
                {
                  id: "out-of-scope",
                  node: {
                    kind: "negation-select",
                    props: {
                      question: "What do you definitely NOT need?",
                      subtitle:
                        "Eliminate what's out of scope — it's easier than picking what's in.",
                      options: [
                        { title: "Complex onboarding" },
                        { title: "Social features" },
                        { title: "Real-time collaboration" },
                        { title: "Offline support" },
                        { title: "Internationalisation" },
                      ],
                    },
                  },
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
      id: "first-only",
      label: "Single question",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          items: node.props.items.slice(0, 1),
        },
      }),
    },
    {
      id: "reversed",
      label: "Reversed order",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          items: [...node.props.items].reverse(),
        },
      }),
    },
  ],
};
