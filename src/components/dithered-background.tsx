"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { ImageDithering } from "@paper-design/shaders-react";
import { defaultSettings, type ShaderSettings } from "./shader-dev-panel";

const mobileQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(max-width: 767px)")
    : null;

function subscribeToMobile(cb: () => void) {
  mobileQuery?.addEventListener("change", cb);
  return () => mobileQuery?.removeEventListener("change", cb);
}

function getIsMobile() {
  return mobileQuery?.matches ?? false;
}

function getIsMobileServer() {
  return false;
}

export function DitheredBackground() {
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getIsMobile,
    getIsMobileServer,
  );
  const [s, setS] = useState<ShaderSettings>(defaultSettings);
  const [fadeIn, setFadeIn] = useState(false);
  const frameRef = useRef(0);
  const [drift, setDrift] = useState({ scale: 0, offsetX: 0, offsetY: 0 });

  const fit = isMobile ? "cover" : s.fit;
  const baseOffsetX = isMobile ? 0 : s.offsetX;
  const baseOffsetY = isMobile ? 0 : s.offsetY;

  // Trigger fade-in after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Subtle looping drift animation
  useEffect(() => {
    let raf: number;
    const animate = (time: number) => {
      const t = time / 1000;
      setDrift({
        scale: Math.sin(t * 0.3) * 0.03,
        offsetX: Math.sin(t * 0.2) * 0.015,
        offsetY: Math.cos(t * 0.25) * 0.01,
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-[2000ms] ease-out"
        style={{
          opacity: fadeIn ? s.opacity : 0,
          mixBlendMode: s.blendMode as React.CSSProperties["mixBlendMode"],
        }}
      >
        <ImageDithering
          style={{ width: "100%", height: "100%" }}
          image="/socrates.png"
          colorBack={s.colorBack}
          colorFront={s.colorFront}
          colorHighlight={s.colorHighlight}
          originalColors={s.originalColors}
          inverted={s.inverted}
          type={s.type}
          size={s.size}
          colorSteps={s.colorSteps}
          fit={fit}
          scale={s.scale + drift.scale}
          rotation={s.rotation}
          offsetX={baseOffsetX + drift.offsetX}
          offsetY={baseOffsetY + drift.offsetY}
          speed={s.speed}
        />
      </div>
    </>
  );
}
