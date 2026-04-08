"use client";

import { Button } from "@/components/ui/button";
import type { ErasedEdgeCasePreset } from "@/playground/registry";

export function EdgeCaseButtons({
  presets,
  onApply,
}: {
  presets: ReadonlyArray<ErasedEdgeCasePreset>;
  onApply: (preset: ErasedEdgeCasePreset) => void;
}) {
  if (presets.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No edge cases defined.</p>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      {presets.map((preset) => (
        <Button
          key={preset.id}
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onApply(preset)}
          className="h-8 w-full justify-start px-3 text-xs font-normal"
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
