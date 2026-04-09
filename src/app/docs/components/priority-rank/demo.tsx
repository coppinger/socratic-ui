"use client";

import { useState } from "react";

import { PriorityRank } from "@/components/socratic-ui/priority-rank";

export function PriorityRankDemo() {
  const [ranking, setRanking] = useState<string[]>([]);

  return (
    <PriorityRank
      number="03"
      question="Rank what to tackle first"
      subtitle="Drag items to reorder your priorities"
      items={[
        {
          title: "User research",
          subtitle: "Validate the problem and audience",
        },
        {
          title: "Technical architecture",
          subtitle: "Choose stack, infra, and data model",
        },
        {
          title: "Visual design",
          subtitle: "Define the brand and UI direction",
        },
        { title: "Go-to-market", subtitle: "Plan distribution and launch" },
        { title: "Funding", subtitle: "Secure budget or investment" },
      ]}
      value={ranking}
      onChange={setRanking}
    />
  );
}
