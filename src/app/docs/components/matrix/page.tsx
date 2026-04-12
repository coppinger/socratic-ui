import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { MatrixDemo } from "./demo";

export const metadata = componentMetadata("matrix");

const demoSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/components/matrix/demo.tsx"),
  "utf-8",
);

const usageSource = `import { Matrix } from "@/components/socratic-ui/matrix";

const [value, setValue] = useState<Record<string, number>>({});

<Matrix
  question="Rate your team's capabilities"
  rows={[
    { id: "frontend", title: "Frontend" },
    { id: "backend", title: "Backend" },
  ]}
  levels={["None", "Basic", "Solid", "Expert"]}
  value={value}
  onChange={setValue}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The headline shown above the matrix.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "rows",
    type: "{ id: string; title: string; subtitle?: string }[]",
    required: true,
    description: "Each row is an independently-rated dimension.",
  },
  {
    name: "levels",
    type: "string[]",
    required: true,
    description:
      "Ordered level labels from low (index 0) to high. Picking a level fills it and every level below, like a progress bar.",
  },
  {
    name: "value",
    type: "Record<string, number>",
    required: true,
    description: "Map of row id to the selected 0-based level index.",
  },
  {
    name: "onChange",
    type: "(value: Record<string, number>) => void",
    required: true,
    description: "Called whenever a row's level changes.",
  },
];

export default async function MatrixPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Matrix"
      description="Row × level grid assessment. Good for capability audits, feature maturity, risk exposure — anything that needs rating across multiple domains on the same scale."
      preview={<MatrixDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="matrix"
    />
  );
}
