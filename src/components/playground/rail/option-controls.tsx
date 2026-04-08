"use client";

import type { OptionIconSettings } from "@/components/socratic-ui/shared";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { Segmented } from "./segmented";

export function OptionControls({
  value,
  onChange,
}: {
  value: OptionIconSettings;
  onChange: (next: OptionIconSettings) => void;
}) {
  const dependentRowClass = cn(
    "flex items-center justify-between gap-3 transition-opacity",
    !value.show && "pointer-events-none opacity-50",
  );
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="playground-option-icons"
        className="flex cursor-pointer items-center justify-between gap-3"
      >
        <span className="text-xs font-medium text-muted-foreground">
          Show icons
        </span>
        <Switch
          id="playground-option-icons"
          checked={value.show}
          onCheckedChange={(show) => onChange({ ...value, show })}
        />
      </label>
      <div className={dependentRowClass}>
        <span className="text-xs font-medium text-muted-foreground">
          Layout
        </span>
        <Segmented
          value={value.layout}
          onChange={(layout) => onChange({ ...value, layout })}
          options={[
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
          ]}
        />
      </div>
      {value.layout === "vertical" ? (
        <div className={dependentRowClass}>
          <span className="text-xs font-medium text-muted-foreground">
            Alignment
          </span>
          <Segmented
            value={value.alignment}
            onChange={(alignment) => onChange({ ...value, alignment })}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
