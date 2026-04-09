"use client";

import {
  SequenceShell,
  useQuestionSequence,
} from "@/components/socratic-ui/question-sequence";
import { MultiSelect } from "@/components/socratic-ui/multi-select";
import { PriorityRank } from "@/components/socratic-ui/priority-rank";
import { SingleSelect } from "@/components/socratic-ui/single-select";

export function QuestionSequenceDemo() {
  const seq = useQuestionSequence({
    ids: ["vibe", "tools", "priorities"],
    onComplete: (answers) => {
      console.log("Sequence complete", answers);
    },
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
                options={[
                  { title: "Building mode" },
                  { title: "Planning mode" },
                  { title: "Procrastinating" },
                  { title: "Just vibing" },
                ]}
                freeformPlaceholder="Something else"
                {...seq.bind<string | null>("vibe", null)}
              />
            );
          case "tools":
            return (
              <MultiSelect
                question="Which of these are you actively using?"
                max={4}
                options={[
                  { title: "Claude Code" },
                  { title: "Todoist" },
                  { title: "Granola" },
                  { title: "Buildstory" },
                  { title: "Something else" },
                ]}
                {...seq.bind<string[]>("tools", [])}
              />
            );
          case "priorities":
            return (
              <PriorityRank
                question="Rank what matters most for Buildstory right now"
                items={[
                  { title: "Ship features" },
                  { title: "Grow community" },
                  { title: "Polish UX" },
                  { title: "Content & marketing" },
                ]}
                {...seq.bind<string[]>("priorities", [])}
              />
            );
          default:
            return null;
        }
      }}
    />
  );
}
