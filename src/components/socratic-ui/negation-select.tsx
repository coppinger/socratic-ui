"use client";

import * as React from "react";

import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SocraticMotion } from "./motion";
import {
  MotionCard,
  MotionItem,
  MotionStage,
  NEGATION_SELECT_HINTS,
  type OptionIconAlignment,
  type OptionIconLayout,
  optionListClass,
  OptionRow,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SectionLabel,
  useRovingFocus,
  useSequenceQuestion,
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

export function NegationSelect(props: NegationSelectProps) {
  // See SingleSelect for the rationale: Row chrome has no icon slot, so
  // the presence of icons has to route through the tile path.
  const hasIcons = props.options.some((option) => option.icon !== undefined);
  if (hasIcons || props.iconLayout === "vertical") {
    return <NegationSelectTiles {...props} />;
  }
  return <NegationSelectRows {...props} />;
}

function NegationSelectRows({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  motion,
}: NegationSelectProps) {
  const eliminated = new Set(value);

  const toggleByIndex = (index: number) => {
    const option = options[index];
    if (!option) return;
    if (eliminated.has(option.title)) {
      onChange(value.filter((item) => item !== option.title));
      return;
    }
    onChange([...value, option.title]);
  };

  const { activeIndex, getItemProps, focusItem } = useRovingFocus({
    count: options.length,
    onActivate: toggleByIndex,
  });

  const focusFirst = React.useCallback(() => focusItem(0), [focusItem]);
  const sequence = useSequenceQuestion({
    canSubmit: eliminated.size > 0,
    focusFirst,
    hints: NEGATION_SELECT_HINTS,
  });

  const remaining = options.length - eliminated.size;
  const statusText =
    eliminated.size > 0
      ? `${eliminated.size} eliminated — ${remaining} remaining in scope`
      : null;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        sequence || statusText ? (
          <QuestionFooter statusText={statusText} />
        ) : null
      }
    >
      <MotionStage motion={motion} className="divide-y divide-border/60">
        {options.map((option, index) => {
          const killed = eliminated.has(option.title);
          return (
            <MotionItem motion={motion} key={option.title}>
              <OptionRow
                title={option.title}
                subtitle={option.subtitle}
                selected={killed}
                focused={activeIndex === index}
                onSelect={() => toggleByIndex(index)}
                leading={{ kind: "negation", killed }}
                tone={killed ? "negation" : "default"}
                rowProps={{
                  ...getItemProps(index),
                  "aria-label": `${killed ? "Restore" : "Eliminate"} ${option.title}`,
                }}
              />
            </MotionItem>
          );
        })}
      </MotionStage>
    </QuestionCard>
  );
}

function NegationSelectTiles({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  motion,
  iconLayout = "vertical",
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
