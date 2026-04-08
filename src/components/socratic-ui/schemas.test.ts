import { describe, expect, it } from "vitest";

import {
  fillBlankQuestionSchema,
  fillBlankResponseSchema,
  multiSelectQuestionSchema,
  multiSelectResponseSchema,
  negationSelectQuestionSchema,
  negationSelectResponseSchema,
  priorityRankQuestionSchema,
  priorityRankResponseSchema,
  singleSelectQuestionSchema,
  singleSelectResponseSchema,
} from "./schemas";

describe("singleSelect", () => {
  it("accepts a minimal valid question", () => {
    const result = singleSelectQuestionSchema.safeParse({
      question: "Pick one",
      options: [{ title: "A" }, { title: "B" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a question with fewer than 2 options", () => {
    const result = singleSelectQuestionSchema.safeParse({
      question: "Pick one",
      options: [{ title: "A" }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts both selected and null in the response", () => {
    expect(
      singleSelectResponseSchema.safeParse({ selected: "A" }).success,
    ).toBe(true);
    expect(
      singleSelectResponseSchema.safeParse({ selected: null }).success,
    ).toBe(true);
    expect(
      singleSelectResponseSchema.safeParse({
        selected: "A",
        freeformText: "extra",
      }).success,
    ).toBe(true);
  });
});

describe("multiSelect", () => {
  it("defaults max to 3 when omitted", () => {
    const result = multiSelectQuestionSchema.safeParse({
      question: "Pick a few",
      options: [{ title: "A" }, { title: "B" }, { title: "C" }],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.max).toBe(3);
  });

  it("respects an explicit max", () => {
    const result = multiSelectQuestionSchema.safeParse({
      question: "Pick up to 5",
      options: [{ title: "A" }, { title: "B" }],
      max: 5,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.max).toBe(5);
  });

  it("rejects a non-positive max", () => {
    const result = multiSelectQuestionSchema.safeParse({
      question: "Pick up to ?",
      options: [{ title: "A" }, { title: "B" }],
      max: 0,
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty selection in the response", () => {
    expect(
      multiSelectResponseSchema.safeParse({ selected: [] }).success,
    ).toBe(true);
    expect(
      multiSelectResponseSchema.safeParse({ selected: ["A", "B"] }).success,
    ).toBe(true);
  });
});

describe("priorityRank", () => {
  it("accepts a valid question with items", () => {
    const result = priorityRankQuestionSchema.safeParse({
      question: "Rank these",
      items: [{ title: "A" }, { title: "B" }, { title: "C" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a question with fewer than 2 items", () => {
    const result = priorityRankQuestionSchema.safeParse({
      question: "Rank these",
      items: [{ title: "A" }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty ranking in the response", () => {
    expect(
      priorityRankResponseSchema.safeParse({ ranked: [] }).success,
    ).toBe(true);
  });
});

describe("fillBlank", () => {
  it("accepts a question with a template and slots", () => {
    const result = fillBlankQuestionSchema.safeParse({
      question: "Describe it",
      template: "I want to build a {what} for {who}.",
      slots: [
        { id: "what", placeholder: "product type" },
        { id: "who", placeholder: "audience" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a question with no slots", () => {
    const result = fillBlankQuestionSchema.safeParse({
      question: "Describe it",
      template: "I want to build a thing.",
      slots: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a string→string record in the response", () => {
    expect(
      fillBlankResponseSchema.safeParse({
        values: { what: "tool", who: "devs" },
      }).success,
    ).toBe(true);
    expect(
      fillBlankResponseSchema.safeParse({ values: {} }).success,
    ).toBe(true);
  });
});

describe("negationSelect", () => {
  it("accepts a valid question", () => {
    const result = negationSelectQuestionSchema.safeParse({
      question: "What's not needed?",
      options: [{ title: "A" }, { title: "B" }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty eliminated list in the response", () => {
    expect(
      negationSelectResponseSchema.safeParse({ eliminated: [] }).success,
    ).toBe(true);
    expect(
      negationSelectResponseSchema.safeParse({
        eliminated: ["A", "B"],
      }).success,
    ).toBe(true);
  });
});

describe("round-trips", () => {
  it("re-parses the parsed output of every question schema", () => {
    const cases = [
      [
        singleSelectQuestionSchema,
        { question: "Q", options: [{ title: "A" }, { title: "B" }] },
      ],
      [
        multiSelectQuestionSchema,
        { question: "Q", options: [{ title: "A" }, { title: "B" }], max: 2 },
      ],
      [
        priorityRankQuestionSchema,
        { question: "Q", items: [{ title: "A" }, { title: "B" }] },
      ],
      [
        fillBlankQuestionSchema,
        {
          question: "Q",
          template: "{what}",
          slots: [{ id: "what", placeholder: "p" }],
        },
      ],
      [
        negationSelectQuestionSchema,
        { question: "Q", options: [{ title: "A" }, { title: "B" }] },
      ],
    ] as const;

    for (const [schema, input] of cases) {
      const first = schema.safeParse(input);
      expect(first.success, `parse: ${JSON.stringify(input)}`).toBe(true);
      if (!first.success) continue;
      const second = schema.safeParse(first.data);
      expect(second.success, `re-parse: ${JSON.stringify(first.data)}`).toBe(
        true,
      );
    }
  });
});
