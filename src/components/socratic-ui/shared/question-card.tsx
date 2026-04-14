"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SocraticMotion } from "../motion";
import type { KeyboardHint } from "./keyboard-hint";
import { MotionCard } from "./motion-primitives";
import { useSequenceContext } from "./sequence-context";

export function QuestionCard({
  header,
  children,
  footer,
  motion,
  className,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  motion?: SocraticMotion;
  className?: string;
}) {
  return (
    <MotionCard motion={motion} className={cn("gap-0 py-0", className)}>
      <CardContent className="flex flex-col gap-0 px-0">
        <div className="border-b border-border px-7 pt-6 pb-4">{header}</div>
        <div className="flex flex-col">{children}</div>
        {footer !== undefined ? (
          <div className="border-t border-border px-7 py-4">{footer}</div>
        ) : null}
      </CardContent>
    </MotionCard>
  );
}

export function QuestionHeader({
  title,
  subtitle,
  number,
}: {
  title: string;
  subtitle?: string;
  number?: string;
}) {
  const sequence = useSequenceContext();
  return (
    <div className="min-w-0">
      {number ? (
        <span className="mb-1.5 inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {number}
        </span>
      ) : null}
      <div className="flex items-center justify-between gap-6">
        <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <div className="flex shrink-0 items-center gap-1 font-mono text-[13px] text-muted-foreground">
          {sequence ? (
            <>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Previous question"
                onClick={sequence.onPrevious}
                disabled={sequence.step <= 1 || !sequence.onPrevious}
              >
                <ChevronLeft />
              </Button>
              <span className="px-1 tabular-nums">
                {sequence.step} of {sequence.total}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Next question"
                onClick={sequence.onNext}
                disabled={!sequence.onNext || !sequence.canSubmit}
              >
                <ChevronRight />
              </Button>
            </>
          ) : null}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="More options"
            className={sequence ? "ml-1" : undefined}
          >
            <MoreHorizontal className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={sequence?.onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
      {subtitle ? (
        <p className="mt-1 text-sm leading-snug text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function QuestionFooter({
  statusText,
  hints,
}: {
  statusText?: React.ReactNode;
  hints?: KeyboardHint[];
}) {
  const sequence = useSequenceContext();
  const hasControls = !!sequence || !!statusText;
  if (!hasControls && !hints) return null;
  return (
    <div className="flex flex-col gap-3">
      {hints ? (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {hints.map((hint, index) => (
            <React.Fragment key={index}>
              {index > 0 ? (
                <span aria-hidden className="text-muted-foreground/40">
                  ·
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-foreground/80">
                  {hint.keys}
                </span>
                <span>{hint.label}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      ) : null}
      {hasControls ? (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 text-[13px] text-muted-foreground">
            {statusText}
          </div>
          {sequence ? (
            <div className="flex shrink-0 items-center gap-2">
              {sequence.onSkip ? (
                <Button variant="outline" size="lg" onClick={sequence.onSkip}>
                  Skip
                </Button>
              ) : null}
              {sequence.onNext ? (
                <Button
                  size="lg"
                  onClick={sequence.onNext}
                  disabled={!sequence.canSubmit}
                  aria-label={sequence.isTerminal ? "Submit" : "Next question"}
                  className={cn(
                    "w-10 px-0",
                    sequence.isTerminal
                      ? undefined
                      : "bg-foreground text-background hover:bg-foreground/90",
                  )}
                >
                  {sequence.isTerminal ? <ArrowUp /> : <ArrowRight />}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
