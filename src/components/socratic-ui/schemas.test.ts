import { describe, expect, it } from "vitest";

import {
  cardSortQuestionSchema,
  cardSortResponseSchema,
  conditionalBranchQuestionSchema,
  conditionalBranchResponseSchema,
  fillBlankQuestionSchema,
  fillBlankResponseSchema,
  goalsNonGoalsQuestionSchema,
  goalsNonGoalsResponseSchema,
  matrixQuestionSchema,
  matrixResponseSchema,
  metricTargetQuestionSchema,
  metricTargetResponseSchema,
  multiSelectQuestionSchema,
  multiSelectResponseSchema,
  negationSelectQuestionSchema,
  negationSelectResponseSchema,
  priorityRankQuestionSchema,
  priorityRankResponseSchema,
  quickEstimateQuestionSchema,
  quickEstimateResponseSchema,
  singleSelectQuestionSchema,
  singleSelectResponseSchema,
  spatialCanvasQuestionSchema,
  spatialCanvasResponseSchema,
  userStoryBuilderQuestionSchema,
  userStoryBuilderResponseSchema,
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

describe("cardSort", () => {
  it("accepts a valid question", () => {
    const result = cardSortQuestionSchema.safeParse({
      question: "Sort these",
      buckets: [
        { id: "must", title: "Must" },
        { id: "nice", title: "Nice" },
      ],
      items: [{ title: "Auth" }, { title: "Search" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects fewer than 2 buckets", () => {
    const result = cardSortQuestionSchema.safeParse({
      question: "Sort",
      buckets: [{ id: "only", title: "Only" }],
      items: [{ title: "A" }, { title: "B" }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty buckets map in the response", () => {
    expect(cardSortResponseSchema.safeParse({ buckets: {} }).success).toBe(
      true,
    );
    expect(
      cardSortResponseSchema.safeParse({
        buckets: { must: ["Auth"], nice: [] },
      }).success,
    ).toBe(true);
  });
});

describe("spatialCanvas", () => {
  it("accepts a valid question", () => {
    const result = spatialCanvasQuestionSchema.safeParse({
      question: "Map these",
      xAxisLabel: "Effort",
      yAxisLabel: "Impact",
      items: [
        { id: "a", title: "A" },
        { id: "b", title: "B" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects positions outside 0-1 in the response", () => {
    expect(
      spatialCanvasResponseSchema.safeParse({
        positions: { a: { x: 1.5, y: 0.2 } },
      }).success,
    ).toBe(false);
    expect(
      spatialCanvasResponseSchema.safeParse({
        positions: { a: { x: 0.5, y: 0.5 } },
      }).success,
    ).toBe(true);
  });
});

describe("quickEstimate", () => {
  it("requires at least 2 dimensions", () => {
    const ok = quickEstimateQuestionSchema.safeParse({
      question: "Q",
      dimensions: [
        {
          id: "a",
          label: "A",
          options: [{ title: "x" }, { title: "y" }],
        },
        {
          id: "b",
          label: "B",
          options: [{ title: "x" }, { title: "y" }],
        },
      ],
    });
    expect(ok.success).toBe(true);
    const bad = quickEstimateQuestionSchema.safeParse({
      question: "Q",
      dimensions: [
        {
          id: "a",
          label: "A",
          options: [{ title: "x" }, { title: "y" }],
        },
      ],
    });
    expect(bad.success).toBe(false);
  });

  it("accepts nullable selections in the response", () => {
    expect(
      quickEstimateResponseSchema.safeParse({
        selections: { a: "x", b: null },
      }).success,
    ).toBe(true);
  });
});

describe("conditionalBranch", () => {
  it("accepts options with mixed follow-ups", () => {
    const result = conditionalBranchQuestionSchema.safeParse({
      question: "Q",
      options: [
        {
          id: "yes",
          title: "Yes",
          followUp: {
            kind: "single-select",
            question: "How many?",
            options: [{ title: "few" }, { title: "many" }],
          },
        },
        {
          id: "no",
          title: "No",
          followUp: {
            kind: "text",
            question: "Why not?",
          },
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts nullable values in the response", () => {
    expect(
      conditionalBranchResponseSchema.safeParse({
        selectedId: null,
        followUpValue: null,
      }).success,
    ).toBe(true);
    expect(
      conditionalBranchResponseSchema.safeParse({
        selectedId: "yes",
        followUpValue: "few",
      }).success,
    ).toBe(true);
  });
});

describe("matrix", () => {
  it("accepts a valid question", () => {
    const result = matrixQuestionSchema.safeParse({
      question: "Q",
      rows: [
        { id: "fe", title: "Frontend" },
        { id: "be", title: "Backend" },
      ],
      levels: ["None", "Basic", "Solid"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects fewer than 2 levels", () => {
    const result = matrixQuestionSchema.safeParse({
      question: "Q",
      rows: [{ id: "fe", title: "Frontend" }],
      levels: ["Only"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty ratings map in the response", () => {
    expect(matrixResponseSchema.safeParse({ ratings: {} }).success).toBe(
      true,
    );
    expect(
      matrixResponseSchema.safeParse({ ratings: { fe: 2, be: 0 } }).success,
    ).toBe(true);
  });
});

describe("goalsNonGoals", () => {
  it("defaults maxPairs to 5", () => {
    const result = goalsNonGoalsQuestionSchema.safeParse({ question: "Q" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.maxPairs).toBe(5);
  });

  it("accepts an empty pairs list in the response", () => {
    expect(goalsNonGoalsResponseSchema.safeParse({ pairs: [] }).success).toBe(
      true,
    );
    expect(
      goalsNonGoalsResponseSchema.safeParse({
        pairs: [{ goal: "g", nonGoal: "ng" }],
      }).success,
    ).toBe(true);
  });
});

describe("userStoryBuilder", () => {
  it("defaults personas/actions/outcomes to empty arrays", () => {
    const result = userStoryBuilderQuestionSchema.safeParse({ question: "Q" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.personas).toEqual([]);
      expect(result.data.actions).toEqual([]);
      expect(result.data.outcomes).toEqual([]);
      expect(result.data.maxStories).toBe(5);
    }
  });

  it("accepts an empty stories list in the response", () => {
    expect(
      userStoryBuilderResponseSchema.safeParse({ stories: [] }).success,
    ).toBe(true);
    expect(
      userStoryBuilderResponseSchema.safeParse({
        stories: [{ persona: "p", action: "a", outcome: "o" }],
      }).success,
    ).toBe(true);
  });
});

describe("metricTarget", () => {
  it("accepts a valid question", () => {
    const result = metricTargetQuestionSchema.safeParse({
      question: "Q",
      metrics: [
        { id: "a", label: "A" },
        { id: "b", label: "B", direction: "decrease" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid direction", () => {
    const result = metricTargetQuestionSchema.safeParse({
      question: "Q",
      metrics: [
        { id: "a", label: "A", direction: "sideways" },
        { id: "b", label: "B" },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("accepts nullable values in the response", () => {
    expect(
      metricTargetResponseSchema.safeParse({
        metricId: null,
        target: null,
        timeframe: null,
      }).success,
    ).toBe(true);
    expect(
      metricTargetResponseSchema.safeParse({
        metricId: "a",
        target: 50,
        timeframe: "90 days",
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
      [
        cardSortQuestionSchema,
        {
          question: "Q",
          buckets: [
            { id: "a", title: "A" },
            { id: "b", title: "B" },
          ],
          items: [{ title: "x" }, { title: "y" }],
        },
      ],
      [
        spatialCanvasQuestionSchema,
        {
          question: "Q",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          items: [
            { id: "a", title: "A" },
            { id: "b", title: "B" },
          ],
        },
      ],
      [
        quickEstimateQuestionSchema,
        {
          question: "Q",
          dimensions: [
            {
              id: "a",
              label: "A",
              options: [{ title: "x" }, { title: "y" }],
            },
            {
              id: "b",
              label: "B",
              options: [{ title: "x" }, { title: "y" }],
            },
          ],
        },
      ],
      [
        conditionalBranchQuestionSchema,
        {
          question: "Q",
          options: [
            { id: "yes", title: "Yes" },
            { id: "no", title: "No" },
          ],
        },
      ],
      [
        matrixQuestionSchema,
        {
          question: "Q",
          rows: [{ id: "r", title: "R" }],
          levels: ["Lo", "Hi"],
        },
      ],
      [
        goalsNonGoalsQuestionSchema,
        { question: "Q" },
      ],
      [
        userStoryBuilderQuestionSchema,
        { question: "Q" },
      ],
      [
        metricTargetQuestionSchema,
        {
          question: "Q",
          metrics: [
            { id: "a", label: "A" },
            { id: "b", label: "B" },
          ],
        },
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
