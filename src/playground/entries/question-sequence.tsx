"use client";

import * as React from "react";

import type { SocraticMotion } from "@/components/socratic-ui/motion";
import { AgreementSpectrum } from "@/components/socratic-ui/agreement-spectrum";
import { FillBlank } from "@/components/socratic-ui/fill-blank";
import { MultiSelect } from "@/components/socratic-ui/multi-select";
import { NegationSelect } from "@/components/socratic-ui/negation-select";
import { OpenQuestions } from "@/components/socratic-ui/open-questions";
import { generatedOptionIcon } from "@/components/socratic-ui/option-icons";
import { PriorityRank } from "@/components/socratic-ui/priority-rank";
import {
  SequenceShell,
  useQuestionSequence,
} from "@/components/socratic-ui/question-sequence";
import type { QuestionSequenceItemNode } from "@/components/socratic-ui/schemas";
import { questionSequenceQuestionSchema } from "@/components/socratic-ui/schemas";
import type {
  OptionIconAlignment,
  OptionIconLayout,
} from "@/components/socratic-ui/shared";
import { SingleSelect } from "@/components/socratic-ui/single-select";
import {
  Spectrum,
  spectrumInitialValue,
} from "@/components/socratic-ui/spectrum";

import type { PlaygroundEntry, RendererProps } from "../registry";

/**
 * Renders the active item in a schema-driven sequence. Switches on the
 * node's `kind` and binds it to the shared answers map via the
 * controller's `bind` helper — no per-item dispatch table needed since
 * the hook owns state and each input declares its own sequence chrome +
 * keyboard hints via `useSequenceQuestion`.
 */
function renderItem({
  node,
  value,
  onChange,
  motion,
  iconLayout,
  iconAlignment,
}: {
  node: QuestionSequenceItemNode;
  value: unknown;
  onChange: (value: unknown) => void;
  motion: SocraticMotion | undefined;
  iconLayout: OptionIconLayout | undefined;
  iconAlignment: OptionIconAlignment | undefined;
}) {
  switch (node.kind) {
    case "single-select":
      return (
        <SingleSelect
          {...node.props}
          value={(value as string | null | undefined) ?? null}
          onChange={onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    case "multi-select":
      return (
        <MultiSelect
          {...node.props}
          value={(value as string[] | undefined) ?? []}
          onChange={onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    case "priority-rank":
      return (
        <PriorityRank
          {...node.props}
          value={(value as string[] | undefined) ?? []}
          onChange={onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    case "fill-blank":
      return (
        <FillBlank
          {...node.props}
          value={(value as Record<string, string> | undefined) ?? {}}
          onChange={onChange}
          motion={motion}
        />
      );
    case "negation-select":
      return (
        <NegationSelect
          {...node.props}
          value={(value as string[] | undefined) ?? []}
          onChange={onChange}
          motion={motion}
          iconLayout={iconLayout}
          iconAlignment={iconAlignment}
        />
      );
    case "open-questions":
      return (
        <OpenQuestions
          {...node.props}
          value={(value as Record<string, string> | undefined) ?? {}}
          onChange={onChange}
          motion={motion}
        />
      );
    case "spectrum":
      return (
        <Spectrum
          {...node.props}
          value={
            (value as number | undefined) ?? spectrumInitialValue(node.props)
          }
          onChange={onChange}
          motion={motion}
        />
      );
    case "agreement-spectrum":
      return (
        <AgreementSpectrum
          {...node.props}
          value={(value as Record<string, number> | undefined) ?? {}}
          onChange={onChange}
          motion={motion}
        />
      );
  }
}

/**
 * Injects a generated lucide icon per option/item position for the
 * option-bearing node kinds when the playground toggle is on. Mirrors
 * `useGeneratedOptionIcons` used by the flat entries, but inline so it
 * can map across the sequence's heterogeneous node list.
 */
function withGeneratedIcons(
  node: QuestionSequenceItemNode,
): QuestionSequenceItemNode {
  switch (node.kind) {
    case "single-select":
      return {
        ...node,
        props: {
          ...node.props,
          options: node.props.options.map((option, index) => ({
            ...option,
            icon: generatedOptionIcon(index),
          })),
        },
      };
    case "multi-select":
      return {
        ...node,
        props: {
          ...node.props,
          options: node.props.options.map((option, index) => ({
            ...option,
            icon: generatedOptionIcon(index),
          })),
        },
      };
    case "negation-select":
      return {
        ...node,
        props: {
          ...node.props,
          options: node.props.options.map((option, index) => ({
            ...option,
            icon: generatedOptionIcon(index),
          })),
        },
      };
    case "priority-rank":
      return {
        ...node,
        props: {
          ...node.props,
          items: node.props.items.map((item, index) => ({
            ...item,
            icon: generatedOptionIcon(index),
          })),
        },
      };
    case "fill-blank":
    case "open-questions":
    case "spectrum":
    case "agreement-spectrum":
      return node;
  }
}

function QuestionSequenceRenderer({
  node,
  motion,
  optionIcons,
}: RendererProps<"question-sequence">) {
  const items = node.props.items;
  const showIcons = optionIcons?.show ?? false;
  const nodeById = React.useMemo(
    () =>
      new Map(
        items.map((item) => [
          item.id,
          showIcons ? withGeneratedIcons(item.node) : item.node,
        ]),
      ),
    [items, showIcons],
  );
  const ids = React.useMemo(() => items.map((item) => item.id), [items]);

  const seq = useQuestionSequence({ ids });

  return (
    <SequenceShell
      controller={seq}
      render={(currentId) => {
        const itemNode = nodeById.get(currentId);
        if (!itemNode) return null;
        return renderItem({
          node: itemNode,
          value: seq.answers[currentId],
          onChange: (value) => seq.setAnswer(currentId, value),
          motion,
          iconLayout: optionIcons?.layout,
          iconAlignment: optionIcons?.alignment,
        });
      }}
    />
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
