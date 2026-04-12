import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { FillBlankDemo } from "./demo";

export const metadata = componentMetadata("fill-blank");

const demoSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/components/fill-blank/demo.tsx"),
  "utf-8",
);

const usageSource = `import { FillBlank } from "@/components/socratic-ui/fill-blank";

<FillBlank
  question="Describe it in one sentence"
  template="I want to build a {what} for {who} that helps them {outcome}."
  slots={[
    { id: "what", placeholder: "product type" },
    { id: "who", placeholder: "audience" },
    { id: "outcome", placeholder: "outcome" },
  ]}
  value={pitch}
  onChange={setPitch}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the template.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "template",
    type: "string",
    required: true,
    description: "Sentence template with {slot-id} markers for each blank.",
  },
  {
    name: "slots",
    type: "{ id: string; placeholder: string }[]",
    required: true,
    description: "Slot definitions. Each id must match a {slot-id} in the template.",
  },
  {
    name: "value",
    type: "Record<string, string>",
    required: true,
    description: "Slot id → filled text map.",
  },
  {
    name: "onChange",
    type: "(value: Record<string, string>) => void",
    required: true,
    description: "Called whenever a slot is edited.",
  },
  {
    name: "completeMessage",
    type: "string",
    defaultValue: "\"Clear and scoped — that's a strong starting point.\"",
    description: "Success summary shown when every slot is filled.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number.",
  },
];

export default async function FillBlankPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Fill Blank"
      description="A mad-libs style template with inline editable slots. The constraint of filling slots produces tighter answers than a freeform textarea."
      preview={<FillBlankDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="fill-blank"
    />
  );
}
