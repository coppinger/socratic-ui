import type { ComponentType } from "react";
import type { z } from "zod";

import type { SocraticMotion } from "@/components/socratic-ui/motion";
import type { OptionIconSettings } from "@/components/socratic-ui/shared";
import type {
  agreementSpectrumQuestionSchema,
  fillBlankQuestionSchema,
  multiSelectQuestionSchema,
  negationSelectQuestionSchema,
  openQuestionsQuestionSchema,
  priorityRankQuestionSchema,
  questionSequenceQuestionSchema,
  singleSelectQuestionSchema,
  spectrumQuestionSchema,
} from "@/components/socratic-ui/schemas";

import { agreementSpectrumEntry } from "./entries/agreement-spectrum";
import { fillBlankEntry } from "./entries/fill-blank";
import { multiSelectEntry } from "./entries/multi-select";
import { negationSelectEntry } from "./entries/negation-select";
import { openQuestionsEntry } from "./entries/open-questions";
import { priorityRankEntry } from "./entries/priority-rank";
import { questionSequenceEntry } from "./entries/question-sequence";
import { singleSelectEntry } from "./entries/single-select";
import { spectrumEntry } from "./entries/spectrum";

export type SocraticNode =
  | { kind: "single-select"; props: z.infer<typeof singleSelectQuestionSchema> }
  | { kind: "multi-select"; props: z.infer<typeof multiSelectQuestionSchema> }
  | { kind: "priority-rank"; props: z.infer<typeof priorityRankQuestionSchema> }
  | { kind: "fill-blank"; props: z.infer<typeof fillBlankQuestionSchema> }
  | {
      kind: "negation-select";
      props: z.infer<typeof negationSelectQuestionSchema>;
    }
  | {
      kind: "open-questions";
      props: z.infer<typeof openQuestionsQuestionSchema>;
    }
  | { kind: "spectrum"; props: z.infer<typeof spectrumQuestionSchema> }
  | {
      kind: "agreement-spectrum";
      props: z.infer<typeof agreementSpectrumQuestionSchema>;
    }
  | {
      kind: "question-sequence";
      props: z.infer<typeof questionSequenceQuestionSchema>;
    };

export type SocraticKind = SocraticNode["kind"];

export type SocraticNodeOf<K extends SocraticKind> = Extract<
  SocraticNode,
  { kind: K }
>;

/** Compact / comfy spacing toggle, threaded through the playground UI. */
export type Density = "comfy" | "compact";

export type PlaygroundMessage =
  | { id: string; role: "user" | "assistant"; kind: "text"; text: string }
  | { id: string; role: "assistant"; kind: "socratic"; node: SocraticNode };

export type PlaygroundScenario = {
  id: string;
  label: string;
  description?: string;
  /** Tweakers and edge-case presets target the *first* socratic message. */
  messages: PlaygroundMessage[];
};

// Tweaker fields are an explicit allowlist per entry — no Zod reflection.
// Component owners opt in to which fields are editable, so the rail UI
// stays decoupled from internal prop shape.
export type TweakerField =
  | {
      kind: "string";
      path: string;
      label: string;
      placeholder?: string;
      multiline?: boolean;
    }
  | {
      kind: "number";
      path: string;
      label: string;
      min?: number;
      max?: number;
      step?: number;
    }
  | { kind: "boolean"; path: string; label: string }
  | {
      kind: "enum";
      path: string;
      label: string;
      options: { value: string; label: string }[];
    }
  | {
      kind: "options-list";
      path: string;
      label: string;
      min?: number;
      max?: number;
    };

export type EdgeCasePreset<K extends SocraticKind = SocraticKind> = {
  id: string;
  label: string;
  /** Composes on top of the active scenario node. */
  apply: (node: SocraticNodeOf<K>) => SocraticNodeOf<K>;
};

/**
 * Type-erased preset shape used at the rail boundary. The runtime
 * contract is unchanged — `apply(currentNode)` returns a same-kind node
 * — but the cast escapes the variance trap on `EdgeCasePreset<K>`.
 */
export type ErasedEdgeCasePreset = {
  id: string;
  label: string;
  apply: (node: SocraticNode) => SocraticNode;
};

export type RendererProps<K extends SocraticKind> = {
  node: SocraticNodeOf<K>;
  motion?: SocraticMotion;
  /** Playground-only display settings (not part of the Zod schema). */
  optionIcons?: OptionIconSettings;
};

export type PlaygroundEntry<K extends SocraticKind> = {
  slug: K;
  label: string;
  description: string;
  schema: z.ZodType<SocraticNodeOf<K>["props"]>;
  Renderer: ComponentType<RendererProps<K>>;
  tweakers: TweakerField[];
  scenarios: PlaygroundScenario[];
  edgeCases: EdgeCasePreset<K>[];
};

/**
 * Discriminated union of every concrete entry. We can't use
 * `PlaygroundEntry<SocraticKind>` because `Renderer` is contravariant in
 * K — collapsing to the union breaks per-kind assignment.
 */
export type AnyPlaygroundEntry =
  | PlaygroundEntry<"single-select">
  | PlaygroundEntry<"multi-select">
  | PlaygroundEntry<"priority-rank">
  | PlaygroundEntry<"fill-blank">
  | PlaygroundEntry<"negation-select">
  | PlaygroundEntry<"open-questions">
  | PlaygroundEntry<"spectrum">
  | PlaygroundEntry<"agreement-spectrum">
  | PlaygroundEntry<"question-sequence">;

// `Partial` so adding the remaining 12 components later requires only
// defining a new entry and dropping it in.
export const playgroundRegistry: Partial<{
  [K in SocraticKind]: PlaygroundEntry<K>;
}> = {
  "single-select": singleSelectEntry,
  "multi-select": multiSelectEntry,
  "priority-rank": priorityRankEntry,
  "fill-blank": fillBlankEntry,
  "negation-select": negationSelectEntry,
  "open-questions": openQuestionsEntry,
  spectrum: spectrumEntry,
  "agreement-spectrum": agreementSpectrumEntry,
  "question-sequence": questionSequenceEntry,
};

export function getPlaygroundEntries(): ReadonlyArray<AnyPlaygroundEntry> {
  return Object.values(playgroundRegistry).filter(
    (entry): entry is AnyPlaygroundEntry => entry !== undefined,
  );
}

export function getPlaygroundEntry<K extends SocraticKind>(
  slug: K,
): PlaygroundEntry<K> | undefined {
  return playgroundRegistry[slug] as PlaygroundEntry<K> | undefined;
}

/**
 * Erases the kind to the union form. Use when the slug is only known at
 * runtime — `getPlaygroundEntry<SocraticKind>` collapses `Renderer` to a
 * contravariant union and stops being assignable.
 */
export function getAnyPlaygroundEntry(
  slug: SocraticKind,
): AnyPlaygroundEntry | undefined {
  return playgroundRegistry[slug];
}
