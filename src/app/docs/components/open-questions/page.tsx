import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { OpenQuestionsDemo } from "./demo";

export const metadata = componentMetadata("open-questions");

const demoSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/components/open-questions/demo.tsx"),
  "utf-8",
);

const usageSource = `import { OpenQuestions } from "@/components/socratic-ui/open-questions";

<OpenQuestions
  question="Help me understand what you're hitting"
  prompts={[
    { id: "goal", text: "What are you trying to make happen?" },
    { id: "tried", text: "What have you tried so far?" },
    { id: "stuck", text: "Where exactly does it break?" },
  ]}
  value={answers}
  onChange={setAnswers}
/>
`;

const props: PropDef[] = [
  {
    name: "question",
    type: "string",
    required: true,
    description:
      "Overall heading for the set of prompts, shown above the stack.",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Optional supporting copy beneath the heading.",
  },
  {
    name: "prompts",
    type: "{ id: string; text: string; placeholder?: string }[]",
    required: true,
    description:
      "Prompts to ask. Each id becomes a key in the value/onChange map.",
  },
  {
    name: "value",
    type: "Record<string, string>",
    required: true,
    description: "Prompt id → user-entered text.",
  },
  {
    name: "onChange",
    type: "(value: Record<string, string>) => void",
    required: true,
    description: "Called whenever any prompt's textarea is edited.",
  },
  {
    name: "completeMessage",
    type: "string",
    defaultValue: "\"Thanks — that gives me what I need to dig in.\"",
    description: "Success summary shown when every prompt is answered.",
  },
  {
    name: "number",
    type: "string",
    description: "Optional leading question number (e.g. \"05\").",
  },
  {
    name: "motion",
    type: "SocraticMotion",
    description: "Shared motion config threaded through entrance animations.",
  },
];

export default async function OpenQuestionsPage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Open Questions"
      description="A stack of open-ended prompts, each with its own auto-growing textarea. Use when the AI needs every blank filled in one shot — not a sequence and not a single freeform field."
      preview={<OpenQuestionsDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
      playgroundSlug="open-questions"
    />
  );
}
