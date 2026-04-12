import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { SpectrumDemo } from "./demo";

export const metadata = componentMetadata("spectrum");

const demoSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/components/spectrum/demo.tsx"),
  "utf-8",
);

const usageSource = `import { Spectrum } from "@/components/socratic-ui/spectrum";

<Spectrum
  question="What's your building philosophy?"
  leftLabel="Move fast"
  leftDescription="Ship now, fix later"
  rightLabel="Methodical"
  rightDescription="Measure twice, cut once"
  value={value}
  onChange={setValue}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the slider.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "leftLabel",
    type: "string",
    required: true,
    description: "Label for the low end of the slider.",
  },
  {
    name: "leftDescription",
    type: "string",
    description: "Optional one-liner describing the left pole.",
  },
  {
    name: "rightLabel",
    type: "string",
    required: true,
    description: "Label for the high end of the slider.",
  },
  {
    name: "rightDescription",
    type: "string",
    description: "Optional one-liner describing the right pole.",
  },
  {
    name: "min",
    type: "number",
    defaultValue: "0",
    description: "Minimum slider value.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "100",
    description: "Maximum slider value.",
  },
  {
    name: "step",
    type: "number",
    defaultValue: "1",
    description: "Step increment between slider stops.",
  },
  {
    name: "value",
    type: "number",
    required: true,
    description: "Current slider value.",
  },
  {
    name: "onChange",
    type: "(value: number) => void",
    required: true,
    description: "Called as the slider moves.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number.",
  },
];

export default async function SpectrumPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Spectrum"
      description="A slider between two labeled poles. Surfaces shades of grey that a radio group collapses — neither ‘A nor B’ but ‘slightly toward A’. Pole tiles light up as the slider crosses the midpoint."
      preview={<SpectrumDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="spectrum"
    />
  );
}
