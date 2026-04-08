"use client";

import { Card, CardContent } from "@/components/ui/card";

import { OptionCard, SectionLabel } from "./shared";

export type MultiSelectOption = {
  title: string;
  subtitle?: string;
};

export interface MultiSelectProps {
  question: string;
  subtitle?: string;
  options: MultiSelectOption[];
  /** Maximum number of selectable options. Defaults to 3. */
  max?: number;
  /** Titles of the currently selected options. */
  value: string[];
  onChange: (value: string[]) => void;
  number?: string;
}

export function MultiSelect({
  question,
  subtitle,
  options,
  max = 3,
  value,
  onChange,
  number,
}: MultiSelectProps) {
  const selected = new Set(value);

  const toggle = (title: string) => {
    if (selected.has(title)) {
      onChange(value.filter((item) => item !== title));
      return;
    }
    if (selected.size >= max) return;
    onChange([...value, title]);
  };

  return (
    <Card className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        <p className="mb-3.5 -mt-1 text-[13px] text-muted-foreground">
          <span className="font-semibold text-primary">
            {selected.size}/{max}
          </span>{" "}
          selected
        </p>
        <div className="flex flex-col gap-2">
          {options.map((option) => {
            const isSelected = selected.has(option.title);
            const atLimit = !isSelected && selected.size >= max;
            return (
              <OptionCard
                key={option.title}
                title={option.title}
                subtitle={option.subtitle}
                selected={isSelected}
                disabled={atLimit}
                onSelect={() => toggle(option.title)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
