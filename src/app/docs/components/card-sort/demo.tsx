"use client";

import { useState } from "react";

import { CardSort } from "@/components/socratic-ui/card-sort";

export function CardSortDemo() {
  const [value, setValue] = useState<Record<string, string[]>>({});

  return (
    <CardSort
      number="06"
      question="Sort these features for v1"
      subtitle="Pick a bucket, then tap features to place them."
      buckets={[
        {
          id: "must",
          title: "Must have",
          subtitle: "Blocks launch without it",
          tone: "affirm",
        },
        {
          id: "nice",
          title: "Nice to have",
          subtitle: "A later milestone",
          tone: "neutral",
        },
        {
          id: "not",
          title: "Not needed",
          subtitle: "Out of scope",
          tone: "muted",
        },
      ]}
      items={[
        { title: "Auth system", subtitle: "Login, signup, permissions" },
        { title: "Analytics", subtitle: "Usage tracking and dashboards" },
        { title: "Dark mode", subtitle: "Alternate colour scheme" },
        { title: "Notifications", subtitle: "Email, push, or in-app alerts" },
        { title: "Search", subtitle: "Full-text search across content" },
        { title: "Export", subtitle: "CSV, PDF, or API data export" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
