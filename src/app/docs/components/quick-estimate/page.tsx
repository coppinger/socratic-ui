import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { highlight } from "@/lib/highlight";

import { QuickEstimateDemo } from "./demo";

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/quick-estimate/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { QuickEstimate } from "@/components/socratic-ui/quick-estimate";

const [value, setValue] = useState<Record<string, string | null>>({});

<QuickEstimate
  question="Budget & timeline constraints"
  dimensions={[
    {
      id: "budget",
      label: "Budget range",
      options: [
        { title: "< $5k" },
        { title: "$5–20k" },
      ],
    },
    {
      id: "timeline",
      label: "Timeline",
      options: [
        { title: "2 weeks" },
        { title: "1 month" },
      ],
    },
  ]}
  value={value}
  onChange={setValue}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The overall headline above the stacked dimensions.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "dimensions",
    type: "{ id: string; label: string; options: { title: string; subtitle?: string }[] }[]",
    required: true,
    description:
      "Two or three independent single-select lists. Each dimension has its own label and options.",
  },
  {
    name: "value",
    type: "Record<string, string | null>",
    required: true,
    description:
      "Map of dimension id to the title of the selected option (or null if unset).",
  },
  {
    name: "onChange",
    type: "(value: Record<string, string | null>) => void",
    required: true,
    description: "Called whenever a selection changes in any dimension.",
  },
];

export default async function QuickEstimatePage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Quick Estimate"
      description="Two or three related single-select dimensions stacked vertically. Purpose-built for constraints that only make sense in pairs — budget + timeline is the canonical case."
      preview={<QuickEstimateDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="quick-estimate"
    />
  );
}
