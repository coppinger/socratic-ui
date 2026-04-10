"use client";

import { useState } from "react";

import { spatialCanvasQuestionSchema } from "@/components/socratic-ui/schemas";
import {
  SpatialCanvas,
  type SpatialCanvasPosition,
} from "@/components/socratic-ui/spatial-canvas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function SpatialCanvasRenderer({
  node,
  motion,
}: RendererProps<"spatial-canvas">) {
  // Reset state when the items change (edge-case swaps) so stale
  // positions from a different item set don't leak through.
  const itemKey = node.props.items.map((i) => i.id).join(",");
  const [value, setValue] = useState<Record<string, SpatialCanvasPosition>>({});

  return (
    <SpatialCanvas
      key={itemKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      items={node.props.items}
      xAxisLabel={node.props.xAxisLabel}
      yAxisLabel={node.props.yAxisLabel}
      xLowLabel={node.props.xLowLabel}
      xHighLabel={node.props.xHighLabel}
      yLowLabel={node.props.yLowLabel}
      yHighLabel={node.props.yHighLabel}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const spatialCanvasEntry: PlaygroundEntry<"spatial-canvas"> = {
  slug: "spatial-canvas",
  label: "Spatial Canvas",
  description:
    "Place items on a two-axis canvas — effort × impact, cost × value, whatever the trade-off is.",
  schema: spatialCanvasQuestionSchema,
  Renderer: SpatialCanvasRenderer,
  tweakers: [
    { kind: "string", path: "question", label: "Question", multiline: true },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
    { kind: "string", path: "xAxisLabel", label: "X axis label" },
    { kind: "string", path: "yAxisLabel", label: "Y axis label" },
  ],
  scenarios: [
    {
      id: "effort-impact",
      label: "Effort vs impact",
      description: "The canonical 2×2 for product prioritisation.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I have a handful of work streams and I need to figure out which ones are worth the squeeze.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "text",
          text: "Let's map them. Pick each item, then drop it on the grid where you think it lands.",
        },
        {
          id: "a2",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "spatial-canvas",
            props: {
              question: "Map these on effort vs impact",
              subtitle: "Tap an item below, then tap the canvas to place it.",
              xAxisLabel: "Effort",
              yAxisLabel: "Impact",
              xLowLabel: "low",
              xHighLabel: "high",
              yLowLabel: "low",
              yHighLabel: "high",
              items: [
                { id: "onboarding", title: "Onboarding flow" },
                { id: "docs", title: "API docs" },
                { id: "mobile", title: "Mobile app" },
                { id: "admin", title: "Admin panel" },
                { id: "integrations", title: "Integrations" },
              ],
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "two-items",
      label: "2 items",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          items: node.props.items.slice(0, 2),
        },
      }),
    },
    {
      id: "no-end-labels",
      label: "No end labels",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          xLowLabel: undefined,
          xHighLabel: undefined,
          yLowLabel: undefined,
          yHighLabel: undefined,
        },
      }),
    },
    {
      id: "cost-value",
      label: "Cost × value",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          xAxisLabel: "Cost",
          yAxisLabel: "Value",
        },
      }),
    },
  ],
};
