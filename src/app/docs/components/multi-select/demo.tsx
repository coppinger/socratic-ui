"use client";

import { useState } from "react";

import { MultiSelect } from "@/components/socratic-ui/multi-select";

export function MultiSelectDemo() {
  const [priorities, setPriorities] = useState<string[]>([]);

  return (
    <MultiSelect
      number="02"
      question="What matters most right now?"
      subtitle="Choose up to 3 priorities to guide your plan"
      max={3}
      options={[
        { title: "Speed to market", subtitle: "Ship fast, iterate later" },
        { title: "Polish & quality", subtitle: "Get it right the first time" },
        { title: "Low cost", subtitle: "Minimise spend wherever possible" },
        { title: "Scalability", subtitle: "Build for growth from day one" },
        { title: "Simplicity", subtitle: "Keep the stack and scope tight" },
        {
          title: "Flexibility",
          subtitle: "Stay adaptable as requirements shift",
        },
      ]}
      value={priorities}
      onChange={setPriorities}
    />
  );
}
