"use client";

import * as React from "react";
import { ArrowRight, PencilLine } from "lucide-react";

import { cn } from "@/lib/utils";

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
  OptionRow,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  type RovingFocusItemProps,
  SectionLabel,
  SelectionStatus,
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
  /** Selected option title (single mode), array of titles (multi mode), or null. */
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  /** Optional question number shown in the header (e.g. "01"). */
  number?: string;
  /** Placeholder for the freeform input. Defaults to `"Any extra context…"`. Pass `false` to hide. */
  freeformPlaceholder?: string | false;
  freeformValue?: string;
  onFreeformChange?: (value: string) => void;
  motion?: SocraticMotion;
  iconLayout?: OptionIconLayout;
  iconAlignment?: OptionIconAlignment;
  /** Let the user switch into multi-select mode at will. */
  allowMultiple?: boolean;
  /** Soft cap shown in multi mode — exceeding it is allowed but flagged visually. Prefer over `max`. */
  suggested?: number;
  /** Hard cap in multi mode — unselected options are disabled at this count. */
  max?: number;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive a Set of selected titles regardless of value shape. */
function useSelected(value: string | string[] | null): Set<string> {
  return React.useMemo(() => {
    if (Array.isArray(value)) return new Set(value);
    if (value !== null) return new Set([value]);
    return new Set();
  }, [value]);
}

/**
 * Shared state logic for the optional multi-select override.
 *
 * `isMultiMode` is derived from the value shape rather than tracked as
 * independent state — this prevents desync between the mode flag and the
 * actual value when a parent re-renders with an unexpected shape.
 */
function useMultiMode({
  value,
  onChange,
  allowMultiple,
  suggested,
  max,
}: Pick<
  SingleSelectProps,
  "value" | "onChange" | "allowMultiple" | "suggested" | "max"
>) {
  // Warn once if the caller provides contradictory caps.
  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      suggested != null &&
      max != null &&
      max < suggested
    ) {
      console.warn(
        "SingleSelect: `max` (%d) should be >= `suggested` (%d) when both are set",
        max,
        suggested,
      );
    }
  }, [suggested, max]);

  const isMultiMode = !!allowMultiple && Array.isArray(value);
  const selected = useSelected(value);
  const canAddMore = !max || selected.size < max;

  /** Flip between single and multi mode by reshaping the value. */
  const toggleMode = () => {
    if (isMultiMode) {
      if (Array.isArray(value)) onChange(value[0] ?? null);
    } else {
      if (value === null) onChange([]);
      else if (!Array.isArray(value)) onChange([value]);
    }
  };

  const toggleByTitle = (title: string) => {
    if (isMultiMode) {
      const arr = Array.isArray(value) ? value : [];
      if (selected.has(title)) {
        onChange(arr.filter((item) => item !== title));
      } else {
        if (!canAddMore) return;
        onChange([...arr, title]);
      }
    } else {
      onChange(value === title ? null : title);
    }
  };

  return { isMultiMode, selected, canAddMore, toggleMode, toggleByTitle };
}

// ─── Rows ─────────────────────────────────────────────────────────────────────

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
  allowMultiple,
  suggested,
  max,
}: SingleSelectProps) {
  const { isMultiMode, selected, canAddMore, toggleMode, toggleByTitle } =
    useMultiMode({ value, onChange, allowMultiple, suggested, max });

  const showFreeform = freeformPlaceholder !== false;
  const resolvedPlaceholder =
    typeof freeformPlaceholder === "string"
      ? freeformPlaceholder
      : "Any extra context\u2026";
  const [internalFreeform, setInternalFreeform] = React.useState("");
  const freeformVal = freeformValue ?? internalFreeform;
  const freeformHandler = onFreeformChange ?? setInternalFreeform;
  const rowCount = options.length + (showFreeform ? 1 : 0);

  const toggle = (index: number) => {
    // Freeform row has no toggle semantics — the input is itself the
    // focused/active row, so Enter just stays inside the input.
    if (showFreeform && index === options.length) return;
    const option = options[index];
    if (!option) return;
    toggleByTitle(option.title);
  };

  const { activeIndex, getItemProps, focusItem } = useRovingFocus({
    count: rowCount,
    onActivate: toggle,
  });

  const focusFirst = React.useCallback(() => focusItem(0), [focusItem]);
  const sequence = useSequenceQuestion({
    canSubmit: isMultiMode ? selected.size > 0 : value !== null,
    focusFirst,
    hints: isMultiMode ? MULTI_SELECT_HINTS : SINGLE_SELECT_HINTS,
  });

  return (
    <QuestionCard
      motion={motion}
      header={
        <>
          <QuestionHeader
            title={question}
            subtitle={subtitle}
            number={number}
          />
          {allowMultiple ? (
            <button
              type="button"
              onClick={toggleMode}
              className="mt-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {isMultiMode ? "Back to single select" : "Select multiple"}
            </button>
          ) : null}
        </>
      }
      footer={
        sequence || (isMultiMode && selected.size > 0) ? (
          <QuestionFooter
            statusText={
              isMultiMode ? (
                <SelectionStatus
                  count={selected.size}
                  suggested={suggested}
                />
              ) : undefined
            }
          />
        ) : null
      }
    >
      <MotionStage motion={motion} className="divide-y divide-border/60">
        {options.map((option, index) => {
          const isSelected = selected.has(option.title);
          return (
            <MotionItem motion={motion} key={option.title}>
              <OptionRow
                title={option.title}
                subtitle={option.subtitle}
                selected={isSelected}
                focused={activeIndex === index}
                disabled={isMultiMode && !canAddMore && !isSelected}
                onSelect={() => toggle(index)}
                leading={
                  isMultiMode
                    ? { kind: "checkbox" }
                    : { kind: "number", value: index + 1 }
                }
                trailing={
                  !isMultiMode && isSelected ? (
                    <ArrowRight className="size-4" />
                  ) : null
                }
                rowProps={getItemProps(index)}
              />
            </MotionItem>
          );
        })}
        {showFreeform ? (
          <MotionItem motion={motion}>
            <FreeformRow
              placeholder={resolvedPlaceholder}
              value={freeformVal}
              onChange={freeformHandler}
              focused={activeIndex === options.length}
              rowProps={getItemProps(options.length)}
            />
          </MotionItem>
        ) : null}
      </MotionStage>
    </QuestionCard>
  );
}

// ─── Freeform ─────────────────────────────────────────────────────────────────

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
  const inputRowProps =
    rowProps as unknown as RovingFocusItemProps<HTMLInputElement>;

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

// ─── Tiles ────────────────────────────────────────────────────────────────────

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
  allowMultiple,
  suggested,
  max,
}: SingleSelectProps) {
  const { isMultiMode, selected, canAddMore, toggleMode, toggleByTitle } =
    useMultiMode({ value, onChange, allowMultiple, suggested, max });

  const showFreeform = freeformPlaceholder !== false;
  const resolvedPlaceholder =
    typeof freeformPlaceholder === "string"
      ? freeformPlaceholder
      : "Any extra context\u2026";
  const [internalFreeform, setInternalFreeform] = React.useState("");
  const freeformVal = freeformValue ?? internalFreeform;
  const freeformHandler = onFreeformChange ?? setInternalFreeform;

  return (
    <MotionCard motion={motion} className="gap-4 px-7 py-6">
      <CardContent className="px-0">
        <SectionLabel number={number} title={question} subtitle={subtitle} />
        {allowMultiple ? (
          <button
            type="button"
            onClick={toggleMode}
            className="-mt-1 mb-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {isMultiMode ? "Back to single select" : "Select multiple"}
          </button>
        ) : null}
        {isMultiMode && selected.size > 0 ? (
          <p className="mb-3.5 -mt-1 text-[13px] text-muted-foreground">
            <SelectionStatus count={selected.size} suggested={suggested} />
          </p>
        ) : null}
        <MotionStage motion={motion} className={optionListClass(iconLayout)}>
          {options.map((option) => {
            const isSelected = selected.has(option.title);
            return (
              <MotionItem motion={motion} key={option.title}>
                <OptionCard
                  title={option.title}
                  subtitle={option.subtitle}
                  icon={option.icon}
                  iconLayout={iconLayout}
                  iconAlignment={iconAlignment}
                  selected={isSelected}
                  disabled={isMultiMode && !canAddMore && !isSelected}
                  onSelect={() => toggleByTitle(option.title)}
                />
              </MotionItem>
            );
          })}
        </MotionStage>
        {showFreeform ? (
          <textarea
            placeholder={resolvedPlaceholder}
            value={freeformVal}
            onChange={(event) => freeformHandler(event.target.value)}
            rows={2}
            className="mt-3 w-full resize-y rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-hidden placeholder:text-muted-foreground focus:border-primary"
          />
        ) : null}
      </CardContent>
    </MotionCard>
  );
}
