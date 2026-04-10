/**
 * Socratic UI — shadcn custom registry manifest.
 *
 * Each entry maps a component slug to the files it ships and its
 * external dependencies. The route handler at `/r/[name]` reads this
 * manifest, inlines source file contents, and returns the JSON that
 * `npx shadcn add` expects.
 */

// ── Shared files included in every component ────────────────────────
// These are lightweight primitives (motion helpers, question-card
// chrome, keyboard navigation, etc.) that every input relies on.
// Bundling them per-component keeps each install self-contained —
// if two components share a file the second write is idempotent.

const sharedFiles = [
  "socratic-ui/motion.ts",
  "socratic-ui/schemas.ts",
  "socratic-ui/shared.tsx",
  "socratic-ui/shared/icon-settings.ts",
  "socratic-ui/shared/section-label.tsx",
  "socratic-ui/shared/success-summary.tsx",
  "socratic-ui/shared/motion-primitives.tsx",
  "socratic-ui/shared/question-card.tsx",
  "socratic-ui/shared/option-row.tsx",
  "socratic-ui/shared/option-card.tsx",
  "socratic-ui/shared/keyboard-hint.tsx",
  "socratic-ui/shared/sequence-context.ts",
  "socratic-ui/shared/use-sequence-question.ts",
  "socratic-ui/shared/use-roving-focus.ts",
] as const;

// Base npm deps that every component needs (via shared files).
const baseDeps = ["clsx", "tailwind-merge", "zod", "motion"] as const;

// Base shadcn registry deps that shared files import.
const baseRegistryDeps = ["card", "button"] as const;

export interface RegistryComponent {
  name: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  /** Paths relative to src/components/ */
  files: string[];
}

function define(
  name: string,
  description: string,
  opts: {
    files?: string[];
    deps?: string[];
    registryDeps?: string[];
  } = {},
): RegistryComponent {
  return {
    name,
    description,
    dependencies: [
      ...baseDeps,
      ...(opts.deps ?? []),
    ],
    registryDependencies: [
      ...baseRegistryDeps,
      ...(opts.registryDeps ?? []),
    ],
    files: [
      ...(opts.files ?? [`socratic-ui/${name}.tsx`]),
      ...sharedFiles,
    ],
  };
}

export const registry: Record<string, RegistryComponent> = {
  "single-select": define("single-select", "Single-choice question with optional freeform input", {
    deps: ["lucide-react"],
  }),
  "multi-select": define("multi-select", "Multi-choice question with configurable max selections"),
  "priority-rank": define("priority-rank", "Drag-to-reorder priority ranking", {
    deps: ["lucide-react"],
  }),
  "fill-blank": define("fill-blank", "Sentence template with inline fill-in-the-blank slots"),
  "negation-select": define("negation-select", "Eliminate options by crossing them out"),
  "open-questions": define("open-questions", "Multiple free-text prompts", {
    registryDeps: ["textarea"],
  }),
  spectrum: define("spectrum", "Continuous slider between two poles", {
    registryDeps: ["slider"],
  }),
  "agreement-spectrum": define("agreement-spectrum", "Likert-scale agreement ratings for multiple statements"),
  "card-sort": define("card-sort", "Drag items into labelled buckets", {
    deps: ["lucide-react"],
  }),
  "spatial-canvas": define("spatial-canvas", "Place items on a 2D axis grid"),
  "quick-estimate": define("quick-estimate", "Multi-dimension quick estimation with preset options", {
    deps: ["lucide-react"],
  }),
  "conditional-branch": define("conditional-branch", "Branching question with context-dependent follow-ups", {
    deps: ["lucide-react"],
    registryDeps: ["textarea"],
  }),
  matrix: define("matrix", "Rate multiple rows across ordered levels"),
  "goals-non-goals": define("goals-non-goals", "Paired goals / non-goals list builder", {
    deps: ["lucide-react"],
    registryDeps: ["input"],
  }),
  "user-story-builder": define("user-story-builder", "As-a / I-want / So-that story composer", {
    deps: ["lucide-react"],
    registryDeps: ["input"],
  }),
  "metric-target": define("metric-target", "Pick a metric, set a numeric target and timeframe", {
    deps: ["lucide-react"],
    registryDeps: ["input"],
  }),
  "question-sequence": define("question-sequence", "Multi-step question wizard that chains other Socratic inputs", {
    files: [
      "socratic-ui/question-sequence.tsx",
      "socratic-ui/sequence-shell.tsx",
      "socratic-ui/use-question-sequence.ts",
    ],
  }),
};

/** All registered component slugs. */
export const registryNames = Object.keys(registry);
