import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import { commonProps, numberProp } from "@/components/docs/common-props";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { SpatialCanvasDemo } from "./demo";

export const metadata = componentMetadata("spatial-canvas");

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/spatial-canvas/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { SpatialCanvas } from "@/components/socratic-ui/spatial-canvas";

const [value, setValue] = useState<Record<string, { x: number; y: number }>>({});

<SpatialCanvas
  question="Map these on effort vs impact"
  xAxisLabel="Effort"
  yAxisLabel="Impact"
  items={[
    { id: "a", title: "Onboarding flow" },
    { id: "b", title: "API docs" },
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
    description: "The headline shown above the canvas.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "items",
    type: "{ id: string; title: string; subtitle?: string }[]",
    required: true,
    description: "Items the user can pick up and place on the canvas.",
  },
  {
    name: "xAxisLabel",
    type: "string",
    required: true,
    description: "Horizontal axis name (e.g. \"Effort\").",
  },
  {
    name: "yAxisLabel",
    type: "string",
    required: true,
    description: "Vertical axis name (e.g. \"Impact\").",
  },
  {
    name: "xLowLabel",
    type: "string",
    description: "Optional low-end label for the X axis.",
  },
  {
    name: "xHighLabel",
    type: "string",
    description: "Optional high-end label for the X axis.",
  },
  {
    name: "yLowLabel",
    type: "string",
    description: "Optional low-end label for the Y axis.",
  },
  {
    name: "yHighLabel",
    type: "string",
    description: "Optional high-end label for the Y axis.",
  },
  {
    name: "value",
    type: "Record<string, { x: number; y: number }>",
    required: true,
    description:
      "Map of item id to normalized position. Both axes run 0 (low) to 1 (high); unplaced items are absent from the map.",
  },
  {
    name: "onChange",
    type: "(value: Record<string, { x: number; y: number }>) => void",
    required: true,
    description: "Called whenever a position is placed, moved, or removed.",
  },
  numberProp,
  ...commonProps,
];

export default async function SpatialCanvasPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Spatial Canvas"
      description="Place items on a two-axis canvas. Position encodes two dimensions at once — effort × impact, cost × value, risk × reward."
      preview={<SpatialCanvasDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="spatial-canvas"
    />
  );
}
