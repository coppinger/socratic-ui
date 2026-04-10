"use client";

import { useState } from "react";

import { Matrix } from "@/components/socratic-ui/matrix";
import { matrixQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function MatrixRenderer({ node, motion }: RendererProps<"matrix">) {
  // Reset on row-set changes.
  const rowKey = node.props.rows.map((r) => r.id).join(",");
  const [value, setValue] = useState<Record<string, number>>({});

  return (
    <Matrix
      key={rowKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      rows={node.props.rows}
      levels={node.props.levels}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const matrixEntry: PlaygroundEntry<"matrix"> = {
  slug: "matrix",
  label: "Matrix",
  description:
    "Row × level grid assessment. Team capabilities, feature maturity, risk exposure — anything that needs rating across domains.",
  schema: matrixQuestionSchema,
  Renderer: MatrixRenderer,
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
      id: "team-capabilities",
      label: "Team capabilities",
      description: "Rate your strengths across product domains.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "Before we figure out what to outsource I want to know where our gaps are.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "matrix",
            props: {
              question: "Rate your team's capabilities",
              subtitle: "Tap each cell to assess skill level across domains.",
              rows: [
                {
                  id: "frontend",
                  title: "Frontend",
                  subtitle: "UI, components, styling",
                },
                {
                  id: "backend",
                  title: "Backend",
                  subtitle: "APIs, databases, auth",
                },
                {
                  id: "design",
                  title: "Design",
                  subtitle: "UX, brand, visual polish",
                },
                {
                  id: "devops",
                  title: "DevOps",
                  subtitle: "CI/CD, infra, monitoring",
                },
              ],
              levels: ["None", "Basic", "Solid", "Expert"],
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "many-rows",
      label: "8 rows",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          rows: Array.from({ length: 8 }, (_, i) => ({
            id: `row-${i}`,
            title: `Domain ${i + 1}`,
            subtitle: `Capability assessment for domain ${i + 1}`,
          })),
        },
      }),
    },
    {
      id: "five-levels",
      label: "5 levels",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          levels: ["Unknown", "Beginner", "Capable", "Strong", "Expert"],
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
          rows: node.props.rows.map(({ id, title }) => ({ id, title })),
        },
      }),
    },
  ],
};
