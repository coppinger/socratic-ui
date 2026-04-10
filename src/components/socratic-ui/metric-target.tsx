"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import type { SocraticMotion } from "./motion";
import {
  METRIC_TARGET_HINTS,
  MotionItem,
  MotionStage,
  QuestionCard,
  QuestionFooter,
  QuestionHeader,
  SuccessSummary,
  useRovingFocus,
  useSequenceQuestion,
} from "./shared";

export type MetricTargetMetric = {
  /** Stable identifier used as the key in the response. */
  id: string;
  label: string;
  subtitle?: string;
  /** Optional unit rendered alongside the target input, e.g. "%" or "users". */
  unit?: string;
  /** Arrow direction hint — higher is better or lower is better. */
  direction?: "increase" | "decrease";
};

export interface MetricTargetValue {
  metricId: string | null;
  target: number | null;
  timeframe: string | null;
}

export interface MetricTargetProps {
  question: string;
  subtitle?: string;
  metrics: MetricTargetMetric[];
  /** Selectable timeframe chips. Defaults to a sensible quarterly-ish set. */
  timeframes?: string[];
  value: MetricTargetValue;
  onChange: (value: MetricTargetValue) => void;
  targetPlaceholder?: string;
  number?: string;
  motion?: SocraticMotion;
}

const DEFAULT_TIMEFRAMES = ["30 days", "90 days", "6 months", "1 year"];

/**
 * Pick a metric, name a numeric target, pick a timeframe. The minimal
 * spec-grade building block for "what good looks like" sections — no
 * other component in the registry combines a categorical pick with a
 * numeric target. Metric chips fill the first row; the target + unit
 * sits in the middle; timeframes chip row underneath.
 */
export function MetricTarget({
  question,
  subtitle,
  metrics,
  timeframes,
  value,
  onChange,
  targetPlaceholder = "Target",
  number,
  motion,
}: MetricTargetProps) {
  const effectiveTimeframes =
    timeframes && timeframes.length > 0 ? timeframes : DEFAULT_TIMEFRAMES;

  const stageRef = React.useRef<HTMLDivElement>(null);

  const selectedMetric = metrics.find((metric) => metric.id === value.metricId);

  const setMetric = (id: string) => {
    onChange({
      ...value,
      metricId: value.metricId === id ? null : id,
    });
  };

  const setTarget = (raw: string) => {
    if (raw === "") {
      onChange({ ...value, target: null });
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    onChange({ ...value, target: parsed });
  };

  const setTimeframe = (timeframe: string) => {
    onChange({
      ...value,
      timeframe: value.timeframe === timeframe ? null : timeframe,
    });
  };

  const metricRoving = useRovingFocus({
    count: metrics.length,
    orientation: "vertical",
    onActivate: (index) => {
      const metric = metrics[index];
      if (!metric) return;
      setMetric(metric.id);
    },
  });

  const timeframeRoving = useRovingFocus({
    count: effectiveTimeframes.length,
    orientation: "horizontal",
    onActivate: (index) => {
      const timeframe = effectiveTimeframes[index];
      if (!timeframe) return;
      setTimeframe(timeframe);
    },
  });

  const allSet =
    value.metricId !== null &&
    value.target !== null &&
    value.timeframe !== null;

  const focusFirst = React.useCallback(() => {
    metricRoving.focusItem(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequence = useSequenceQuestion({
    canSubmit: allSet,
    focusFirst,
    hints: METRIC_TARGET_HINTS,
  });

  const summary = React.useMemo(() => {
    if (!allSet || !selectedMetric) return null;
    const unit = selectedMetric.unit ? ` ${selectedMetric.unit}` : "";
    const direction =
      selectedMetric.direction === "decrease"
        ? "down to"
        : selectedMetric.direction === "increase"
          ? "up to"
          : "to";
    return `${selectedMetric.label} ${direction} ${value.target}${unit} within ${value.timeframe}`;
  }, [allSet, selectedMetric, value.target, value.timeframe]);

  return (
    <QuestionCard
      motion={motion}
      header={
        <QuestionHeader title={question} subtitle={subtitle} number={number} />
      }
      footer={sequence ? <QuestionFooter /> : null}
    >
      <div ref={stageRef} className="flex flex-col gap-5 px-7 pb-2">
        {/* Metric list — roving vertical list keeps keyboard nav consistent
            with the other single-pick components. */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Metric
          </p>
          <MotionStage motion={motion} className="flex flex-col gap-2">
            {metrics.map((metric, index) => {
              const isSelected = metric.id === value.metricId;
              const focused = metricRoving.activeIndex === index;
              const TrendIcon =
                metric.direction === "decrease"
                  ? TrendingDown
                  : metric.direction === "increase"
                    ? TrendingUp
                    : null;
              return (
                <MotionItem motion={motion} key={metric.id}>
                  <button
                    type="button"
                    onClick={() => setMetric(metric.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      "outline-hidden focus-visible:bg-muted/60",
                      focused && !isSelected && "bg-muted/60",
                      isSelected
                        ? "border-primary bg-[var(--accent-soft)]"
                        : "border-border bg-card hover:bg-muted/40",
                    )}
                    {...metricRoving.getItemProps(index)}
                  >
                    {TrendIcon ? (
                      <span
                        aria-hidden
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          isSelected
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        <TrendIcon className="size-4" />
                      </span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "text-[13px] font-semibold leading-tight",
                          isSelected ? "text-primary" : "text-foreground",
                        )}
                      >
                        {metric.label}
                      </div>
                      {metric.subtitle ? (
                        <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                          {metric.subtitle}
                        </div>
                      ) : null}
                    </div>
                    {metric.unit ? (
                      <span
                        className={cn(
                          "font-mono text-[11px]",
                          isSelected ? "text-primary/80" : "text-muted-foreground",
                        )}
                      >
                        {metric.unit}
                      </span>
                    ) : null}
                  </button>
                </MotionItem>
              );
            })}
          </MotionStage>
        </div>

        {/* Target numeric input with a static unit suffix driven by the
            currently selected metric. Grey until a metric is chosen so
            the flow reads left-to-right. */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Target
          </p>
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors",
              selectedMetric
                ? "border-border bg-card"
                : "border-border bg-muted/40",
            )}
          >
            <Input
              type="number"
              inputMode="decimal"
              value={value.target === null ? "" : String(value.target)}
              onChange={(event) => setTarget(event.target.value)}
              placeholder={targetPlaceholder}
              aria-label="Target value"
              disabled={!selectedMetric}
              className="flex-1 border-0 bg-transparent px-0 text-[15px] font-semibold shadow-none focus-visible:ring-0"
            />
            {selectedMetric?.unit ? (
              <span className="text-[13px] font-medium text-muted-foreground">
                {selectedMetric.unit}
              </span>
            ) : null}
          </div>
        </div>

        {/* Timeframe chips. Horizontal roving so arrow keys feel natural. */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Timeframe
          </p>
          <div
            role="radiogroup"
            aria-label="Timeframe"
            className="flex flex-wrap gap-2"
          >
            {effectiveTimeframes.map((timeframe, index) => {
              const isSelected = timeframe === value.timeframe;
              return (
                <button
                  key={timeframe}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setTimeframe(timeframe)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors",
                    "outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted/60",
                  )}
                  {...timeframeRoving.getItemProps(index)}
                >
                  {timeframe}
                </button>
              );
            })}
          </div>
        </div>

        {summary ? <SuccessSummary>{summary}</SuccessSummary> : null}
      </div>
    </QuestionCard>
  );
}
