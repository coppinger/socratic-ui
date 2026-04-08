"use client";

import { useState } from "react";

import { FillBlank } from "@/components/socratic-ui/fill-blank";
import { fillBlankQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function FillBlankRenderer({
  node,
  motion,
}: RendererProps<"fill-blank">) {
  // Reset state when the slot ids change so an edge-case swap to a
  // different template doesn't strand stale slot keys.
  const slotKey = node.props.slots.map((s) => s.id).join(",");
  const [value, setValue] = useState<Record<string, string>>({});
  return (
    <FillBlank
      key={slotKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      template={node.props.template}
      slots={node.props.slots}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const fillBlankEntry: PlaygroundEntry<"fill-blank"> = {
  slug: "fill-blank",
  label: "Fill Blank",
  description:
    "Mad-libs template with inline editable slots. Constraints spark clarity.",
  schema: fillBlankQuestionSchema,
  Renderer: FillBlankRenderer,
  // Template + slot ids must stay in sync, so neither is exposed as a
  // free-text tweaker. Edge cases swap whole template/slot pairs.
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
  ],
  scenarios: [
    {
      id: "project-frame",
      label: "Frame the project",
      description: "Forcing a one-sentence definition before any work begins.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I have an idea I want to build but every time I describe it I trail off into details.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "That happens when the shape isn't clear yet. Try filling this in — short answers force the edges.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "fill-blank",
            props: {
              question: "Frame your project in one sentence.",
              subtitle: "Three blanks. Keep each one tight.",
              template:
                "I want to build a {what} for {who} that helps them {outcome}.",
              slots: [
                { id: "what", placeholder: "kind of thing" },
                { id: "who", placeholder: "audience" },
                { id: "outcome", placeholder: "the change they feel" },
              ],
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "single-slot",
      label: "Single slot",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          template: "The one thing I'm avoiding is {thing}.",
          slots: [{ id: "thing", placeholder: "be honest" }],
        },
      }),
    },
    {
      id: "long-template",
      label: "Long template",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          template:
            "When I imagine the version of this that {state}, the user is {who}, they're trying to {goal}, and the moment they'll feel it worked is when {moment}.",
          slots: [
            { id: "state", placeholder: "actually exists" },
            { id: "who", placeholder: "the person" },
            { id: "goal", placeholder: "their goal" },
            { id: "moment", placeholder: "the aha" },
          ],
        },
      }),
    },
    {
      id: "no-subtitle",
      label: "No subtitle",
      apply: (node) => ({
        ...node,
        props: { ...node.props, subtitle: undefined },
      }),
    },
  ],
};
