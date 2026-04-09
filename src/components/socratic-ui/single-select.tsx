"use client";

import * as React from "react";
import { ArrowRight, PencilLine } from "lucide-react";

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
  OptionRow,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  type RovingFocusItemProps,
  SectionLabel,
  SINGLE_SELECT_HINTS,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";
import { CardContent } from "@/components/ui/card";

export type SingleSelectOption = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
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
  motion?: SocraticMotion;
  iconLayout?: OptionIconLayout;
  iconAlignment?: OptionIconAlignment;
}

export function SingleSelect(props: SingleSelectProps) {
  // The icon-tile path is a deliberate deviation from the Claude-style
  // row layout — routed in whenever options carry icons (regardless of
  // horizontal/vertical) or the caller explicitly asks for vertical
  // tiles. Row chrome has no icon slot, so if we stayed in Rows here the
  // playground option-icon toggle would only work with layout=vertical.
  const hasIcons = props.options.some((option) => option.icon !== undefined);
  if (hasIcons || props.iconLayout === "vertical") {
    return <SingleSelectTiles {...props} />;
  }
  return <SingleSelectRows {...props} />;
}

function SingleSelectRows({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  freeformPlaceholder,
  freeformValue,
  onFreeformChange,
  motion,
}: SingleSelectProps) {
  const showFreeform =
    freeformPlaceholder !== undefined && onFreeformChange !== undefined;
  const rowCount = options.length + (showFreeform ? 1 : 0);

  const toggle = (index: number) => {
    // Freeform row has no toggle semantics — the input is itself the
    // focused/active row, so Enter just stays inside the input.
    if (showFreeform && index === options.length) return;
    const option = options[index];
    if (!option) return;
    onChange(value === option.title ? null : option.title);
  };

  const { activeIndex, getItemProps, focusItem } = useRovingFocus({
    count: rowCount,
    onActivate: toggle,
  });

  const focusFirst = React.useCallback(() => focusItem(0), [focusItem]);
  const sequence = useSequenceQuestion({
    canSubmit: value !== null,
    focusFirst,
    hints: SINGLE_SELECT_HINTS,
  });

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={sequence ? <QuestionFooter /> : null}
    >
      <MotionStage motion={motion} className="divide-y divide-border/60">
        {options.map((option, index) => {
          const selected = value === option.title;
          return (
            <MotionItem motion={motion} key={option.title}>
              <OptionRow
                title={option.title}
                subtitle={option.subtitle}
                selected={selected}
                focused={activeIndex === index}
                onSelect={() => toggle(index)}
                leading={{ kind: "number", value: index + 1 }}
                trailing={
                  selected ? <ArrowRight className="size-4" /> : null
                }
                rowProps={getItemProps(index)}
              />
            </MotionItem>
          );
        })}
        {showFreeform ? (
          <MotionItem motion={motion}>
            <FreeformRow
              placeholder={freeformPlaceholder!}
              value={freeformValue ?? ""}
              onChange={onFreeformChange!}
              focused={activeIndex === options.length}
              rowProps={getItemProps(options.length)}
            />
          </MotionItem>
        ) : null}
      </MotionStage>
    </QuestionCard>
  );
}

function FreeformRow({
  placeholder,
  value,
  onChange,
  focused,
  rowProps,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  rowProps: RovingFocusItemProps;
}) {
  // The roving hook types its refs as `HTMLButtonElement` since most rows
  // are buttons; the freeform row IS the input itself. Cast the whole
  // props shape once so the input can adopt them directly — the hook only
  // calls `.focus()` on the stored ref, which works on any `HTMLElement`.
  const inputRowProps = rowProps as unknown as RovingFocusItemProps<HTMLInputElement>;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Home/End must keep editing the typed text — don't let the roving
    // hook hijack them as list-jump shortcuts. Arrow keys and Enter still
    // bubble through so the cursor can leave the freeform row.
    if (event.key === "Home" || event.key === "End") return;
    inputRowProps.onKeyDown(event);
  };

  return (
    <div
      className={cn(
        "group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors",
        "has-[input:focus-visible]:bg-muted/60",
        focused && "bg-muted/60",
      )}
    >
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
      >
        <PencilLine className="size-4" />
      </span>
      <input
        {...inputRowProps}
        onKeyDown={handleKeyDown}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent text-[15px] font-semibold text-foreground outline-hidden",
          "placeholder:font-normal placeholder:text-muted-foreground",
        )}
      />
    </div>
  );
}

function SingleSelectTiles({
  question,
  subtitle,
  options,
  value,
  onChange,
  number,
  freeformPlaceholder,
  freeformValue,
  onFreeformChange,
  motion,
  iconLayout = "vertical",
  iconAlignment = "left",
}: SingleSelectProps) {
  const showFreeform =
    freeformPlaceholder !== undefined && onFreeformChange !== undefined;

  return (
    <MotionCard motion={motion} className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        <MotionStage motion={motion} className={optionListClass(iconLayout)}>
          {options.map((option) => (
            <MotionItem motion={motion} key={option.title}>
              <OptionCard
                title={option.title}
                subtitle={option.subtitle}
                icon={option.icon}
                iconLayout={iconLayout}
                iconAlignment={iconAlignment}
                selected={value === option.title}
                onSelect={() =>
                  onChange(value === option.title ? null : option.title)
                }
              />
            </MotionItem>
          ))}
        </MotionStage>
        {showFreeform ? (
          <textarea
            placeholder={freeformPlaceholder}
            value={freeformValue ?? ""}
            onChange={(event) => onFreeformChange(event.target.value)}
            rows={2}
            className="mt-3 w-full resize-y rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-hidden placeholder:text-muted-foreground focus:border-primary"
          />
        ) : null}
      </CardContent>
    </MotionCard>
  );
}
