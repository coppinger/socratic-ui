"use client";

import { useState } from "react";

import {
  UserStoryBuilder,
  type UserStory,
} from "@/components/socratic-ui/user-story-builder";

export function UserStoryBuilderDemo() {
  const [value, setValue] = useState<UserStory[]>([]);

  return (
    <UserStoryBuilder
      number="12"
      question="Write out a few user stories"
      subtitle="Tap a suggestion chip to fill a slot, or type your own."
      personas={["new user", "power user", "admin", "returning customer"]}
      actions={[
        "sign up quickly",
        "see all my past orders",
        "invite my team",
        "export my data",
      ]}
      outcomes={[
        "I can start using the product in under a minute",
        "I can audit my history",
        "we can collaborate without switching tools",
        "I'm not locked in",
      ]}
      maxStories={5}
      value={value}
      onChange={setValue}
    />
  );
}
