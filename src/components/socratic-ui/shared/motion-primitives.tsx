"use client";

import * as React from "react";
import { motion as m } from "motion/react";

import { Card } from "@/components/ui/card";

import { defaultMotion, type SocraticMotion } from "../motion";

// ─── Motion primitives ───────────────────────────────────────────────────────
//
// Hard invariant: when `motion` is undefined every primitive below must
// render the same JSX it would have without us. The docs demos at
// /docs/components/* depend on this — they never pass `motion`, and we
// rely on the no-op branches here to keep their trees byte-identical.

export function MotionStage({
  motion: anim,
  children,
  className,
}: {
  motion?: SocraticMotion;
  children: React.ReactNode;
  className?: string;
}) {
  if (!anim?.enabled) {
    // Single-child stages (FillBlank) call without a className and rely
    // on the fragment branch so we don't add an extra wrapper div.
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return <>{children}</>;
  }
  const stagger = anim.stagger ?? defaultMotion.stagger;
  const delay = anim.delay ?? defaultMotion.delay;
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function MotionCard({
  motion: anim,
  children,
  className,
}: {
  motion?: SocraticMotion;
  children: React.ReactNode;
  className?: string;
}) {
  if (!anim?.enabled) {
    return <Card className={className}>{children}</Card>;
  }
  const duration = anim.duration ?? defaultMotion.duration;
  const delay = anim.delay ?? defaultMotion.delay;
  const ease = anim.ease ?? defaultMotion.ease;
  return (
    <m.div
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: duration * 1.2, ease, delay }}
    >
      <Card className={className}>{children}</Card>
    </m.div>
  );
}

export function MotionItem({
  motion: anim,
  children,
}: {
  motion?: SocraticMotion;
  children: React.ReactNode;
}) {
  if (!anim?.enabled) {
    return <>{children}</>;
  }
  const duration = anim.duration ?? defaultMotion.duration;
  const ease = anim.ease ?? defaultMotion.ease;
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: 6 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease },
        },
      }}
    >
      {children}
    </m.div>
  );
}
