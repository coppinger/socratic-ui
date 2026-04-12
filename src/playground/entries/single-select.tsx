"use client";

import { useState } from "react";

import { useGeneratedOptionIcons } from "@/components/socratic-ui/option-icons";
import { SingleSelect } from "@/components/socratic-ui/single-select";
import { singleSelectQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

/**
 * Renders the real `SingleSelect` and owns its local answer state. The
 * parent in `socratic-renderer` keys this on the active scenario id so
 * switching scenarios resets state, while in-place tweaker edits keep
 * the current selection.
 */
function SingleSelectRenderer({
  node,
  motion,
  optionIcons,
}: RendererProps<"single-select">) {
  const [value, setValue] = useState<string | string[] | null>(null);
  const [freeformValue, setFreeformValue] = useState("");
  const options = useGeneratedOptionIcons(node.props.options, optionIcons?.show);

  return (
    <SingleSelect
      question={node.props.question}
      subtitle={node.props.subtitle}
      options={options}
      value={value}
      onChange={setValue}
      freeformPlaceholder={node.props.freeformPlaceholder}
      freeformValue={freeformValue}
      onFreeformChange={setFreeformValue}
      motion={motion}
      iconLayout={optionIcons?.layout}
      iconAlignment={optionIcons?.alignment}
      allowMultiple={node.props.allowMultiple}
      suggested={node.props.suggested}
      max={node.props.max}
    />
  );
}

export const singleSelectEntry: PlaygroundEntry<"single-select"> = {
  slug: "single-select",
  label: "Single Select",
  description:
    "Pick one option from a list, with an optional freeform note for extra context.",
  schema: singleSelectQuestionSchema,
  Renderer: SingleSelectRenderer,
  tweakers: [
    {
      kind: "string",
      path: "question",
      label: "Question",
      multiline: true,
    },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
    {
      kind: "options-list",
      path: "options",
      label: "Options",
      min: 2,
      max: 12,
    },
    {
      kind: "string",
      path: "freeformPlaceholder",
      label: "Freeform placeholder",
      placeholder: "(off — leave empty to hide textarea)",
    },
    {
      kind: "boolean",
      path: "allowMultiple",
      label: "Allow multiple",
    },
    {
      kind: "number",
      path: "suggested",
      label: "Suggested (soft cap)",
      min: 1,
      max: 12,
      step: 1,
    },
    {
      kind: "number",
      path: "max",
      label: "Max (hard cap)",
      min: 1,
      max: 12,
      step: 1,
    },
  ],
  scenarios: [
    {
      id: "travel",
      label: "Travel planning",
      description: "Picking a destination for a long weekend.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I have a four-day weekend coming up and I want to get away somewhere I haven't been before. Help me decide.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Love that. Quick question to narrow it down — what kind of vibe are you after?",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "single-select",
            props: {
              question: "What kind of trip are you after?",
              subtitle: "Pick the one that pulls at you most.",
              options: [
                {
                  title: "Coastal escape",
                  subtitle: "Salt air, slow mornings, fresh seafood.",
                },
                {
                  title: "Mountain reset",
                  subtitle: "Hikes, big skies, no agenda.",
                },
                {
                  title: "City to explore",
                  subtitle: "Museums, neighborhoods, late dinners.",
                },
                {
                  title: "Spa & stillness",
                  subtitle: "A weekend that ends with you exhaling.",
                },
              ],
              freeformPlaceholder: "Or describe something else…",
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "min-options",
      label: "2 options",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          options: node.props.options.slice(0, 2),
        },
      }),
    },
    {
      id: "many-options",
      label: "10 options",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          options: Array.from({ length: 10 }, (_, i) => ({
            title: `Option ${i + 1}`,
            subtitle: `Description for option ${i + 1}`,
          })),
        },
      }),
    },
    {
      id: "long-titles",
      label: "Long titles",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          options: node.props.options.map((opt) => ({
            ...opt,
            title: `${opt.title} — with a much longer descriptive title that wraps onto two lines`,
          })),
        },
      }),
    },
    {
      id: "no-subtitles",
      label: "No subtitles",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          options: node.props.options.map(({ title }) => ({ title })),
        },
      }),
    },
    {
      id: "no-freeform",
      label: "No freeform",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          freeformPlaceholder: false as unknown as string,
        },
      }),
    },
    {
      id: "allow-multiple",
      label: "Allow multiple",
      apply: (node) => ({
        ...node,
        props: { ...node.props, allowMultiple: true },
      }),
    },
    {
      id: "allow-multiple-suggested",
      label: "Multiple + suggested 2",
      apply: (node) => ({
        ...node,
        props: { ...node.props, allowMultiple: true, suggested: 2 },
      }),
    },
    {
      id: "allow-multiple-max",
      label: "Multiple + max 3",
      apply: (node) => ({
        ...node,
        props: { ...node.props, allowMultiple: true, max: 3 },
      }),
    },
    {
      id: "recommended",
      label: "Recommended option",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          options: node.props.options.map((opt, i) =>
            i === 1
              ? {
                  ...opt,
                  recommended:
                    "Best fit based on your schedule and budget range",
                }
              : opt,
          ),
        },
      }),
    },
  ],
};
