import fs from "node:fs";
import path from "node:path";

import { ComponentPage } from "@/components/docs/component-page";
import type { PropDef } from "@/components/docs/props-table";
import { componentMetadata } from "@/lib/component-metadata";
import { highlight } from "@/lib/highlight";

import { QuestionSequenceDemo } from "./demo";

export const metadata = componentMetadata("question-sequence");

const demoSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/docs/components/question-sequence/demo.tsx",
  ),
  "utf-8",
);

const usageSource = `import {
  SequenceShell,
  useQuestionSequence,
} from "@/components/socratic-ui/question-sequence";
import { SingleSelect } from "@/components/socratic-ui/single-select";
import { MultiSelect } from "@/components/socratic-ui/multi-select";

function MySequence() {
  const seq = useQuestionSequence({
    ids: ["vibe", "tools"],
    onComplete: (answers) => console.log(answers),
  });

  return (
    <SequenceShell
      controller={seq}
      render={(currentId) => {
        switch (currentId) {
          case "vibe":
            return (
              <SingleSelect
                question="What's your vibe right now?"
                options={[{ title: "Building mode" }, { title: "Planning mode" }]}
                {...seq.bind<string | null>("vibe", null)}
              />
            );
          case "tools":
            return (
              <MultiSelect
                question="Which of these are you actively using?"
                options={[{ title: "Claude Code" }, { title: "Todoist" }]}
                {...seq.bind<string[]>("tools", [])}
              />
            );
        }
      }}
    />
  );
}
`;

// The Question Sequence primitive splits into a hook + a shell component.
// The props table below documents `useQuestionSequence`'s options; see the
// usage snippet for how they fit together with `<SequenceShell>`.
const props: PropDef[] = [
  {
    name: "ids",
    type: "string[]",
    required: true,
    description:
      "Ordered list of question ids. Drives pagination and keys the transition between steps.",
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
      "Controlled answers map. When provided, the hook becomes a pure dispatcher — the consumer owns state.",
  },
  {
    name: "onAnswerChange",
    type: "(id: string, value: unknown) => void",
    description:
      "Fires whenever a question's answer changes, regardless of whether the hook is controlled.",
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
