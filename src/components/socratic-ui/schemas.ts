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
