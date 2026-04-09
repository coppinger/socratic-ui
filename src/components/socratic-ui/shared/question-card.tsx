"use client";

import * as React from "react";
import { ArrowRight, ArrowUp, ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SocraticMotion } from "../motion";
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
        <div className="px-7 pt-6 pb-4">{header}</div>
        <div className="flex flex-col">{children}</div>
        {footer !== undefined ? (
          <div className="px-7 pt-4 pb-5">{footer}</div>
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
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
        {number ? (
          <span className="mb-1.5 inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {number}
          </span>
        ) : null}
        <h3 className="text-[20px] font-semibold leading-snug text-foreground">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {sequence ? (
        <div className="flex shrink-0 items-center gap-1 pt-1 font-mono text-[13px] text-muted-foreground">
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
          {sequence.onClose ? (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Close"
              onClick={sequence.onClose}
              className="ml-1"
            >
              <X />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function QuestionFooter({
  statusText,
}: {
  statusText?: React.ReactNode;
}) {
  const sequence = useSequenceContext();
  if (!sequence && !statusText) return null;
  return (
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
                // Terminal step uses the warm-orange primary; intermediate
                // steps use an inverted fg/bg to match the Claude screenshots.
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
  );
}
