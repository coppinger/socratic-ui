"use client";

import { useState } from "react";

import { AgreementSpectrum } from "@/components/socratic-ui/agreement-spectrum";

export function AgreementSpectrumDemo() {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  return (
    <AgreementSpectrum
      number="08"
      question="Where do you stand?"
      subtitle="Rate each statement — see how others responded."
      statements={[
        {
          id: "public",
          text: "We should build in public from day one",
          crowd: 72,
        },
        {
          id: "ui",
          text: "A beautiful UI is table stakes",
          crowd: 85,
        },
        {
          id: "analytics",
          text: "Launching without analytics is fine",
          crowd: 31,
        },
        {
          id: "paid",
          text: "We need a paid plan at launch",
          crowd: 44,
        },
      ]}
      value={ratings}
      onChange={setRatings}
    />
  );
}
