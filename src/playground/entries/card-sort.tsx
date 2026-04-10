"use client";

import { useState } from "react";

import { CardSort } from "@/components/socratic-ui/card-sort";
import { cardSortQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function CardSortRenderer({ node, motion }: RendererProps<"card-sort">) {
  // Reset local state when the bucket set changes (edge-case swaps).
  const bucketKey = node.props.buckets.map((b) => b.id).join(",");
  const [value, setValue] = useState<Record<string, string[]>>({});

  return (
    <CardSort
      key={bucketKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      buckets={node.props.buckets}
      items={node.props.items}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const cardSortEntry: PlaygroundEntry<"card-sort"> = {
  slug: "card-sort",
  label: "Card Sort",
  description:
    "Bucket items into categories — Must / Nice / Not needed, or any custom triage you can think up.",
  schema: cardSortQuestionSchema,
  Renderer: CardSortRenderer,
  tweakers: [
    { kind: "string", path: "question", label: "Question", multiline: true },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
  ],
  scenarios: [
    {
      id: "moscow",
      label: "MoSCoW features",
      description: "Classic must-have / nice-to-have / out-of-scope triage.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I've got a list of features I'd love to build but I need to get real about what's in scope for v1.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Let's triage them. Pick a bucket, then tap each feature to sort.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "card-sort",
            props: {
              question: "Sort these features for v1",
              subtitle: "Pick a bucket, then tap features to place them.",
              buckets: [
                {
                  id: "must",
                  title: "Must have",
                  subtitle: "Blocks launch without it",
                  tone: "affirm",
                },
                {
                  id: "nice",
                  title: "Nice to have",
                  subtitle: "A later milestone",
                  tone: "neutral",
                },
                {
                  id: "not",
                  title: "Not needed",
                  subtitle: "Out of scope",
                  tone: "muted",
                },
              ],
              items: [
                { title: "Auth system", subtitle: "Login, signup, permissions" },
                {
                  title: "Analytics",
                  subtitle: "Usage tracking and dashboards",
                },
                { title: "Dark mode", subtitle: "Alternate colour scheme" },
                {
                  title: "Notifications",
                  subtitle: "Email, push, or in-app alerts",
                },
                { title: "Search", subtitle: "Full-text search across content" },
                { title: "Export", subtitle: "CSV, PDF, or API data export" },
              ],
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "two-buckets",
      label: "2 buckets",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          buckets: node.props.buckets.slice(0, 2),
        },
      }),
    },
    {
      id: "many-items",
      label: "10 items",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          items: Array.from({ length: 10 }, (_, i) => ({
            title: `Feature ${i + 1}`,
            subtitle: `Description for feature ${i + 1}`,
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
          items: node.props.items.map(({ title }) => ({ title })),
          buckets: node.props.buckets.map(({ id, title, tone }) => ({
            id,
            title,
            tone,
          })),
        },
      }),
    },
  ],
};
