import type { PropDef } from "./props-table";

/** Props common to every Socratic UI component; spread at the end of a page's `props` array. */
export const commonProps: PropDef[] = [
  {
    name: "motion",
    type: "SocraticMotion",
    description:
      "Opt-in entrance animation config. Omit for static rendering; pass `{ enabled: true }` (or a preset from `motion.ts`) to animate in on mount.",
  },
];

/** Single `number` prop — the leading question number shown in the header. */
export const numberProp: PropDef = {
  name: "number",
  type: "string",
  description: "Optional leading question number, e.g. \"01\".",
};

/**
 * Additional props accepted by components that support per-option icons
 * (single-select, multi-select, negation-select, priority-rank).
 */
export const iconLayoutProps: PropDef[] = [
  {
    name: "iconLayout",
    type: "\"horizontal\" | \"vertical\"",
    defaultValue: "\"horizontal\"",
    description:
      "How icons align relative to their label. `vertical` stacks icon above label for a tile-style layout.",
  },
  {
    name: "iconAlignment",
    type: "\"left\" | \"center\"",
    defaultValue: "\"left\"",
    description:
      "Horizontal alignment of the icon within its slot. Only applies when `iconLayout` is `\"vertical\"`.",
  },
];
