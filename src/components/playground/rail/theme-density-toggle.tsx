"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Density } from "@/playground/registry";

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
        <div className="flex overflow-hidden rounded-md border border-border">
          <DensityButton
            active={density === "comfy"}
            onClick={() => onDensityChange("comfy")}
          >
            Comfy
          </DensityButton>
          <DensityButton
            active={density === "compact"}
            onClick={() => onDensityChange("compact")}
          >
            Compact
          </DensityButton>
        </div>
      </div>
    </div>
  );
}

function DensityButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-7 rounded-none px-3 text-xs",
        active && "bg-muted text-foreground",
      )}
    >
      {children}
    </Button>
  );
}
