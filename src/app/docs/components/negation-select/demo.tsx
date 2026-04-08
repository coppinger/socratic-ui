"use client";

import { useState } from "react";

import { NegationSelect } from "@/components/socratic-ui/negation-select";

export function NegationSelectDemo() {
  const [eliminated, setEliminated] = useState<string[]>([]);

  return (
    <NegationSelect
      number="05"
      question="What do you definitely NOT need?"
      subtitle="Eliminate what's out of scope — it's easier than picking what's in"
      options={[
        {
          title: "Complex onboarding",
          subtitle: "Multi-step signup, email verification, profile setup",
        },
        {
          title: "Social features",
          subtitle: "Feeds, comments, likes, followers",
        },
        {
          title: "Real-time collaboration",
          subtitle: "Live cursors, co-editing, presence",
        },
        {
          title: "Offline support",
          subtitle: "Service workers, local storage sync",
        },
        {
          title: "Internationalisation",
          subtitle: "Multi-language, RTL, locale-aware formatting",
        },
        {
          title: "Custom reporting",
          subtitle: "User-defined dashboards and data views",
        },
      ]}
      value={eliminated}
      onChange={setEliminated}
    />
  );
}
