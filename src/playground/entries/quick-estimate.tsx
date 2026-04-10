"use client";

import { useState } from "react";

import { QuickEstimate } from "@/components/socratic-ui/quick-estimate";
import { quickEstimateQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function QuickEstimateRenderer({
  node,
  motion,
}: RendererProps<"quick-estimate">) {
  // Reset when the dimension ids change (edge-case swaps).
  const dimensionKey = node.props.dimensions.map((d) => d.id).join(",");
  const [value, setValue] = useState<Record<string, string | null>>({});

  return (
    <QuickEstimate
      key={dimensionKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      dimensions={node.props.dimensions}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const quickEstimateEntry: PlaygroundEntry<"quick-estimate"> = {
  slug: "quick-estimate",
  label: "Quick Estimate",
  description:
    "Stack two or three related single-pick lists — budget + timeline is the canonical case.",
  schema: quickEstimateQuestionSchema,
  Renderer: QuickEstimateRenderer,
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
      id: "budget-timeline",
      label: "Budget & timeline",
      description: "Set the twin constraints that frame everything else.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I'm trying to scope a project and I keep dodging the money and date questions. Force me to answer.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "quick-estimate",
            props: {
              question: "Budget & timeline constraints",
              subtitle: "Set both dimensions to frame the scope of work.",
              dimensions: [
                {
                  id: "budget",
                  label: "Budget range",
                  options: [
                    {
                      title: "< $5k",
                      subtitle: "Bootstrapped, MVP-only budget",
                    },
                    {
                      title: "$5–20k",
                      subtitle: "Enough for a focused build",
                    },
                    {
                      title: "$20–50k",
                      subtitle: "Room for polish and iteration",
                    },
                    { title: "$50k+", subtitle: "Fully resourced project" },
                  ],
                },
                {
                  id: "timeline",
                  label: "Timeline",
                  options: [
                    { title: "2 weeks", subtitle: "Sprint to a prototype" },
                    { title: "1 month", subtitle: "Enough for a solid v1" },
                    { title: "3 months", subtitle: "Full product cycle" },
                    { title: "6+ months", subtitle: "Long-term, phased delivery" },
                  ],
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
      id: "three-dimensions",
      label: "Add team size",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          dimensions: [
            ...node.props.dimensions,
            {
              id: "team",
              label: "Team size",
              options: [
                { title: "Solo", subtitle: "Just you" },
                { title: "2–3", subtitle: "Small team" },
                { title: "4–6", subtitle: "Cross-functional" },
                { title: "7+", subtitle: "Multiple squads" },
              ],
            },
          ],
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
          dimensions: node.props.dimensions.map((dimension) => ({
            ...dimension,
            options: dimension.options.map(({ title }) => ({ title })),
          })),
        },
      }),
    },
  ],
};
