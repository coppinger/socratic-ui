"use client";

import { ImageDithering } from "@paper-design/shaders-react";

export function DitheredBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-25 mix-blend-overlay pointer-events-none">
      <ImageDithering
        style={{ width: "100%", height: "100%" }}
        image="/socrates.png"
        colorBack="#000000"
        colorFront="#ffffff"
        colorHighlight="#ffffff"
        originalColors
        inverted={false}
        type="8x8"
        size={5}
        colorSteps={5}
        fit="cover"
      />
    </div>
  );
}
