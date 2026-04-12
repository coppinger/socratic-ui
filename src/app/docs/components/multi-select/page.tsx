import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { MultiSelectDemo } from "./demo";

export const metadata = componentMetadata("multi-select");

const demoSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/components/multi-select/demo.tsx"),
  "utf-8",
);

const usageSource = `import { MultiSelect } from "@/components/socratic-ui/multi-select";

<MultiSelect
  question="What matters most right now?"
  max={3}
  options={[
    { title: "Speed to market" },
    { title: "Polish & quality" },
  ]}
  value={priorities}
  onChange={setPriorities}
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
    description: "The list of selectable options.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "3",
    description: "Maximum selectable options. Unselected cards dim once the cap is hit.",
  },
  {
    name: "value",
    type: "string[]",
    required: true,
    description: "Titles of the currently selected options.",
  },
  {
    name: "onChange",
    type: "(value: string[]) => void",
    required: true,
    description: "Called when the selection changes.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number.",
  },
];

export default async function MultiSelectPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Multi Select"
      description="Pick up to N options. A capped counter shows remaining capacity; unselected cards dim at the limit so users know why they can't pick more."
      preview={<MultiSelectDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="multi-select"
    />
  );
}
