"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { OptionCard, SectionLabel } from "./shared";

export type SingleSelectOption = {
  title: string;
  subtitle?: string;
};

export interface SingleSelectProps {
  question: string;
  subtitle?: string;
  options: SingleSelectOption[];
  /** Title of the currently selected option, or null when nothing is picked. */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Optional question number shown in the header (e.g. "01"). */
  number?: string;
  freeformPlaceholder?: string;
  freeformValue?: string;
  onFreeformChange?: (value: string) => void;
}

export function SingleSelect({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  freeformPlaceholder,
  freeformValue,
  onFreeformChange,
}: SingleSelectProps) {
  const showFreeform =
    freeformPlaceholder !== undefined && onFreeformChange !== undefined;

  return (
    <Card className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <OptionCard
              key={option.title}
              title={option.title}
              subtitle={option.subtitle}
              selected={value === option.title}
              onSelect={() =>
                onChange(value === option.title ? null : option.title)
              }
            />
          ))}
        </div>
        {showFreeform ? (
          <Textarea
            placeholder={freeformPlaceholder}
            value={freeformValue ?? ""}
            onChange={(event) => onFreeformChange(event.target.value)}
            rows={2}
            className="mt-3 resize-y bg-muted"
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
