"use client";

import { useState } from "react";

import { OpenQuestions } from "@/components/socratic-ui/open-questions";

export function OpenQuestionsDemo() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <OpenQuestions
      number="05"
      question="Help me understand what you're hitting"
      subtitle="A few sentences each is plenty."
      prompts={[
        {
          id: "goal",
          text: "What are you trying to make happen?",
          placeholder: "The outcome you want…",
        },
        {
          id: "tried",
          text: "What have you tried so far?",
          placeholder: "Approaches, dead ends, partial fixes…",
        },
        {
          id: "stuck",
          text: "Where exactly does it break?",
          placeholder: "Error, unexpected behaviour, missing piece…",
        },
      ]}
      value={answers}
      onChange={setAnswers}
    />
  );
}
