import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { CardSortDemo } from "./demo";

export const metadata = componentMetadata("card-sort");

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/card-sort/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { CardSort } from "@/components/socratic-ui/card-sort";

const [value, setValue] = useState<Record<string, string[]>>({});

<CardSort
  question="Sort these features for v1"
  buckets={[
    { id: "must", title: "Must have", tone: "affirm" },
    { id: "nice", title: "Nice to have" },
    { id: "not", title: "Not needed", tone: "muted" },
  ]}
  items={[
    { title: "Auth system" },
    { title: "Analytics" },
    { title: "Dark mode" },
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
    description: "The headline shown above the bucket row.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "buckets",
    type: "{ id: string; title: string; subtitle?: string; tone?: 'affirm' | 'neutral' | 'muted' }[]",
    required: true,
    description:
      "The sorting categories. `tone` drives the bucket colour — `affirm` for must-have, `muted` for out-of-scope, `neutral` otherwise.",
  },
  {
    name: "items",
    type: "{ title: string; subtitle?: string }[]",
    required: true,
    description: "The list of items users sort into buckets.",
  },
  {
    name: "value",
    type: "Record<string, string[]>",
    required: true,
    description:
      "Map of bucket id to the titles of items placed in that bucket.",
  },
  {
    name: "onChange",
    type: "(value: Record<string, string[]>) => void",
    required: true,
    description: "Called whenever the user places or removes an item.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number, e.g. \"06\".",
  },
];

export default async function CardSortPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Card Sort"
      description="Multi-bucket triage. Pick a bucket to make it active, then tap items to drop them into it. Classic MoSCoW sorting for product-spec scoping."
      preview={<CardSortDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="card-sort"
    />
  );
}
