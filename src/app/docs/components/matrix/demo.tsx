"use client";

import { useState } from "react";

import { Matrix } from "@/components/socratic-ui/matrix";

export function MatrixDemo() {
  const [value, setValue] = useState<Record<string, number>>({});

  return (
    <Matrix
      number="10"
      question="Rate your team's capabilities"
      subtitle="Tap each cell to assess skill level across domains."
      rows={[
        { id: "frontend", title: "Frontend", subtitle: "UI, components, styling" },
        { id: "backend", title: "Backend", subtitle: "APIs, databases, auth" },
        { id: "design", title: "Design", subtitle: "UX, brand, visual polish" },
        { id: "devops", title: "DevOps", subtitle: "CI/CD, infra, monitoring" },
      ]}
      levels={["None", "Basic", "Solid", "Expert"]}
      value={value}
      onChange={setValue}
    />
  );
}
