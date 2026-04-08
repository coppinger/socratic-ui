"use client";

import type * as React from "react";

import { CardContent } from "@/components/ui/card";

import type { SocraticMotion } from "./motion";
import {
  MotionCard,
  MotionItem,
  MotionStage,
  OptionCard,
  type OptionIconAlignment,
  type OptionIconLayout,
  optionListClass,
  SectionLabel,
} from "./shared";

export type MultiSelectOption = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
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
  motion?: SocraticMotion;
  iconLayout?: OptionIconLayout;
  iconAlignment?: OptionIconAlignment;
}

export function MultiSelect({
  question,
  subtitle,
  options,
  max = 3,
  value,
  onChange,
  number,
  motion,
  iconLayout = "horizontal",
  iconAlignment = "left",
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
    <MotionCard motion={motion} className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        <p className="mb-3.5 -mt-1 text-[13px] text-muted-foreground">
          <span className="font-semibold text-primary">
            {selected.size}/{max}
          </span>{" "}
          selected
        </p>
        <MotionStage motion={motion} className={optionListClass(iconLayout)}>
          {options.map((option) => {
            const isSelected = selected.has(option.title);
            const atLimit = !isSelected && selected.size >= max;
            return (
              <MotionItem motion={motion} key={option.title}>
                <OptionCard
                  title={option.title}
                  subtitle={option.subtitle}
                  icon={option.icon}
                  iconLayout={iconLayout}
                  iconAlignment={iconAlignment}
                  selected={isSelected}
                  disabled={atLimit}
                  onSelect={() => toggle(option.title)}
                />
              </MotionItem>
            );
          })}
        </MotionStage>
      </CardContent>
    </MotionCard>
  );
}
