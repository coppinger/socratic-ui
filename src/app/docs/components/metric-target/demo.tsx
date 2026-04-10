"use client";

import { useState } from "react";

import {
  MetricTarget,
  type MetricTargetValue,
} from "@/components/socratic-ui/metric-target";

export function MetricTargetDemo() {
  const [value, setValue] = useState<MetricTargetValue>({
    metricId: null,
    target: null,
    timeframe: null,
  });

  return (
    <MetricTarget
      number="13"
      question="Pick a success metric and target"
      subtitle="The one number that tells you whether it worked."
      metrics={[
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
      ]}
      timeframes={["30 days", "90 days", "6 months", "1 year"]}
      value={value}
      onChange={setValue}
    />
  );
}
