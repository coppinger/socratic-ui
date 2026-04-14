import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import { commonProps } from "@/components/docs/common-props";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { AgreementSpectrumDemo } from "./demo";

export const metadata = componentMetadata("agreement-spectrum");

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/agreement-spectrum/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { AgreementSpectrum } from "@/components/socratic-ui/agreement-spectrum";

<AgreementSpectrum
  question="Where do you stand?"
  statements={[
    { id: "public", text: "We should build in public from day one", crowd: 72 },
    { id: "ui", text: "A beautiful UI is table stakes", crowd: 85 },
  ]}
  value={ratings}
  onChange={setRatings}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the statement rows.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "statements",
    type: "{ id: string; text: string; crowd?: number }[]",
    required: true,
    description:
      "The statements to rate. `id` keys the response map; `crowd` is an optional ‘% of others who agree’ figure shown once rated.",
  },
  {
    name: "scaleLabels",
    type: "string[]",
    defaultValue: "Strongly disagree → Strongly agree",
    description:
      "Five labels for the Likert scale. Only the last word of each label is rendered on the button.",
  },
  {
    name: "value",
    type: "Record<string, number>",
    required: true,
    description: "Map of statement id → 0–4 scale index.",
  },
  {
    name: "onChange",
    type: "(value: Record<string, number>) => void",
    required: true,
    description: "Called when any statement's rating changes.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number.",
  },
  ...commonProps,
];

export default async function AgreementSpectrumPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Agreement Spectrum"
      description="Likert-rate a batch of statements on a 5-point agree/disagree scale. Optionally surface a ‘% of similar people agree’ comparison once each statement is rated — useful for provoking reflection, not just collecting data."
      preview={<AgreementSpectrumDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="agreement-spectrum"
    />
  );
}
