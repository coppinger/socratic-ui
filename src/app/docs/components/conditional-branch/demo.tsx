"use client";

import { useState } from "react";

import {
  ConditionalBranch,
  type ConditionalBranchValue,
} from "@/components/socratic-ui/conditional-branch";

export function ConditionalBranchDemo() {
  const [value, setValue] = useState<ConditionalBranchValue>({
    selectedId: null,
    followUpValue: null,
  });

  return (
    <ConditionalBranch
      number="09"
      question="Do you have existing users?"
      subtitle="Your answer shapes the next question."
      options={[
        {
          id: "yes",
          title: "Yes",
          subtitle: "We have people actively using the product",
          followUp: {
            kind: "single-select",
            question: "Roughly how many active users?",
            options: [
              { title: "< 100", subtitle: "Early adopters, tight feedback loop" },
              { title: "100–1k", subtitle: "Growing base, seeing patterns" },
              { title: "1k–10k", subtitle: "Real traction, scaling concerns" },
              { title: "10k+", subtitle: "Established product, optimisation mode" },
            ],
          },
        },
        {
          id: "no",
          title: "No",
          subtitle: "Pre-launch or still building",
          followUp: {
            kind: "text",
            question: "Who's your initial target audience?",
            placeholder: "Describe your target users…",
          },
        },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
