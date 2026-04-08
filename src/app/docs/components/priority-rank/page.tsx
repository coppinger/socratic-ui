import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { highlight } from "@/lib/highlight";

import { PriorityRankDemo } from "./demo";

const demoSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/components/priority-rank/demo.tsx"),
  "utf-8",
);

const usageSource = `import { PriorityRank } from "@/components/socratic-ui/priority-rank";

<PriorityRank
  question="Rank what to tackle first"
  items={[
    { title: "User research" },
    { title: "Technical architecture" },
  ]}
  value={ranking}
  onChange={setRanking}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the items.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "items",
    type: "{ title: string; subtitle?: string }[]",
    required: true,
    description: "The list of rankable items.",
  },
  {
    name: "value",
    type: "string[]",
    required: true,
    description: "Ordered list of titles, highest priority first.",
  },
  {
    name: "onChange",
    type: "(value: string[]) => void",
    required: true,
    description: "Called when the ranking changes. Tapping a ranked item removes it.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number.",
  },
];

export default async function PriorityRankPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Priority Rank"
      description="Tap items in priority order. Ranked items get numbered indicators; unranked items stay dashed. Tap a ranked item to remove it from the ordering."
      preview={<PriorityRankDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
    />
  );
}
