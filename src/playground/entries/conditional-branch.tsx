"use client";

import { useState } from "react";

import {
  ConditionalBranch,
  type ConditionalBranchValue,
} from "@/components/socratic-ui/conditional-branch";
import { conditionalBranchQuestionSchema } from "@/components/socratic-ui/schemas";

import type { PlaygroundEntry, RendererProps } from "../registry";

function ConditionalBranchRenderer({
  node,
  motion,
}: RendererProps<"conditional-branch">) {
  // Reset when the option ids change (edge-case swaps).
  const optionsKey = node.props.options.map((o) => o.id).join(",");
  const [value, setValue] = useState<ConditionalBranchValue>({
    selectedId: null,
    followUpValue: null,
  });

  return (
    <ConditionalBranch
      key={optionsKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      options={node.props.options}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const conditionalBranchEntry: PlaygroundEntry<"conditional-branch"> = {
  slug: "conditional-branch",
  label: "Conditional Branch",
  description:
    "Binary or four-way branch with a tailored follow-up per path — the assistant adapts to the first answer.",
  schema: conditionalBranchQuestionSchema,
  Renderer: ConditionalBranchRenderer,
  tweakers: [
    { kind: "string", path: "question", label: "Question", multiline: true },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
  ],
  scenarios: [
    {
      id: "existing-users",
      label: "Existing users?",
      description: "Fork the rest of the interview on one yes/no.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "I'm about to scope this project and I want to make sure we're asking the right follow-up questions.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "conditional-branch",
            props: {
              question: "Do you have existing users?",
              subtitle: "Your answer shapes the next question.",
              options: [
                {
                  id: "yes",
                  title: "Yes",
                  subtitle: "We have people actively using the product",
                  followUp: {
                    kind: "single-select",
                    question: "Roughly how many active users?",
                    options: [
                      {
                        title: "< 100",
                        subtitle: "Early adopters, tight feedback loop",
                      },
                      {
                        title: "100–1k",
                        subtitle: "Growing base, starting to see patterns",
                      },
                      {
                        title: "1k–10k",
                        subtitle: "Real traction, scaling concerns emerge",
                      },
                      {
                        title: "10k+",
                        subtitle: "Established product, optimisation mode",
                      },
                    ],
                  },
                },
                {
                  id: "no",
                  title: "No",
                  subtitle: "Pre-launch or still building",
                  followUp: {
                    kind: "text",
                    question: "Who's your initial target audience?",
                    placeholder: "Describe your target users…",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "no-followup",
      label: "No follow-ups",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          options: node.props.options.map(
            ({ id, title, subtitle }) => ({ id, title, subtitle }),
          ),
        },
      }),
    },
    {
      id: "four-way",
      label: "4-way branch",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          question: "What type of product?",
          subtitle: undefined,
          options: [
            {
              id: "web",
              title: "Web app",
              subtitle: "Browser-based SaaS or tool",
              followUp: {
                kind: "text",
                question: "Primary user?",
                placeholder: "e.g. business users, consumers…",
              },
            },
            {
              id: "mobile",
              title: "Mobile app",
              subtitle: "iOS, Android, or cross-platform",
              followUp: {
                kind: "single-select",
                question: "Which platform?",
                options: [
                  { title: "iOS only" },
                  { title: "Android only" },
                  { title: "Cross-platform" },
                ],
              },
            },
            {
              id: "api",
              title: "API / dev tool",
              subtitle: "Developer-facing",
              followUp: {
                kind: "text",
                question: "What's the integration model?",
                placeholder: "REST, SDK, CLI…",
              },
            },
            {
              id: "internal",
              title: "Internal tool",
              subtitle: "Ops, no public UI",
            },
          ],
        },
      }),
    },
  ],
};
