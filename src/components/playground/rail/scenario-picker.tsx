"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlaygroundScenario } from "@/playground/registry";

export function ScenarioPicker({
  scenarios,
  value,
  onChange,
}: {
  scenarios: ReadonlyArray<PlaygroundScenario>;
  value: string;
  onChange: (id: string) => void;
}) {
  if (scenarios.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No scenarios yet for this component.
      </p>
    );
  }
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (typeof next === "string") onChange(next);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {scenarios.map((scenario) => (
          <SelectItem key={scenario.id} value={scenario.id}>
            {scenario.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
