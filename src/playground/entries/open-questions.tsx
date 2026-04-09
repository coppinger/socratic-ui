"use client";

import { useState } from "react";

import { OpenQuestions } from "@/components/socratic-ui/open-questions";
import { openQuestionsQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function OpenQuestionsRenderer({
  node,
  motion,
}: RendererProps<"open-questions">) {
  // Reset stored answers when prompt ids change so an edge-case swap
  // doesn't strand stale keys.
  const idKey = node.props.prompts.map((p) => p.id).join(",");
  const [value, setValue] = useState<Record<string, string>>({});
  return (
    <OpenQuestions
      key={idKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      prompts={node.props.prompts}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const openQuestionsEntry: PlaygroundEntry<"open-questions"> = {
  slug: "open-questions",
  label: "Open Questions",
  description:
    "Stack of open-ended prompts, each with its own auto-growing textarea. Use when the AI needs every blank filled in one shot.",
  schema: openQuestionsQuestionSchema,
  Renderer: OpenQuestionsRenderer,
  tweakers: [
    {
      kind: "string",
      path: "question",
      label: "Heading",
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
      id: "debug-help",
      label: "Debug help",
      description: "Triaging a stuck engineer with three quick prompts.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I've been stuck on this bug for two hours and I don't know how to describe it.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Let me get the shape of it. Answer these three and I'll dig in.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "open-questions",
            props: {
              question: "Help me understand what you're hitting",
              subtitle: "A few sentences each is plenty.",
              prompts: [
                {
                  id: "goal",
                  text: "What are you trying to make happen?",
                  placeholder: "The outcome you want…",
                },
                {
                  id: "tried",
                  text: "What have you tried so far?",
                  placeholder: "Approaches, dead ends, partial fixes…",
                },
                {
                  id: "stuck",
                  text: "Where exactly does it break?",
                  placeholder: "Error, unexpected behaviour, missing piece…",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "retro",
      label: "Weekly retro",
      description: "Three reflection prompts at the end of a week.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "Help me close out this week before I sign off.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "open-questions",
            props: {
              question: "Quick weekly retro",
              subtitle: "Free-form — just whatever comes to mind first.",
              prompts: [
                { id: "wins", text: "What actually moved this week?" },
                { id: "drag", text: "What dragged or drained you?" },
                {
                  id: "next",
                  text: "What's the one thing you want to land next week?",
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
      id: "single-prompt",
      label: "Single prompt",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          prompts: node.props.prompts.slice(0, 1),
        },
      }),
    },
    {
      id: "many-prompts",
      label: "5 prompts",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          prompts: Array.from({ length: 5 }, (_, i) => ({
            id: `q${i + 1}`,
            text: `Open question ${i + 1}?`,
            placeholder: "Your answer…",
          })),
        },
      }),
    },
    {
      id: "long-prompt",
      label: "Long prompt text",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          prompts: node.props.prompts.map((p) => ({
            ...p,
            text: `${p.text} Take your time and be as specific as you can — context helps a lot here.`,
          })),
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
