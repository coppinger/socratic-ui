"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";

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
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SectionLabel,
  useSequenceQuestion,
} from "./shared";

export type PriorityRankItem = {
  /** Must be unique within `items`. `Reorder.Item` uses this as its key. */
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

export interface PriorityRankProps {
  question: string;
  subtitle?: string;
  items: PriorityRankItem[];
  /**
   * Ordered list of titles, highest priority first. Titles NOT present
   * in `value` are appended in `items` order — so an empty `value`
   * starts the list in the items' natural order and lets the user drag
   * to reorder.
   */
  value: string[];
  onChange: (value: string[]) => void;
  number?: string;
  motion?: SocraticMotion;
  iconLayout?: OptionIconLayout;
  iconAlignment?: OptionIconAlignment;
}

export function PriorityRank(props: PriorityRankProps) {
  if (props.iconLayout === "vertical") {
    return <PriorityRankTiles {...props} />;
  }
  return <PriorityRankRows {...props} />;
}

function PriorityRankRows({
  question,
  subtitle,
  items,
  value,
  onChange,
  number,
  motion,
}: PriorityRankProps) {
  const itemsByTitle = React.useMemo(
    () => new Map(items.map((item) => [item.title, item])),
    [items],
  );
  const order = React.useMemo(() => {
    const known = new Set(value);
    const filtered = value.filter((title) => itemsByTitle.has(title));
    const remaining = items
      .filter((item) => !known.has(item.title))
      .map((item) => item.title);
    return [...filtered, ...remaining];
  }, [value, items, itemsByTitle]);

  const handleReorder = (next: string[]) => onChange(next);

  // Priority rank has no invalid state — reordering is always ready to
  // submit. No keyboard roving here (drag handles own focus), so
  // `focusFirst` is omitted.
  const sequence = useSequenceQuestion({ canSubmit: true });

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={
        sequence ? (
          <QuestionFooter statusText="Drag to reorder your priorities" />
        ) : null
      }
    >
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={handleReorder}
        className="flex flex-col divide-y divide-border/60"
      >
        {order.map((title, index) => {
          const item = itemsByTitle.get(title);
          if (!item) return null;
          return (
            <PriorityRankRow
              key={title}
              title={title}
              item={item}
              index={index}
            />
          );
        })}
      </Reorder.Group>
    </QuestionCard>
  );
}

function PriorityRankRow({
  title,
  item,
  index,
}: {
  title: string;
  item: PriorityRankItem;
  index: number;
}) {
  // Scope the drag gesture to the grip handle so clicks on the row
  // body don't accidentally start a drag; the whole row is still the
  // drop target.
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={title}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.22, delay: 0.05 * index },
      }}
      className="list-none"
    >
      <div
        className={cn("relative flex w-full items-center gap-4 px-5 py-4")}
      >
        <span
          aria-hidden
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            "bg-muted text-muted-foreground font-mono text-[15px] font-semibold",
          )}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-tight text-foreground">
            {item.title}
          </div>
          {item.subtitle ? (
            <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
              {item.subtitle}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          aria-label={`Drag to reorder ${item.title}`}
          onPointerDown={(event) => controls.start(event)}
          className="flex h-10 w-8 cursor-grab items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" aria-hidden />
        </button>
      </div>
    </Reorder.Item>
  );
}

function PriorityRankTiles({
  question,
  subtitle,
  items,
  value,
  onChange,
  number,
  motion,
  iconLayout = "vertical",
  iconAlignment = "left",
}: PriorityRankProps) {
  const ranked = value;
  const itemsByTitle = React.useMemo(
    () => new Map(items.map((item) => [item.title, item])),
    [items],
  );
  const unranked = React.useMemo(() => {
    const rankedSet = new Set(ranked);
    return items.filter((item) => !rankedSet.has(item.title));
  }, [items, ranked]);
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
