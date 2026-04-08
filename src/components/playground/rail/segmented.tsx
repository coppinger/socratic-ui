"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Two-or-three-option segmented control used across rail sections
 * (density, icon layout, icon alignment). Flat list of `{value, label}`
 * pairs so each call site stays a single JSX node.
 */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-border">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-7 rounded-none px-3 text-xs",
              active && "bg-muted text-foreground",
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
