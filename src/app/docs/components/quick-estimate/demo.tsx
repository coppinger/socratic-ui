"use client";

import { useState } from "react";

import { QuickEstimate } from "@/components/socratic-ui/quick-estimate";

export function QuickEstimateDemo() {
  const [value, setValue] = useState<Record<string, string | null>>({});

  return (
    <QuickEstimate
      number="08"
      question="Budget & timeline constraints"
      subtitle="Set both dimensions to frame the scope of work."
      dimensions={[
        {
          id: "budget",
          label: "Budget range",
          options: [
            { title: "< $5k", subtitle: "Bootstrapped, MVP-only budget" },
            { title: "$5–20k", subtitle: "Enough for a focused build" },
            { title: "$20–50k", subtitle: "Room for polish and iteration" },
            { title: "$50k+", subtitle: "Fully resourced project" },
          ],
        },
        {
          id: "timeline",
          label: "Timeline",
          options: [
            { title: "2 weeks", subtitle: "Sprint to a prototype" },
            { title: "1 month", subtitle: "Enough for a solid v1" },
            { title: "3 months", subtitle: "Full product cycle" },
            { title: "6+ months", subtitle: "Long-term, phased delivery" },
          ],
        },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
