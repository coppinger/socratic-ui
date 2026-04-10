import { z } from "zod";

/**
 * Each Socratic UI component has two schemas:
 * - `*QuestionSchema` — the parameters the AI sends to *ask* the question.
 *   These describe the prompt and the available options. Suitable for use in
 *   a Vercel AI SDK `tool({ inputSchema })` definition.
 * - `*ResponseSchema` — the shape of the user's answer that flows back via
 *   `addToolResult`. Suitable for `outputSchema`.
 */

const optionSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
});

// ─── SingleSelect ────────────────────────────────────────────────────────────

export const singleSelectQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  options: z.array(optionSchema).min(2),
  freeformPlaceholder: z.string().optional(),
});

export const singleSelectResponseSchema = z.object({
  selected: z.string().nullable(),
  freeformText: z.string().optional(),
});

export type SingleSelectQuestion = z.infer<typeof singleSelectQuestionSchema>;
export type SingleSelectResponse = z.infer<typeof singleSelectResponseSchema>;

// ─── MultiSelect ─────────────────────────────────────────────────────────────

export const multiSelectQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  options: z.array(optionSchema).min(2),
  max: z.number().int().positive().default(3),
});

export const multiSelectResponseSchema = z.object({
  selected: z.array(z.string()),
});

export type MultiSelectQuestion = z.infer<typeof multiSelectQuestionSchema>;
export type MultiSelectResponse = z.infer<typeof multiSelectResponseSchema>;

// ─── PriorityRank ────────────────────────────────────────────────────────────

export const priorityRankQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  items: z.array(optionSchema).min(2),
});

export const priorityRankResponseSchema = z.object({
  /** Ordered list of item titles, highest priority first. */
  ranked: z.array(z.string()),
});

export type PriorityRankQuestion = z.infer<typeof priorityRankQuestionSchema>;
export type PriorityRankResponse = z.infer<typeof priorityRankResponseSchema>;

// ─── FillBlank ───────────────────────────────────────────────────────────────

const slotSchema = z.object({
  /** Stable identifier used as the key in the response object. */
  id: z.string(),
  placeholder: z.string(),
});

export const fillBlankQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  /**
   * Sentence template. Use `{slot-id}` as a placeholder for each blank, e.g.
   * "I want to build a {what} for {who} that helps them {outcome}."
   */
  template: z.string(),
  slots: z.array(slotSchema).min(1),
});

export const fillBlankResponseSchema = z.object({
  /** Map of slot id → user-entered value. */
  values: z.record(z.string(), z.string()),
});

export type FillBlankQuestion = z.infer<typeof fillBlankQuestionSchema>;
export type FillBlankResponse = z.infer<typeof fillBlankResponseSchema>;

// ─── NegationSelect ──────────────────────────────────────────────────────────

export const negationSelectQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  options: z.array(optionSchema).min(2),
});

export const negationSelectResponseSchema = z.object({
  /** Titles of the options the user has eliminated. */
  eliminated: z.array(z.string()),
});

export type NegationSelectQuestion = z.infer<
  typeof negationSelectQuestionSchema
>;
export type NegationSelectResponse = z.infer<
  typeof negationSelectResponseSchema
>;

// ─── Spectrum ────────────────────────────────────────────────────────────────

export const spectrumQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  /** Left pole of the slider (low end). */
  leftLabel: z.string(),
  leftDescription: z.string().optional(),
  /** Right pole of the slider (high end). */
  rightLabel: z.string(),
  rightDescription: z.string().optional(),
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().positive().default(1),
  /** Initial slider position. Defaults to the midpoint. */
  defaultValue: z.number().optional(),
});

export const spectrumResponseSchema = z.object({
  value: z.number(),
});

export type SpectrumQuestion = z.infer<typeof spectrumQuestionSchema>;
export type SpectrumResponse = z.infer<typeof spectrumResponseSchema>;

// ─── AgreementSpectrum ───────────────────────────────────────────────────────

const agreementStatementSchema = z.object({
  /** Stable identifier used as the key in the response object. */
  id: z.string(),
  text: z.string(),
  /**
   * Optional "% of others who agree" figure to render alongside the user's
   * answer for social comparison. 0-100.
   */
  crowd: z.number().min(0).max(100).optional(),
});

export const agreementSpectrumQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  statements: z.array(agreementStatementSchema).min(1),
  /**
   * Labels for the 5-point Likert scale, from "Strongly disagree" to
   * "Strongly agree". Defaults applied at component render.
   */
  scaleLabels: z.array(z.string()).length(5).optional(),
});

export const agreementSpectrumResponseSchema = z.object({
  /** Map of statement id → 0-4 scale index (0 = strongly disagree). */
  ratings: z.record(z.string(), z.number().int().min(0).max(4)),
});

export type AgreementSpectrumQuestion = z.infer<
  typeof agreementSpectrumQuestionSchema
>;
export type AgreementSpectrumResponse = z.infer<
  typeof agreementSpectrumResponseSchema
>;

// ─── OpenQuestions ───────────────────────────────────────────────────────────

const openQuestionPromptSchema = z.object({
  /** Stable identifier used as the key in the response object. */
  id: z.string(),
  text: z.string(),
  placeholder: z.string().optional(),
});

export const openQuestionsQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  prompts: z.array(openQuestionPromptSchema).min(1),
});

export const openQuestionsResponseSchema = z.object({
  /** Map of prompt id → user-entered text. */
  answers: z.record(z.string(), z.string()),
});

export type OpenQuestionsQuestion = z.infer<typeof openQuestionsQuestionSchema>;
export type OpenQuestionsResponse = z.infer<typeof openQuestionsResponseSchema>;

// ─── CardSort ────────────────────────────────────────────────────────────────

const cardSortBucketSchema = z.object({
  /** Stable identifier used as the key in the response bucket map. */
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  /**
   * Visual tone for the bucket. `affirm` is the accent / must-have
   * styling, `muted` is the out-of-scope styling, `neutral` is the
   * default middle-ground card. Maps to the component's internal
   * palette — don't leak CSS colors through the schema.
   */
  tone: z.enum(["affirm", "neutral", "muted"]).optional(),
});

const cardSortItemSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
});

export const cardSortQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  buckets: z.array(cardSortBucketSchema).min(2).max(5),
  items: z.array(cardSortItemSchema).min(2),
});

export const cardSortResponseSchema = z.object({
  /** Map of bucket id → titles of the items placed in that bucket. */
  buckets: z.record(z.string(), z.array(z.string())),
});

export type CardSortQuestion = z.infer<typeof cardSortQuestionSchema>;
export type CardSortResponse = z.infer<typeof cardSortResponseSchema>;

// ─── SpatialCanvas ───────────────────────────────────────────────────────────

const spatialCanvasItemSchema = z.object({
  /** Stable identifier used as the key in the response positions map. */
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
});

export const spatialCanvasQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  /** Horizontal axis label, e.g. "Effort". */
  xAxisLabel: z.string(),
  /** Vertical axis label, e.g. "Impact". */
  yAxisLabel: z.string(),
  /** Optional low/high end labels for the X axis. */
  xLowLabel: z.string().optional(),
  xHighLabel: z.string().optional(),
  /** Optional low/high end labels for the Y axis. */
  yLowLabel: z.string().optional(),
  yHighLabel: z.string().optional(),
  items: z.array(spatialCanvasItemSchema).min(2),
});

export const spatialCanvasResponseSchema = z.object({
  /**
   * Map of item id → normalized position on the canvas. Both axes run
   * from 0 (low) to 1 (high) — so `{ x: 1, y: 1 }` is high-effort,
   * high-impact (top right).
   */
  positions: z.record(
    z.string(),
    z.object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    }),
  ),
});

export type SpatialCanvasQuestion = z.infer<typeof spatialCanvasQuestionSchema>;
export type SpatialCanvasResponse = z.infer<typeof spatialCanvasResponseSchema>;

// ─── QuickEstimate ───────────────────────────────────────────────────────────

const quickEstimateDimensionSchema = z.object({
  /** Stable identifier used as the key in the response selections map. */
  id: z.string(),
  label: z.string(),
  options: z.array(optionSchema).min(2),
});

export const quickEstimateQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  /**
   * Two or three related dimensions (e.g. budget + timeline). Each
   * dimension is an independent single-select list.
   */
  dimensions: z.array(quickEstimateDimensionSchema).min(2).max(3),
});

export const quickEstimateResponseSchema = z.object({
  /** Map of dimension id → selected option title (or null if unset). */
  selections: z.record(z.string(), z.string().nullable()),
});

export type QuickEstimateQuestion = z.infer<typeof quickEstimateQuestionSchema>;
export type QuickEstimateResponse = z.infer<typeof quickEstimateResponseSchema>;

// ─── ConditionalBranch ───────────────────────────────────────────────────────

const conditionalBranchFollowUpSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("single-select"),
    question: z.string(),
    options: z.array(optionSchema).min(2),
  }),
  z.object({
    kind: z.literal("text"),
    question: z.string(),
    placeholder: z.string().optional(),
  }),
]);

const conditionalBranchOptionSchema = z.object({
  /** Stable identifier used as the key in the response follow-up map. */
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  followUp: conditionalBranchFollowUpSchema.optional(),
});

export const conditionalBranchQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  options: z.array(conditionalBranchOptionSchema).min(2).max(4),
});

export const conditionalBranchResponseSchema = z.object({
  /** Id of the primary option the user picked, or null if unanswered. */
  selectedId: z.string().nullable(),
  /**
   * The follow-up answer for the currently selected option. For a
   * single-select follow-up this is the sub-option title; for a text
   * follow-up it's the freeform string. Null when no follow-up exists
   * or hasn't been answered yet.
   */
  followUpValue: z.string().nullable(),
});

export type ConditionalBranchQuestion = z.infer<
  typeof conditionalBranchQuestionSchema
>;
export type ConditionalBranchResponse = z.infer<
  typeof conditionalBranchResponseSchema
>;

// ─── Matrix ──────────────────────────────────────────────────────────────────

const matrixRowSchema = z.object({
  /** Stable identifier used as the key in the response ratings map. */
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
});

export const matrixQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  rows: z.array(matrixRowSchema).min(1),
  /**
   * Ordered level labels from low (index 0) to high. Selected index
   * and every index below it render as "filled" in the UI, giving the
   * buttons a fill-bar feel.
   */
  levels: z.array(z.string()).min(2).max(6),
});

export const matrixResponseSchema = z.object({
  /** Map of row id → 0-based level index. */
  ratings: z.record(z.string(), z.number().int().min(0)),
});

export type MatrixQuestion = z.infer<typeof matrixQuestionSchema>;
export type MatrixResponse = z.infer<typeof matrixResponseSchema>;

// ─── GoalsNonGoals ───────────────────────────────────────────────────────────

const goalsNonGoalsPairSchema = z.object({
  goal: z.string(),
  nonGoal: z.string(),
});

export const goalsNonGoalsQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  goalPlaceholder: z.string().optional(),
  nonGoalPlaceholder: z.string().optional(),
  /** Upper bound on how many pairs the user can create. */
  maxPairs: z.number().int().positive().default(5),
  /**
   * Optional pre-filled pairs the user can edit or remove. The component
   * always renders at least one editable row, seeded from this list or
   * empty if omitted.
   */
  suggestions: z.array(goalsNonGoalsPairSchema).optional(),
});

export const goalsNonGoalsResponseSchema = z.object({
  /** Only complete (both fields non-empty) pairs are included. */
  pairs: z.array(goalsNonGoalsPairSchema),
});

export type GoalsNonGoalsQuestion = z.infer<typeof goalsNonGoalsQuestionSchema>;
export type GoalsNonGoalsResponse = z.infer<typeof goalsNonGoalsResponseSchema>;

// ─── UserStoryBuilder ────────────────────────────────────────────────────────

const userStoryBuilderStorySchema = z.object({
  persona: z.string(),
  action: z.string(),
  outcome: z.string(),
});

export const userStoryBuilderQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  /** Suggestion chips for the "As a ___" slot. */
  personas: z.array(z.string()).default([]),
  /** Suggestion chips for the "I want ___" slot. */
  actions: z.array(z.string()).default([]),
  /** Suggestion chips for the "so that ___" slot. */
  outcomes: z.array(z.string()).default([]),
  /** Upper bound on how many stories the user can create. */
  maxStories: z.number().int().positive().default(5),
});

export const userStoryBuilderResponseSchema = z.object({
  /** Only complete (all three slots filled) stories are included. */
  stories: z.array(userStoryBuilderStorySchema),
});

export type UserStoryBuilderQuestion = z.infer<
  typeof userStoryBuilderQuestionSchema
>;
export type UserStoryBuilderResponse = z.infer<
  typeof userStoryBuilderResponseSchema
>;

// ─── MetricTarget ────────────────────────────────────────────────────────────

const metricTargetMetricSchema = z.object({
  /** Stable identifier used as the key in the response. */
  id: z.string(),
  label: z.string(),
  subtitle: z.string().optional(),
  /** Optional unit appended after the target number, e.g. "%" or "users". */
  unit: z.string().optional(),
  /**
   * Whether higher is better ("increase") or lower is better
   * ("decrease"). Drives the direction arrow in the UI.
   */
  direction: z.enum(["increase", "decrease"]).optional(),
});

export const metricTargetQuestionSchema = z.object({
  question: z.string(),
  subtitle: z.string().optional(),
  metrics: z.array(metricTargetMetricSchema).min(2),
  /** Selectable timeframe chips. Defaults applied at render. */
  timeframes: z.array(z.string()).optional(),
  /** Placeholder for the numeric target input. */
  targetPlaceholder: z.string().optional(),
});

export const metricTargetResponseSchema = z.object({
  /** Id of the metric the user picked, or null if unset. */
  metricId: z.string().nullable(),
  /** Numeric target the user typed, or null if unset. */
  target: z.number().nullable(),
  /** Selected timeframe string, or null if unset. */
  timeframe: z.string().nullable(),
});

export type MetricTargetQuestion = z.infer<typeof metricTargetQuestionSchema>;
export type MetricTargetResponse = z.infer<typeof metricTargetResponseSchema>;

// ─── QuestionSequence ────────────────────────────────────────────────────────
//
// A sequence chains other Socratic questions and asks them one at a time.
// Items are strictly the single-question kinds — sequences cannot nest
// sequences (kept the type shallow so `SocraticNode` stays a flat
// discriminated union).

const questionSequenceItemNodeSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("single-select"),
    props: singleSelectQuestionSchema,
  }),
  z.object({
    kind: z.literal("multi-select"),
    props: multiSelectQuestionSchema,
  }),
  z.object({
    kind: z.literal("priority-rank"),
    props: priorityRankQuestionSchema,
  }),
  z.object({
    kind: z.literal("fill-blank"),
    props: fillBlankQuestionSchema,
  }),
  z.object({
    kind: z.literal("negation-select"),
    props: negationSelectQuestionSchema,
  }),
  z.object({
    kind: z.literal("open-questions"),
    props: openQuestionsQuestionSchema,
  }),
  z.object({
    kind: z.literal("spectrum"),
    props: spectrumQuestionSchema,
  }),
  z.object({
    kind: z.literal("agreement-spectrum"),
    props: agreementSpectrumQuestionSchema,
  }),
  z.object({
    kind: z.literal("card-sort"),
    props: cardSortQuestionSchema,
  }),
  z.object({
    kind: z.literal("spatial-canvas"),
    props: spatialCanvasQuestionSchema,
  }),
  z.object({
    kind: z.literal("quick-estimate"),
    props: quickEstimateQuestionSchema,
  }),
  z.object({
    kind: z.literal("conditional-branch"),
    props: conditionalBranchQuestionSchema,
  }),
  z.object({
    kind: z.literal("matrix"),
    props: matrixQuestionSchema,
  }),
  z.object({
    kind: z.literal("goals-non-goals"),
    props: goalsNonGoalsQuestionSchema,
  }),
  z.object({
    kind: z.literal("user-story-builder"),
    props: userStoryBuilderQuestionSchema,
  }),
  z.object({
    kind: z.literal("metric-target"),
    props: metricTargetQuestionSchema,
  }),
]);

export const questionSequenceQuestionSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        node: questionSequenceItemNodeSchema,
      }),
    )
    .min(1),
});

export const questionSequenceResponseSchema = z.object({
  /** Map of item id → answer shape of the corresponding child question. */
  answers: z.record(z.string(), z.unknown()),
});

export type QuestionSequenceQuestion = z.infer<
  typeof questionSequenceQuestionSchema
>;
export type QuestionSequenceResponse = z.infer<
  typeof questionSequenceResponseSchema
>;
export type QuestionSequenceItemNode = z.infer<
  typeof questionSequenceItemNodeSchema
>;
