"use client";

import type * as React from "react";

import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  MotionCard,
  MotionItem,
  MotionStage,
  type OptionIconAlignment,
  type OptionIconLayout,
  optionListClass,
  SectionLabel,
} from "./shared";

export type NegationSelectOption = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

export interface NegationSelectProps {
  question: string;
  subtitle?: string;
  options: NegationSelectOption[];
  /** Titles of the options the user has eliminated. */
  value: string[];
  onChange: (value: string[]) => void;
  number?: string;
  motion?: SocraticMotion;
  iconLayout?: OptionIconLayout;
  iconAlignment?: OptionIconAlignment;
}

export function NegationSelect({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  motion,
  iconLayout = "horizontal",
  iconAlignment = "left",
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
  const isVertical = iconLayout === "vertical";
  const isCentered = iconAlignment === "center";

  return (
    <MotionCard motion={motion} className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        <MotionStage motion={motion} className={optionListClass(iconLayout)}>
          {options.map((option) => {
            const killed = eliminated.has(option.title);
            const vertical = isVertical && option.icon !== undefined;
            return (
              <MotionItem motion={motion} key={option.title}>
                <button
                  type="button"
                  aria-pressed={killed}
                  aria-label={`${killed ? "Restore" : "Eliminate"} ${option.title}`}
                  onClick={() => toggle(option.title)}
                  className={cn(
                    "relative rounded-xl border bg-card transition-colors",
                    vertical
                      ? cn(
                          "flex h-full w-full flex-col gap-3 px-4 pb-4 pt-5",
                          isCentered
                            ? "items-center text-center"
                            : "items-start text-left",
                        )
                      : cn(
                          "flex w-full items-center gap-3.5 px-4 py-3.5",
                          isCentered
                            ? "justify-center text-center"
                            : "text-left",
                        ),
                    killed
                      ? "border-[color-mix(in_oklab,var(--negation)_25%,transparent)] bg-[var(--negation-soft)] opacity-60"
                      : "border-border",
                  )}
                >
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center text-sm font-bold transition-colors",
                    vertical
                      ? "h-12 w-12 rounded-lg border"
                      : option.icon !== undefined
                        ? "h-9 w-9 rounded-lg border"
                        : "h-7 w-7 rounded-md",
                    killed
                      ? option.icon !== undefined || vertical
                        ? "border-[color-mix(in_oklab,var(--negation)_25%,transparent)] bg-[color-mix(in_oklab,var(--negation)_18%,transparent)] text-[var(--negation)]"
                        : "bg-[color-mix(in_oklab,var(--negation)_18%,transparent)] text-[var(--negation)]"
                      : option.icon !== undefined
                        ? "border-border/80 bg-muted/60 text-foreground/70"
                        : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {killed ? "✕" : (option.icon ?? "")}
                </span>
                <div
                  className={cn(
                    "min-w-0",
                    vertical
                      ? "w-full"
                      : isCentered
                        ? "flex-initial"
                        : "flex-1",
                  )}
                >
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
              </MotionItem>
            );
          })}
        </MotionStage>
        {eliminated.size > 0 ? (
          <div className="mt-3.5 rounded-lg bg-muted px-3.5 py-2.5 text-[13px] font-medium text-[var(--text-soft)]">
            {eliminated.size} eliminated — {remaining} remaining in scope
          </div>
        ) : null}
      </CardContent>
    </MotionCard>
  );
}
