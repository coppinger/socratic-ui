import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { highlight } from "@/lib/highlight";

import { UserStoryBuilderDemo } from "./demo";

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/user-story-builder/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { UserStoryBuilder } from "@/components/socratic-ui/user-story-builder";

const [value, setValue] = useState([]);

<UserStoryBuilder
  question="Write out a few user stories"
  personas={["new user", "admin"]}
  actions={["sign up quickly", "invite my team"]}
  outcomes={["I can start in under a minute"]}
  value={value}
  onChange={setValue}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description: "The overall headline shown above the story cards.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "value",
    type: "{ persona: string; action: string; outcome: string }[]",
    required: true,
    description:
      "Controlled list of stories. Includes partial / in-progress stories; use response parsing to drop incomplete ones.",
  },
  {
    name: "onChange",
    type: "(value: { persona: string; action: string; outcome: string }[]) => void",
    required: true,
    description: "Called whenever a slot changes or a story is added / removed.",
  },
  {
    name: "personas",
    type: "string[]",
    description: "Suggestion chips for the \"As a ___\" slot.",
  },
  {
    name: "actions",
    type: "string[]",
    description: "Suggestion chips for the \"I want to ___\" slot.",
  },
  {
    name: "outcomes",
    type: "string[]",
    description: "Suggestion chips for the \"so that ___\" slot.",
  },
  {
    name: "maxStories",
    type: "number",
    description: "Upper bound on how many stories can be added (default 5).",
  },
];

export default async function UserStoryBuilderPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="User Story Builder"
      description={`Repeatable "As a ___, I want ___, so that ___" composer with per-slot chip suggestions. Canonical for product specs — every story is an explicit user + outcome pair, not a feature blurb.`}
      preview={<UserStoryBuilderDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="user-story-builder"
    />
  );
}
