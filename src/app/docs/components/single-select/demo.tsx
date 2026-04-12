"use client";

import { useState } from "react";

import { SingleSelect } from "@/components/socratic-ui/single-select";

export function SingleSelectDemo() {
  const [setup, setSetup] = useState<string | string[] | null>(null);
  const [setupNote, setSetupNote] = useState("");

  return (
    <SingleSelect
      number="01"
      question="How are you building this product?"
      subtitle="Pick the option that best describes your setup"
      options={[
        {
          title: "Solo founder",
          subtitle: "Building alone, wearing all the hats",
        },
        {
          title: "Co-founding team",
          subtitle: "Two or more founders splitting responsibilities",
        },
        {
          title: "Within a company",
          subtitle: "Internal team with organisational backing",
        },
        {
          title: "Agency / consultancy",
          subtitle: "Building on behalf of a client",
        },
      ]}
      value={setup}
      onChange={setSetup}
      freeformPlaceholder="Any extra context…"
      freeformValue={setupNote}
      onFreeformChange={setSetupNote}
    />
  );
}
