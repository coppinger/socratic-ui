"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  defaultMotion,
  type SocraticMotion,
  subtleMotion,
} from "@/components/socratic-ui/motion";
import { cn } from "@/lib/utils";

const EASE_OPTIONS: ReadonlyArray<{
  value: NonNullable<SocraticMotion["ease"]>;
  label: string;
}> = [
  { value: "easeOut", label: "Ease out" },
  { value: "easeInOut", label: "Ease in/out" },
  { value: "linear", label: "Linear" },
];

type MotionPreset = {
  id: string;
  label: string;
  description: string;
  motion: Required<
    Pick<SocraticMotion, "duration" | "stagger" | "delay" | "ease">
  >;
};

const MOTION_PRESETS: ReadonlyArray<MotionPreset> = [
  {
    id: "subtle",
    label: "Subtle",
    description: "Default: gentle fade, light stagger.",
    motion: subtleMotion,
  },
  {
    id: "snappy",
    label: "Snappy",
    description: "Fast, near-instant — for confident UIs.",
    motion: { duration: 0.18, stagger: 0.025, delay: 0, ease: "easeOut" },
  },
  {
    id: "bouncy",
    label: "Bouncy",
    description: "Slight overshoot for playful surfaces.",
    motion: {
      duration: 0.45,
      stagger: 0.05,
      delay: 0,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  {
    id: "drift",
    label: "Slow drift",
    description: "Cinematic — long, drawn-out reveal.",
    motion: { duration: 0.7, stagger: 0.09, delay: 0.1, ease: "easeOut" },
  },
];

function easeEqual(
  a: SocraticMotion["ease"],
  b: SocraticMotion["ease"],
): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  return a === b;
}

// `onPresetSelect` is separate from `onChange` so the playground can fire
// an animation replay only when a named preset is clicked, not on every
// slider drag inside the advanced disclosure.
export function MotionControls({
  motion,
  onChange,
  onPresetSelect,
}: {
  motion: SocraticMotion;
  onChange: (next: SocraticMotion) => void;
  onPresetSelect: (next: SocraticMotion) => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const enabled = motion.enabled ?? false;
  const duration = motion.duration ?? defaultMotion.duration;
  const stagger = motion.stagger ?? defaultMotion.stagger;
  const delay = motion.delay ?? defaultMotion.delay;
  const easeValue = typeof motion.ease === "string" ? motion.ease : "easeOut";

  const activePresetId = useMemo(
    () =>
      MOTION_PRESETS.find(
        ({ motion: m }) =>
          m.duration === motion.duration &&
          m.stagger === motion.stagger &&
          m.delay === motion.delay &&
          easeEqual(m.ease, motion.ease),
      )?.id,
    [motion],
  );

  const applyPreset = (preset: MotionPreset) => {
    onPresetSelect({ enabled: true, ...preset.motion });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="motion-enabled" className="text-xs font-medium">
          Animate entry
        </Label>
        <Switch
          id="motion-enabled"
          checked={enabled}
          onCheckedChange={(next) => onChange({ ...motion, enabled: next })}
        />
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 transition-opacity",
          !enabled && "pointer-events-none opacity-40",
        )}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {MOTION_PRESETS.map((preset) => {
            const active = preset.id === activePresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                title={preset.description}
                className={cn(
                  "flex flex-col items-start gap-0.5 rounded-md border px-2 py-1.5 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-primary" : "text-foreground",
                  )}
                >
                  {preset.label}
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>

        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-dashed border-border px-2.5 py-1.5 text-left transition-colors hover:bg-muted"
              />
            }
          >
            <span className="text-[11px] font-medium text-muted-foreground">
              Advanced
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                advancedOpen && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2 pt-3">
            <SliderRow
              label="Duration"
              unit="s"
              value={duration}
              min={0}
              max={1.5}
              step={0.05}
              disabled={!enabled}
              onChange={(next) => onChange({ ...motion, duration: next })}
            />
            <SliderRow
              label="Stagger"
              unit="s"
              value={stagger}
              min={0}
              max={0.3}
              step={0.01}
              disabled={!enabled}
              onChange={(next) => onChange({ ...motion, stagger: next })}
            />
            <SliderRow
              label="Delay"
              unit="s"
              value={delay}
              min={0}
              max={1}
              step={0.05}
              disabled={!enabled}
              onChange={(next) => onChange({ ...motion, delay: next })}
            />

            <div className="mt-1 flex items-center justify-between gap-3">
              <Label className="text-xs font-medium">Easing</Label>
              <Select
                value={easeValue}
                disabled={!enabled}
                onValueChange={(next) => {
                  if (typeof next !== "string") return;
                  onChange({
                    ...motion,
                    ease: next as NonNullable<SocraticMotion["ease"]>,
                  });
                }}
              >
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EASE_OPTIONS.map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  unit,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="font-mono text-[11px] text-muted-foreground">
          {value.toFixed(2)}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={(next) => {
          const scalar = Array.isArray(next) ? next[0] : next;
          if (typeof scalar === "number") onChange(scalar);
        }}
      />
    </div>
  );
}
