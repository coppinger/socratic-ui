"use client";

import { useState } from "react";

import { spectrumQuestionSchema } from "@/components/socratic-ui/schemas";
import {
  Spectrum,
  spectrumInitialValue,
} from "@/components/socratic-ui/spectrum";

import type { PlaygroundEntry, RendererProps } from "../registry";

function SpectrumRenderer({ node, motion }: RendererProps<"spectrum">) {
  const min = node.props.min ?? 0;
  const max = node.props.max ?? 100;
  const [rawValue, setRawValue] = useState<number>(() =>
    spectrumInitialValue(node.props),
  );

  // Clamp during render so tweakers can shift min/max out from under us
  // without stranding the slider out of range. Storing the raw value
  // means expanding the range later restores the user's pick.
  const value = Math.min(max, Math.max(min, rawValue));

  return (
    <Spectrum
      question={node.props.question}
      subtitle={node.props.subtitle}
      leftLabel={node.props.leftLabel}
      leftDescription={node.props.leftDescription}
      rightLabel={node.props.rightLabel}
      rightDescription={node.props.rightDescription}
      min={min}
      max={max}
      step={node.props.step ?? 1}
      value={value}
      onChange={setRawValue}
      motion={motion}
    />
  );
}

export const spectrumEntry: PlaygroundEntry<"spectrum"> = {
  slug: "spectrum",
  label: "Spectrum",
  description:
    "Slider between two poles — surfaces shades of grey that radio buttons miss.",
  schema: spectrumQuestionSchema,
  Renderer: SpectrumRenderer,
  tweakers: [
    { kind: "string", path: "question", label: "Question", multiline: true },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
    { kind: "string", path: "leftLabel", label: "Left label" },
    {
      kind: "string",
      path: "leftDescription",
      label: "Left description",
      placeholder: "(none)",
    },
    { kind: "string", path: "rightLabel", label: "Right label" },
    {
      kind: "string",
      path: "rightDescription",
      label: "Right description",
      placeholder: "(none)",
    },
    { kind: "number", path: "min", label: "Min", min: 0, max: 1000, step: 1 },
    { kind: "number", path: "max", label: "Max", min: 1, max: 1000, step: 1 },
    {
      kind: "number",
      path: "step",
      label: "Step",
      min: 1,
      max: 100,
      step: 1,
    },
  ],
  scenarios: [
    {
      id: "building-philosophy",
      label: "Building philosophy",
      description: "Where on the move-fast ↔ methodical axis does a team sit?",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "We're restructuring how the team works and I can't tell if we're overcorrecting toward process.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Let's put it on a line. Where do you want the team to sit?",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "spectrum",
            props: {
              question: "What's your building philosophy?",
              subtitle: "Drag the slider to where you sit on the spectrum.",
              leftLabel: "Move fast",
              leftDescription: "Ship now, fix later",
              rightLabel: "Methodical",
              rightDescription: "Measure twice, cut once",
              min: 0,
              max: 100,
              step: 1,
              defaultValue: 50,
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "left-extreme",
      label: "Start at left",
      apply: (node) => ({
        ...node,
        props: { ...node.props, defaultValue: node.props.min ?? 0 },
      }),
    },
    {
      id: "right-extreme",
      label: "Start at right",
      apply: (node) => ({
        ...node,
        props: { ...node.props, defaultValue: node.props.max ?? 100 },
      }),
    },
    {
      id: "no-descriptions",
      label: "No descriptions",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          leftDescription: undefined,
          rightDescription: undefined,
        },
      }),
    },
    {
      id: "long-labels",
      label: "Long labels",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          leftLabel: "Ship it today, iterate in prod",
          leftDescription: "Feedback from real users beats theorizing.",
          rightLabel: "Ship it when it's ready",
          rightDescription: "A broken first impression is expensive.",
        },
      }),
    },
    {
      id: "coarse-step",
      label: "Coarse step (5)",
      apply: (node) => ({
        ...node,
        props: { ...node.props, step: 5 },
      }),
    },
  ],
};
