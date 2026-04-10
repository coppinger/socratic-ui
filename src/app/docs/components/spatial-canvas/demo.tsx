"use client";

import { useState } from "react";

import {
  SpatialCanvas,
  type SpatialCanvasPosition,
} from "@/components/socratic-ui/spatial-canvas";

export function SpatialCanvasDemo() {
  const [value, setValue] = useState<Record<string, SpatialCanvasPosition>>({});

  return (
    <SpatialCanvas
      number="07"
      question="Map these on effort vs impact"
      subtitle="Tap an item below, then tap the canvas to place it."
      xAxisLabel="Effort"
      yAxisLabel="Impact"
      xLowLabel="low"
      xHighLabel="high"
      yLowLabel="low"
      yHighLabel="high"
      items={[
        { id: "onboarding", title: "Onboarding flow" },
        { id: "docs", title: "API docs" },
        { id: "mobile", title: "Mobile app" },
        { id: "admin", title: "Admin panel" },
        { id: "integrations", title: "Integrations" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
