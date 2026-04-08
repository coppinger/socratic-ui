import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { highlight } from "@/lib/highlight";

import { NegationSelectDemo } from "./demo";

const demoSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/components/negation-select/demo.tsx"),
  "utf-8",
);

const usageSource = `import { NegationSelect } from "@/components/socratic-ui/negation-select";

<NegationSelect
  question="What do you definitely NOT need?"
  options={[
    { title: "Complex onboarding" },
    { title: "Social features" },
  ]}
  value={eliminated}
  onChange={setEliminated}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the options.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "options",
    type: "{ title: string; subtitle?: string }[]",
    required: true,
    description: "The list of options the user can eliminate.",
  },
  {
    name: "value",
    type: "string[]",
    required: true,
    description: "Titles of the options the user has eliminated.",
  },
  {
    name: "onChange",
    type: "(value: string[]) => void",
    required: true,
    description: "Called when eliminations change. Tap a crossed-out item to restore it.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number.",
  },
];

export default async function NegationSelectPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Negation Select"
      description="Strike-through elimination. Pick what you definitely don't want — often easier than choosing what you do. Remaining scope is counted as you eliminate."
      preview={<NegationSelectDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
    />
  );
}
