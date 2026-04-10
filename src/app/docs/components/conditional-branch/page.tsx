import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { highlight } from "@/lib/highlight";

import { ConditionalBranchDemo } from "./demo";

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/conditional-branch/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import { ConditionalBranch } from "@/components/socratic-ui/conditional-branch";

const [value, setValue] = useState({ selectedId: null, followUpValue: null });

<ConditionalBranch
  question="Do you have existing users?"
  options={[
    {
      id: "yes",
      title: "Yes",
      followUp: {
        kind: "single-select",
        question: "Roughly how many active users?",
        options: [{ title: "< 100" }, { title: "100–1k" }],
      },
    },
    {
      id: "no",
      title: "No",
      followUp: {
        kind: "text",
        question: "Who's your initial target audience?",
      },
    },
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
    description: "The headline shown above the branch options.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the question.",
  },
  {
    name: "options",
    type: "{ id: string; title: string; subtitle?: string; followUp?: FollowUp }[]",
    required: true,
    description:
      "2–4 primary branch options. Each can carry an optional follow-up (`single-select` or `text`) that appears beneath the picked branch.",
  },
  {
    name: "value",
    type: "{ selectedId: string | null; followUpValue: string | null }",
    required: true,
    description:
      "The primary selection and its associated follow-up answer. Switching branches clears the follow-up.",
  },
  {
    name: "onChange",
    type: "(value: { selectedId: string | null; followUpValue: string | null }) => void",
    required: true,
    description: "Called whenever the branch or follow-up answer changes.",
  },
];

export default async function ConditionalBranchPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Conditional Branch"
      description="Binary or four-way choice that reveals a tailored follow-up per path. Lets the assistant fork an interview on the first answer instead of asking everything of everyone."
      preview={<ConditionalBranchDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="conditional-branch"
    />
  );
}
