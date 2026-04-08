"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import type { Density } from "@/playground/registry";

import { Segmented } from "./segmented";

export function ThemeDensityToggle({
  density,
  onDensityChange,
}: {
  density: Density;
  onDensityChange: (next: Density) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Density
        </span>
        <Segmented
          value={density}
          onChange={onDensityChange}
          options={[
            { value: "comfy", label: "Comfy" },
            { value: "compact", label: "Compact" },
          ]}
        />
      </div>
    </div>
  );
}
