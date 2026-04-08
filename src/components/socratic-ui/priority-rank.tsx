"use client";

import type * as React from "react";

import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export type PriorityRankItem = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

export interface PriorityRankProps {
  question: string;
  subtitle?: string;
  items: PriorityRankItem[];
  /** Ordered list of titles, highest priority first. */
  value: string[];
  onChange: (value: string[]) => void;
  number?: string;
  motion?: SocraticMotion;
  iconLayout?: OptionIconLayout;
  iconAlignment?: OptionIconAlignment;
}

export function PriorityRank({
  question,
  subtitle,
  items,
  value,
  onChange,
  number,
  motion,
  iconLayout = "horizontal",
  iconAlignment = "left",
}: PriorityRankProps) {
  const ranked = value;
  const itemsByTitle = new Map(items.map((item) => [item.title, item]));
  const rankedSet = new Set(ranked);
  const unranked = items.filter((item) => !rankedSet.has(item.title));
  const listClass = optionListClass(iconLayout);

  const add = (title: string) => onChange([...ranked, title]);
  const remove = (title: string) =>
    onChange(ranked.filter((item) => item !== title));

  return (
    <MotionCard motion={motion} className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        {ranked.length > 0 ? (
          <MotionStage
            motion={motion}
            className={cn(listClass, unranked.length > 0 && "mb-3.5")}
          >
            {ranked.map((title, index) => {
              const item = itemsByTitle.get(title);
              if (!item) return null;
              return (
                <MotionItem motion={motion} key={title}>
                  <OptionCard
                    title={item.title}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    iconLayout={iconLayout}
                    iconAlignment={iconAlignment}
                    selected
                    indicator={index + 1}
                    onSelect={() => remove(title)}
                  />
                </MotionItem>
              );
            })}
          </MotionStage>
        ) : null}
        {unranked.length > 0 ? (
          <MotionStage motion={motion} className={listClass}>
            {unranked.map((item) => (
              <MotionItem motion={motion} key={item.title}>
                <OptionCard
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  iconLayout={iconLayout}
                  iconAlignment={iconAlignment}
                  selected={false}
                  dashed
                  onSelect={() => add(item.title)}
                />
              </MotionItem>
            ))}
          </MotionStage>
        ) : null}
      </CardContent>
    </MotionCard>
  );
}
