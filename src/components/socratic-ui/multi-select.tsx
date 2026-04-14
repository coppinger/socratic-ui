"use client";

import * as React from "react";

import { CardContent } from "@/components/ui/card";

import type { SocraticMotion } from "./motion";
import {
  MotionCard,
  MotionItem,
  MotionStage,
  MULTI_SELECT_HINTS,
  OptionCard,
  type OptionIconAlignment,
  type OptionIconLayout,
  optionListClass,
  optionListClassName,
  OptionRow,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SectionLabel,
  SelectionStatus,
  useRovingFocus,
  useSequenceQuestion,
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

export function MultiSelect(props: MultiSelectProps) {
  // See SingleSelect for the rationale: Row chrome has no icon slot, so
  // the presence of icons has to route through the tile path.
  const hasIcons = props.options.some((option) => option.icon !== undefined);
  if (hasIcons || props.iconLayout === "vertical") {
    return <MultiSelectTiles {...props} />;
  }
  return <MultiSelectRows {...props} />;
}

function MultiSelectRows({
  question,
  subtitle,
  options,
  max = 3,
  value,
  onChange,
  number,
  motion,
}: MultiSelectProps) {
  const selected = new Set(value);

  const toggleByIndex = (index: number) => {
    const option = options[index];
    if (!option) return;
    if (selected.has(option.title)) {
      onChange(value.filter((item) => item !== option.title));
      return;
    }
    if (selected.size >= max) return;
    onChange([...value, option.title]);
  };

  const { activeIndex, getItemProps, focusItem } = useRovingFocus({
    count: options.length,
    onActivate: toggleByIndex,
  });

  const focusFirst = React.useCallback(() => focusItem(0), [focusItem]);
  const sequence = useSequenceQuestion({
    canSubmit: selected.size > 0,
    focusFirst,
    hints: MULTI_SELECT_HINTS,
  });

  const statusText = <SelectionStatus count={selected.size} />;

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        <QuestionFooter
          hints={MULTI_SELECT_HINTS}
          statusText={selected.size > 0 ? statusText : undefined}
        />
      }
    >
      <MotionStage motion={motion} className={optionListClassName}>
        {options.map((option, index) => {
          const isSelected = selected.has(option.title);
          const atLimit = !isSelected && selected.size >= max;
          return (
            <MotionItem motion={motion} key={option.title}>
              <OptionRow
                title={option.title}
                subtitle={option.subtitle}
                selected={isSelected}
                focused={activeIndex === index}
                disabled={atLimit}
                onSelect={() => toggleByIndex(index)}
                leading={{ kind: "checkbox" }}
                rowProps={getItemProps(index)}
              />
            </MotionItem>
          );
        })}
      </MotionStage>
    </QuestionCard>
  );
}

function MultiSelectTiles({
  question,
  subtitle,
  options,
  max = 3,
  value,
  onChange,
  number,
  motion,
  iconLayout = "vertical",
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
