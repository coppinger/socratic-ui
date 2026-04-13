"use client";

import { useState } from "react";
import type { DitheringType } from "@paper-design/shaders";

export interface ShaderSettings {
  // Wrapper styles
  opacity: number;
  blendMode: string;
  // Shader props
  colorFront: string;
  colorBack: string;
  colorHighlight: string;
  type: DitheringType;
  size: number;
  colorSteps: number;
  originalColors: boolean;
  inverted: boolean;
  fit: "none" | "contain" | "cover";
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  speed: number;
}

export const defaultSettings: ShaderSettings = {
  opacity: 0.14,
  blendMode: "hard-light",
  colorFront: "#ffe4db",
  colorBack: "#000000",
  colorHighlight: "#ffffff",
  type: "8x8",
  size: 4.5,
  colorSteps: 7,
  originalColors: false,
  inverted: false,
  fit: "cover",
  scale: 1,
  rotation: 0,
  offsetX: -0.3,
  offsetY: 0.17,
  speed: 1.3,
};

const blendModes = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
] as const;

const ditheringTypes: DitheringType[] = ["random", "2x2", "4x4", "8x8"];
const fitOptions: ShaderSettings["fit"][] = ["none", "contain", "cover"];

export function ShaderDevPanel({
  settings,
  onChange,
}: {
  settings: ShaderSettings;
  onChange: (s: ShaderSettings) => void;
}) {
  const [open, setOpen] = useState(false);

  const update = <K extends keyof ShaderSettings>(
    key: K,
    value: ShaderSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const reset = () => onChange({ ...defaultSettings });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-lg bg-card/90 border border-border px-3 py-1.5 font-mono text-xs text-foreground shadow-lg backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        shader
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 max-h-[80vh] overflow-y-auto rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-sm font-mono text-xs text-foreground">
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between bg-card/95 backdrop-blur-sm border-b border-border px-3 py-2">
        <span className="font-semibold text-sm">Shader Dev</span>
        <div className="flex gap-1.5">
          <button
            onClick={reset}
            className="rounded px-1.5 py-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            reset
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded px-1.5 py-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            close
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* ── Wrapper ── */}
        <Section title="Wrapper">
          <Slider
            label="Opacity"
            value={settings.opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => update("opacity", v)}
          />
          <Select
            label="Blend Mode"
            value={settings.blendMode}
            options={blendModes.map((m) => ({ value: m, label: m }))}
            onChange={(v) => update("blendMode", v)}
          />
        </Section>

        {/* ── Colors ── */}
        <Section title="Colors">
          <ColorInput
            label="Front"
            value={settings.colorFront}
            onChange={(v) => update("colorFront", v)}
          />
          <ColorInput
            label="Back"
            value={settings.colorBack}
            onChange={(v) => update("colorBack", v)}
          />
          <ColorInput
            label="Highlight"
            value={settings.colorHighlight}
            onChange={(v) => update("colorHighlight", v)}
          />
          <Toggle
            label="Original Colors"
            value={settings.originalColors}
            onChange={(v) => update("originalColors", v)}
          />
        </Section>

        {/* ── Dithering ── */}
        <Section title="Dithering">
          <Select
            label="Type"
            value={settings.type}
            options={ditheringTypes.map((t) => ({ value: t, label: t }))}
            onChange={(v) => update("type", v as DitheringType)}
          />
          <Slider
            label="Pixel Size"
            value={settings.size}
            min={0.5}
            max={20}
            step={0.5}
            onChange={(v) => update("size", v)}
          />
          <Slider
            label="Color Steps"
            value={settings.colorSteps}
            min={1}
            max={7}
            step={1}
            onChange={(v) => update("colorSteps", v)}
          />
          <Toggle
            label="Inverted"
            value={settings.inverted}
            onChange={(v) => update("inverted", v)}
          />
        </Section>

        {/* ── Transform ── */}
        <Section title="Transform">
          <Select
            label="Fit"
            value={settings.fit}
            options={fitOptions.map((f) => ({ value: f, label: f }))}
            onChange={(v) => update("fit", v as ShaderSettings["fit"])}
          />
          <Slider
            label="Scale"
            value={settings.scale}
            min={0.01}
            max={4}
            step={0.01}
            onChange={(v) => update("scale", v)}
          />
          <Slider
            label="Rotation"
            value={settings.rotation}
            min={0}
            max={360}
            step={1}
            onChange={(v) => update("rotation", v)}
          />
          <Slider
            label="Offset X"
            value={settings.offsetX}
            min={-1}
            max={1}
            step={0.01}
            onChange={(v) => update("offsetX", v)}
          />
          <Slider
            label="Offset Y"
            value={settings.offsetY}
            min={-1}
            max={1}
            step={0.01}
            onChange={(v) => update("offsetY", v)}
          />
        </Section>

        {/* ── Motion ── */}
        <Section title="Motion">
          <Slider
            label="Speed"
            value={settings.speed}
            min={0}
            max={5}
            step={0.1}
            onChange={(v) => update("speed", v)}
          />
        </Section>
      </div>
    </div>
  );
}

/* ── Primitives ── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {title}
      </div>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-20 shrink-0 text-muted-foreground">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 accent-primary"
      />
      <span className="w-10 text-right tabular-nums">{value.toFixed(step < 1 ? 2 : 0)}</span>
    </div>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-20 shrink-0 text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="flex-1 rounded bg-muted border border-border px-1.5 py-0.5 text-xs"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-20 shrink-0 text-muted-foreground">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-5 w-8 rounded border border-border cursor-pointer"
      />
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="w-20 shrink-0 text-muted-foreground">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`rounded px-2 py-0.5 border transition-colors ${
          value
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-muted text-muted-foreground border-border"
        }`}
      >
        {value ? "on" : "off"}
      </button>
    </div>
  );
}
