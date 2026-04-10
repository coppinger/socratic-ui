"use client";

import { useState } from "react";

import {
  GoalsNonGoals,
  type GoalsNonGoalsPair,
} from "@/components/socratic-ui/goals-non-goals";

export function GoalsNonGoalsDemo() {
  const [value, setValue] = useState<GoalsNonGoalsPair[]>([
    {
      goal: "Ship a working MVP in 4 weeks",
      nonGoal: "Nail the visual polish",
    },
    {
      goal: "Validate the core user journey",
      nonGoal: "Support every edge-case workflow",
    },
  ]);

  return (
    <GoalsNonGoals
      number="11"
      question="Goals & non-goals"
      subtitle="For each goal, name a non-goal — what you're explicitly choosing not to do."
      goalPlaceholder="e.g. ship a working MVP in 4 weeks"
      nonGoalPlaceholder="e.g. nail the visual polish"
      maxPairs={5}
      value={value}
      onChange={setValue}
    />
  );
}
