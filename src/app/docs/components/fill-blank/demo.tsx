"use client";

import { useState } from "react";

import { FillBlank } from "@/components/socratic-ui/fill-blank";

export function FillBlankDemo() {
  const [pitch, setPitch] = useState<Record<string, string>>({});

  return (
    <FillBlank
      number="04"
      question="Describe it in one sentence"
      subtitle="Fill in the blanks — constraints spark clarity"
      template="I want to build a {what} for {who} that helps them {outcome}."
      slots={[
        { id: "what", placeholder: "product type" },
        { id: "who", placeholder: "audience" },
        { id: "outcome", placeholder: "outcome" },
      ]}
      value={pitch}
      onChange={setPitch}
    />
  );
}
