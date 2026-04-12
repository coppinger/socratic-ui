import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { MetricTargetDemo } from "./demo";

export const metadata = componentMetadata("metric-target");

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/metric-target/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { MetricTarget } from "@/components/socratic-ui/metric-target";

const [value, setValue] = useState({
  metricId: null,
  target: null,
  timeframe: null,
});

<MetricTarget
  question="Pick a success metric and target"
  metrics={[
    { id: "activation", label: "Activation rate", unit: "%", direction: "increase" },
    { id: "churn", label: "Churn", unit: "%", direction: "decrease" },
  ]}
  timeframes={["30 days", "90 days", "6 months"]}
  value={value}
  onChange={setValue}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the metric list.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "metrics",
    type: "{ id: string; label: string; subtitle?: string; unit?: string; direction?: 'increase' | 'decrease' }[]",
    required: true,
    description:
      "The selectable success metrics. `unit` shows next to the target input; `direction` drives the trend arrow.",
  },
  {
    name: "timeframes",
    type: "string[]",
    description:
      "Selectable timeframe chips. Defaults to a quarterly-ish set if omitted.",
  },
  {
    name: "value",
    type: "{ metricId: string | null; target: number | null; timeframe: string | null }",
    required: true,
    description: "The currently picked metric, target number, and timeframe.",
  },
  {
    name: "onChange",
    type: "(value: { metricId: string | null; target: number | null; timeframe: string | null }) => void",
    required: true,
    description: "Called whenever any of the three fields changes.",
  },
];

export default async function MetricTargetPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Metric Target"
      description={`Pick a success metric, name a numeric target, pick a timeframe. The spec's "what good looks like" section in one gesture — the only component that combines a categorical pick with a numeric target.`}
      preview={<MetricTargetDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="metric-target"
    />
  );
}
