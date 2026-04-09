import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { highlight } from "@/lib/highlight";

import { QuestionSequenceDemo } from "./demo";

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/question-sequence/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import {
  QuestionSequence,
} from "@/components/socratic-ui/question-sequence";
import {
  MULTI_SELECT_HINTS,
  SINGLE_SELECT_HINTS,
} from "@/components/socratic-ui/shared";
import { SingleSelect } from "@/components/socratic-ui/single-select";
import { MultiSelect } from "@/components/socratic-ui/multi-select";

<QuestionSequence onComplete={(answers) => console.log(answers)}>
  <QuestionSequence.Item id="vibe" hints={SINGLE_SELECT_HINTS}>
    {({ value, onChange }) => (
      <SingleSelect
        question="What's your vibe right now?"
        options={[{ title: "Building mode" }, { title: "Planning mode" }]}
        value={value as string | null ?? null}
        onChange={(next) => onChange(next)}
      />
    )}
  </QuestionSequence.Item>
  <QuestionSequence.Item id="tools" hints={MULTI_SELECT_HINTS}>
    {({ value, onChange }) => (
      <MultiSelect
        question="Which of these are you actively using?"
        options={[{ title: "Claude Code" }, { title: "Todoist" }]}
        value={(value as string[] | undefined) ?? []}
        onChange={(next) => onChange(next)}
      />
    )}
  </QuestionSequence.Item>
</QuestionSequence>
`;

const props: PropDef[] = [
  {
    name: "children",
    type: "<QuestionSequence.Item>…</QuestionSequence.Item>",
    required: true,
    description:
      "One or more `QuestionSequence.Item` children. Each accepts an `id` prop and a render-prop child that receives `{ value, onChange }` bound to the sequence's answers map.",
  },
  {
    name: "defaultAnswers",
    type: "Record<string, unknown>",
    description:
      "Uncontrolled initial answers map, keyed by question id.",
  },
  {
    name: "answers",
    type: "Record<string, unknown>",
    description:
      "Controlled answers map. Overrides `defaultAnswers` when provided.",
  },
  {
    name: "onChange",
    type: "(id: string, value: unknown) => void",
    description: "Fires whenever a question's answer changes.",
  },
  {
    name: "onComplete",
    type: "(answers: Record<string, unknown>) => void",
    description:
      "Fires when the user submits from the terminal question (⌘Enter or the primary button).",
  },
  {
    name: "onClose",
    type: "() => void",
    description:
      "Fires when the user closes the sequence via the × button or by pressing Esc on the terminal question.",
  },
  {
    name: "motion",
    type: "SocraticMotion",
    description:
      "Shared motion config threaded through the rendered question's entrance animation.",
  },
];

export default async function QuestionSequencePage() {
  const [highlightedCode, highlightedUsage] = await Promise.all([
    highlight(demoSource),
    highlight(usageSource),
  ]);

  return (
    <ComponentPage
      title="Question Sequence"
      description="Chain multiple Socratic components into a single flow. Asks one question at a time with pagination, skip/next actions, keyboard navigation, and edit-mode back-nav that restores prior answers."
      preview={<QuestionSequenceDemo />}
      highlightedCode={highlightedCode}
      rawCode={demoSource}
      highlightedUsage={highlightedUsage}
      rawUsage={usageSource}
      props={props}
    />
  );
}
