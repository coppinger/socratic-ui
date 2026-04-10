"use client";

import { useState } from "react";

import {
  MetricTarget,
  type MetricTargetValue,
} from "@/components/socratic-ui/metric-target";
import { metricTargetQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function MetricTargetRenderer({
  node,
  motion,
}: RendererProps<"metric-target">) {
  // Reset when the metric set changes (edge-case swaps).
  const metricKey = node.props.metrics.map((m) => m.id).join(",");
  const [value, setValue] = useState<MetricTargetValue>({
    metricId: null,
    target: null,
    timeframe: null,
  });

  return (
    <MetricTarget
      key={metricKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      metrics={node.props.metrics}
      timeframes={node.props.timeframes}
      targetPlaceholder={node.props.targetPlaceholder}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const metricTargetEntry: PlaygroundEntry<"metric-target"> = {
  slug: "metric-target",
  label: "Metric Target",
  description:
    "Pick a success metric, name a numeric target, pick a timeframe. The spec's \"what good looks like\" section in one gesture.",
  schema: metricTargetQuestionSchema,
  Renderer: MetricTargetRenderer,
  tweakers: [
    { kind: "string", path: "question", label: "Question", multiline: true },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
    {
      kind: "string",
      path: "targetPlaceholder",
      label: "Target placeholder",
      placeholder: "(default)",
    },
  ],
  scenarios: [
    {
      id: "launch-metrics",
      label: "Launch success metric",
      description: "Set the one number that defines whether launch worked.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "What's the one number we'll use to judge whether this launch worked? I keep hand-waving it.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "metric-target",
            props: {
              question: "Pick a success metric and target",
              subtitle: "The one number that tells you whether it worked.",
              metrics: [
                {
                  id: "activation",
                  label: "Activation rate",
                  subtitle: "Signups who complete the core action",
                  unit: "%",
                  direction: "increase",
                },
                {
                  id: "weekly",
                  label: "Weekly active users",
                  subtitle: "Distinct users in a 7-day window",
                  unit: "users",
                  direction: "increase",
                },
                {
                  id: "mrr",
                  label: "Monthly recurring revenue",
                  subtitle: "Predictable monthly income",
                  unit: "$/mo",
                  direction: "increase",
                },
                {
                  id: "churn",
                  label: "Churn",
                  subtitle: "% of customers lost per month",
                  unit: "%",
                  direction: "decrease",
                },
              ],
              timeframes: ["30 days", "90 days", "6 months", "1 year"],
              targetPlaceholder: "Target",
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "no-unit",
      label: "No units",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          metrics: node.props.metrics.map((metric) => ({
            id: metric.id,
            label: metric.label,
            subtitle: metric.subtitle,
            direction: metric.direction,
          })),
        },
      }),
    },
    {
      id: "no-direction",
      label: "No direction arrows",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          metrics: node.props.metrics.map((metric) => ({
            id: metric.id,
            label: metric.label,
            subtitle: metric.subtitle,
            unit: metric.unit,
          })),
        },
      }),
    },
    {
      id: "single-timeframe",
      label: "One timeframe",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          timeframes: ["90 days"],
        },
      }),
    },
  ],
};
