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

// ─── QuestionSequence ────────────────────────────────────────────────────────
//
// A sequence chains other Socratic questions and asks them one at a time.
// Items are strictly the five single-question kinds — sequences cannot
// nest sequences (kept the type shallow so `SocraticNode` stays a flat
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
