import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import { commonProps, iconLayoutProps } from "@/components/docs/common-props";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { SingleSelectDemo } from "./demo";

export const metadata = componentMetadata("single-select");

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/single-select/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { SingleSelect } from "@/components/socratic-ui/single-select";

const [value, setValue] = useState<string | null>(null);

<SingleSelect
  question="How are you building this product?"
  options={[
    { title: "Solo founder" },
    { title: "Co-founding team" },
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
    name: "value",
    type: "string | string[] | null",
    required: true,
    description:
      "Title of the selected option (single mode), array of titles (multi mode when `allowMultiple` is set), or null.",
  },
  {
    name: "onChange",
    type: "(value: string | string[] | null) => void",
    required: true,
    description: "Called when the selection changes. Tapping a selected option in single mode clears it.",
  },
  {
    name: "allowMultiple",
    type: "boolean",
    description:
      "When true, the component upgrades to multi-select on the second pick. `value` becomes `string[]` and the optional `multiValue` / `onMultiChange` props control the array.",
  },
  {
    name: "suggested",
    type: "number",
    description:
      "Soft-cap hint shown in the footer (\"N suggested\"). Exceeding it tints the count but does not block further selections.",
  },
  {
    name: "max",
    type: "number",
    description:
      "Hard cap on selections in multi-mode. Unselected options dim once the cap is reached.",
  },
  {
    name: "freeformPlaceholder",
    type: "string | false",
    description:
      "Renders an extra textarea beneath the options. Defaults to \"Any extra context…\"; pass `false` to hide.",
  },
  {
    name: "freeformValue",
    type: "string",
    description: "Controlled value for the freeform textarea.",
  },
  {
    name: "onFreeformChange",
    type: "(value: string) => void",
    description: "Controlled setter for the freeform textarea.",
  },
  ...iconLayoutProps,
  ...commonProps,
];

export default async function SingleSelectPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Single Select"
      description="Pick one option from a list. Supports an optional freeform note for extra context, and tapping a selected option clears it."
      preview={<SingleSelectDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="single-select"
    />
  );
}
