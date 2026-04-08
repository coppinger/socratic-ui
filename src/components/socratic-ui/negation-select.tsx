"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { SectionLabel } from "./shared";

export type NegationSelectOption = {
  title: string;
  subtitle?: string;
};

export interface NegationSelectProps {
  question: string;
  subtitle?: string;
  options: NegationSelectOption[];
  /** Titles of the options the user has eliminated. */
  value: string[];
  onChange: (value: string[]) => void;
  number?: string;
}

export function NegationSelect({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
}: NegationSelectProps) {
  const eliminated = new Set(value);

  const toggle = (title: string) => {
    if (eliminated.has(title)) {
      onChange(value.filter((item) => item !== title));
      return;
    }
    onChange([...value, title]);
  };

  const remaining = options.length - eliminated.size;

  return (
    <Card className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        <div className="flex flex-col gap-2">
          {options.map((option) => {
            const killed = eliminated.has(option.title);
            return (
              <button
                key={option.title}
                type="button"
                aria-pressed={killed}
                onClick={() => toggle(option.title)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-xl border bg-card px-4 py-3.5 text-left transition-colors",
                  killed
                    ? "border-[color-mix(in_oklab,var(--negation)_25%,transparent)] bg-[var(--negation-soft)] opacity-60"
                    : "border-border",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold transition-colors",
                    killed
                      ? "bg-[color-mix(in_oklab,var(--negation)_18%,transparent)] text-[var(--negation)]"
                      : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {killed ? "✕" : ""}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      killed
                        ? "text-[var(--negation)] line-through"
                        : "text-foreground",
                    )}
                  >
                    {option.title}
                  </div>
                  {option.subtitle ? (
                    <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {option.subtitle}
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
        {eliminated.size > 0 ? (
          <div className="mt-3.5 rounded-lg bg-muted px-3.5 py-2.5 text-[13px] font-medium text-[var(--text-soft)]">
            {eliminated.size} eliminated — {remaining} remaining in scope
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
