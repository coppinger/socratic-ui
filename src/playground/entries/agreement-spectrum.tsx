"use client";

import { useState } from "react";

import { AgreementSpectrum } from "@/components/socratic-ui/agreement-spectrum";
import { agreementSpectrumQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function AgreementSpectrumRenderer({
  node,
  motion,
}: RendererProps<"agreement-spectrum">) {
  // Reset local state when statement ids change (edge-case swaps).
  const statementKey = node.props.statements.map((s) => s.id).join(",");
  const [value, setValue] = useState<Record<string, number>>({});
  return (
    <AgreementSpectrum
      key={statementKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      statements={node.props.statements}
      scaleLabels={node.props.scaleLabels}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const agreementSpectrumEntry: PlaygroundEntry<"agreement-spectrum"> = {
  slug: "agreement-spectrum",
  label: "Agreement Spectrum",
  description:
    "Likert-rate a batch of statements — optionally compared to how others answered.",
  schema: agreementSpectrumQuestionSchema,
  Renderer: AgreementSpectrumRenderer,
  // Statement ids and crowd figures are structural; they're swapped via
  // edge cases rather than free-text tweakers.
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
      id: "builder-beliefs",
      label: "Builder beliefs",
      description: "Rate the spicy takes floating around the studio.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "Half the team is arguing about launch philosophy and I want to see where we actually disagree.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Rate these and we'll see which takes split the room.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "agreement-spectrum",
            props: {
              question: "Where do you stand?",
              subtitle: "Rate each statement — see how others responded.",
              statements: [
                {
                  id: "public",
                  text: "We should build in public from day one",
                  crowd: 72,
                },
                {
                  id: "ui",
                  text: "A beautiful UI is table stakes",
                  crowd: 85,
                },
                {
                  id: "analytics",
                  text: "Launching without analytics is fine",
                  crowd: 31,
                },
                {
                  id: "paid",
                  text: "We need a paid plan at launch",
                  crowd: 44,
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
      id: "no-crowd",
      label: "No crowd data",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          statements: node.props.statements.map(({ id, text }) => ({
            id,
            text,
          })),
        },
      }),
    },
    {
      id: "single-statement",
      label: "Single statement",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          statements: node.props.statements.slice(0, 1),
        },
      }),
    },
    {
      id: "long-statements",
      label: "Long statements",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          statements: node.props.statements.map((s) => ({
            ...s,
            text: `${s.text} — even when it slows us down or forces uncomfortable conversations with the rest of the team`,
          })),
        },
      }),
    },
    {
      id: "many-statements",
      label: "6 statements",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          statements: [
            { id: "public", text: "We should build in public from day one", crowd: 72 },
            { id: "ui", text: "A beautiful UI is table stakes", crowd: 85 },
            { id: "analytics", text: "Launching without analytics is fine", crowd: 31 },
            { id: "paid", text: "We need a paid plan at launch", crowd: 44 },
            { id: "oss", text: "Open sourcing the core helps more than it hurts", crowd: 58 },
            { id: "mobile", text: "Mobile can wait until post-launch", crowd: 66 },
          ],
        },
      }),
    },
  ],
};
