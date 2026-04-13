import { ImageResponse } from "next/og";

export const alt = "Socratic UI — Structured input components for AI chat interfaces";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0f0d0b",
          padding: "64px 80px",
        }}
      >
        {/* Top — logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 22,
            fontFamily: "monospace",
            color: "#a8a099",
            letterSpacing: "-0.02em",
          }}
        >
          socratic/ui
        </div>

        {/* Middle — headline */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            gap: "0px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#faf9f7",
            }}
          >
            Replace freeform prompts with
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#FF5001",
            }}
          >
            low-friction elicitation.
          </div>
        </div>

        {/* Bottom — tagline + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
            color: "#a8a099",
          }}
        >
          <div style={{ display: "flex" }}>
            Structured input components for AI chat interfaces
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 18,
              color: "#807a74",
            }}
          >
            socraticui.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
