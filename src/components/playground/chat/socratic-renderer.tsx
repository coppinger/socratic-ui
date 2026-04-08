"use client";

import type { ComponentType } from "react";

import type { SocraticMotion } from "@/components/socratic-ui/motion";
import {
  getAnyPlaygroundEntry,
  type SocraticNode,
} from "@/playground/registry";

export function SocraticRenderer({
  node,
  motion,
}: {
  node: SocraticNode;
  motion?: SocraticMotion;
}) {
  const entry = getAnyPlaygroundEntry(node.kind);
  if (!entry) return null;
  // Variance escape hatch: each entry's Renderer is typed against its
  // specific kind, but the union form (`AnyPlaygroundEntry`) collapses
  // it to a contravariant intersection that no narrowed `node` will
  // satisfy. The runtime contract is sound — `node.kind` matches the
  // entry we just looked up — so we erase to a type-loose component.
  const Renderer = entry.Renderer as ComponentType<{
    node: SocraticNode;
    motion?: SocraticMotion;
  }>;
  return <Renderer node={node} motion={motion} />;
}
