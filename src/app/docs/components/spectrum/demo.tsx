"use client";

import { useState } from "react";

import { Spectrum } from "@/components/socratic-ui/spectrum";

export function SpectrumDemo() {
  const [value, setValue] = useState(50);

  return (
    <Spectrum
      number="07"
      question="What's your building philosophy?"
      subtitle="Drag the slider to where you sit on the spectrum."
      leftLabel="Move fast"
      leftDescription="Ship now, fix later"
      rightLabel="Methodical"
      rightDescription="Measure twice, cut once"
      value={value}
      onChange={setValue}
    />
  );
}
