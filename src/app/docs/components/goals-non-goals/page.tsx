import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { GoalsNonGoalsDemo } from "./demo";

export const metadata = componentMetadata("goals-non-goals");

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/goals-non-goals/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { GoalsNonGoals } from "@/components/socratic-ui/goals-non-goals";

const [value, setValue] = useState([]);

<GoalsNonGoals
  question="Goals & non-goals"
  subtitle="For each goal, name a non-goal."
  value={value}
  onChange={setValue}
  maxPairs={5}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the pair list.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "value",
    type: "{ goal: string; nonGoal: string }[]",
    required: true,
    description:
      "Controlled list of pair rows. Includes partial / in-progress rows — use response parsing to drop incomplete pairs.",
  },
  {
    name: "onChange",
    type: "(value: { goal: string; nonGoal: string }[]) => void",
    required: true,
    description: "Called whenever the user types, adds, or removes a pair.",
  },
  {
    name: "goalPlaceholder",
    type: "string",
    description: "Placeholder for the goal input.",
  },
  {
    name: "nonGoalPlaceholder",
    type: "string",
    description: "Placeholder for the non-goal input.",
  },
  {
    name: "maxPairs",
    type: "number",
    description: "Upper bound on how many rows can be added (default 5).",
  },
];

export default async function GoalsNonGoalsPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Goals / Non-Goals"
      description="Paired list builder. For every goal, name a non-goal — the symmetry is the whole point. Classic framing tool for scoping a product spec."
      preview={<GoalsNonGoalsDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="goals-non-goals"
    />
  );
}
