"use client";

import { Card, CardContent } from "@/components/ui/card";

import { OptionCard, SectionLabel } from "./shared";

export type PriorityRankItem = {
  title: string;
  subtitle?: string;
};

export interface PriorityRankProps {
  question: string;
  subtitle?: string;
  items: PriorityRankItem[];
  /** Ordered list of titles, highest priority first. */
  value: string[];
  onChange: (value: string[]) => void;
  number?: string;
}

export function PriorityRank({
  question,
  subtitle,
  items,
  value,
  onChange,
  number,
}: PriorityRankProps) {
  const ranked = value;
  const unranked = items.filter((item) => !ranked.includes(item.title));

  const add = (title: string) => onChange([...ranked, title]);
  const remove = (title: string) =>
    onChange(ranked.filter((item) => item !== title));
  const find = (title: string) => items.find((item) => item.title === title);

  return (
    <Card className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        {ranked.length > 0 ? (
          <div
            className={`flex flex-col gap-2 ${unranked.length > 0 ? "mb-3.5" : ""}`}
          >
            {ranked.map((title, index) => {
              const item = find(title);
              if (!item) return null;
              return (
                <OptionCard
                  key={title}
                  title={item.title}
                  subtitle={item.subtitle}
                  selected
                  indicator={index + 1}
                  onSelect={() => remove(title)}
                />
              );
            })}
          </div>
        ) : null}
        {unranked.length > 0 ? (
          <div className="flex flex-col gap-2">
            {unranked.map((item) => (
              <OptionCard
                key={item.title}
                title={item.title}
                subtitle={item.subtitle}
                selected={false}
                dashed
                onSelect={() => add(item.title)}
              />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
