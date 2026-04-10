"use client";

import { useState } from "react";

import { userStoryBuilderQuestionSchema } from "@/components/socratic-ui/schemas";
import {
  UserStoryBuilder,
  type UserStory,
} from "@/components/socratic-ui/user-story-builder";

import type { PlaygroundEntry, RendererProps } from "../registry";

function UserStoryBuilderRenderer({
  node,
  motion,
}: RendererProps<"user-story-builder">) {
  // Reset when suggestion sets change.
  const suggestionKey = [
    ...(node.props.personas ?? []),
    "|",
    ...(node.props.actions ?? []),
    "|",
    ...(node.props.outcomes ?? []),
  ].join(",");
  const [value, setValue] = useState<UserStory[]>([]);

  return (
    <UserStoryBuilder
      key={suggestionKey}
      question={node.props.question}
      subtitle={node.props.subtitle}
      personas={node.props.personas}
      actions={node.props.actions}
      outcomes={node.props.outcomes}
      maxStories={node.props.maxStories}
      value={value}
      onChange={setValue}
      motion={motion}
    />
  );
}

export const userStoryBuilderEntry: PlaygroundEntry<"user-story-builder"> = {
  slug: "user-story-builder",
  label: "User Story Builder",
  description:
    "Compose \"As a ___, I want ___, so that ___\" stories with chip suggestions per slot.",
  schema: userStoryBuilderQuestionSchema,
  Renderer: UserStoryBuilderRenderer,
  tweakers: [
    { kind: "string", path: "question", label: "Question", multiline: true },
    {
      kind: "string",
      path: "subtitle",
      label: "Subtitle",
      placeholder: "(none)",
    },
    {
      kind: "number",
      path: "maxStories",
      label: "Max stories",
      min: 1,
      max: 10,
      step: 1,
    },
  ],
  scenarios: [
    {
      id: "pm-stories",
      label: "PM user stories",
      description: "Spin up acceptance-criteria-ready user stories.",
      messages: [
        {
          id: "u1",
          role: "user",
          kind: "text",
          text: "Help me write some proper user stories for this spec before I forget what we're actually building for.",
        },
        {
          id: "a1",
          role: "assistant",
          kind: "socratic",
          node: {
            kind: "user-story-builder",
            props: {
              question: "Write out a few user stories",
              subtitle:
                "Tap a suggestion chip to fill a slot, or type your own.",
              personas: [
                "new user",
                "power user",
                "admin",
                "returning customer",
              ],
              actions: [
                "sign up quickly",
                "see all my past orders",
                "invite my team",
                "export my data",
              ],
              outcomes: [
                "I can start using the product in under a minute",
                "I can audit my history",
                "we can collaborate without switching tools",
                "I'm not locked in",
              ],
              maxStories: 5,
            },
          },
        },
      ],
    },
  ],
  edgeCases: [
    {
      id: "no-suggestions",
      label: "No suggestions",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          personas: [],
          actions: [],
          outcomes: [],
        },
      }),
    },
    {
      id: "max-one",
      label: "Max 1 story",
      apply: (node) => ({
        ...node,
        props: {
          ...node.props,
          maxStories: 1,
        },
      }),
    },
  ],
};
