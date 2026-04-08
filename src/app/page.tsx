"use client";

import { useState } from "react";

import { FillBlank } from "@/components/socratic-ui/fill-blank";
import { MultiSelect } from "@/components/socratic-ui/multi-select";
import { NegationSelect } from "@/components/socratic-ui/negation-select";
import { PriorityRank } from "@/components/socratic-ui/priority-rank";
import { SingleSelect } from "@/components/socratic-ui/single-select";

export default function Home() {
  const [setup, setSetup] = useState<string | null>(null);
  const [setupNote, setSetupNote] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [ranking, setRanking] = useState<string[]>([]);
  const [pitch, setPitch] = useState<Record<string, string>>({});
  const [eliminated, setEliminated] = useState<string[]>([]);

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-5 pb-20 pt-10">
        <header className="mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Socratic UI
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Structured input components for AI chat interfaces. The five core
            patterns below replace freeform text with low-friction, low-cognitive-load
            elicitation.
          </p>
        </header>

        <SingleSelect
          number="01"
          question="How are you building this product?"
          subtitle="Pick the option that best describes your setup"
          options={[
            {
              title: "Solo founder",
              subtitle: "Building alone, wearing all the hats",
            },
            {
              title: "Co-founding team",
              subtitle: "Two or more founders splitting responsibilities",
            },
            {
              title: "Within a company",
              subtitle: "Internal team with organisational backing",
            },
            {
              title: "Agency / consultancy",
              subtitle: "Building on behalf of a client",
            },
          ]}
          value={setup}
          onChange={setSetup}
          freeformPlaceholder="Any extra context…"
          freeformValue={setupNote}
          onFreeformChange={setSetupNote}
        />

        <MultiSelect
          number="02"
          question="What matters most right now?"
          subtitle="Choose up to 3 priorities to guide your plan"
          max={3}
          options={[
            { title: "Speed to market", subtitle: "Ship fast, iterate later" },
            { title: "Polish & quality", subtitle: "Get it right the first time" },
            { title: "Low cost", subtitle: "Minimise spend wherever possible" },
            { title: "Scalability", subtitle: "Build for growth from day one" },
            { title: "Simplicity", subtitle: "Keep the stack and scope tight" },
            {
              title: "Flexibility",
              subtitle: "Stay adaptable as requirements shift",
            },
          ]}
          value={priorities}
          onChange={setPriorities}
        />

        <PriorityRank
          number="03"
          question="Rank what to tackle first"
          subtitle="Tap items in the order you'd prioritise them"
          items={[
            {
              title: "User research",
              subtitle: "Validate the problem and audience",
            },
            {
              title: "Technical architecture",
              subtitle: "Choose stack, infra, and data model",
            },
            {
              title: "Visual design",
              subtitle: "Define the brand and UI direction",
            },
            { title: "Go-to-market", subtitle: "Plan distribution and launch" },
            { title: "Funding", subtitle: "Secure budget or investment" },
          ]}
          value={ranking}
          onChange={setRanking}
        />

        <FillBlank
          number="04"
          question="Describe it in one sentence"
          subtitle="Fill in the blanks — constraints spark clarity"
          template="I want to build a {what} for {who} that helps them {outcome}."
          slots={[
            { id: "what", placeholder: "product type" },
            { id: "who", placeholder: "audience" },
            { id: "outcome", placeholder: "outcome" },
          ]}
          value={pitch}
          onChange={setPitch}
        />

        <NegationSelect
          number="05"
          question="What do you definitely NOT need?"
          subtitle="Eliminate what's out of scope — it's easier than picking what's in"
          options={[
            {
              title: "Complex onboarding",
              subtitle: "Multi-step signup, email verification, profile setup",
            },
            {
              title: "Social features",
              subtitle: "Feeds, comments, likes, followers",
            },
            {
              title: "Real-time collaboration",
              subtitle: "Live cursors, co-editing, presence",
            },
            {
              title: "Offline support",
              subtitle: "Service workers, local storage sync",
            },
            {
              title: "Internationalisation",
              subtitle: "Multi-language, RTL, locale-aware formatting",
            },
            {
              title: "Custom reporting",
              subtitle: "User-defined dashboards and data views",
            },
          ]}
          value={eliminated}
          onChange={setEliminated}
        />
      </main>
    </div>
  );
}
