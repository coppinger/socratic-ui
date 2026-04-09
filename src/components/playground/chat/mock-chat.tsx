"use client";

import { AudioLines, ChevronDown, Inbox, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import type { SocraticMotion } from "@/components/socratic-ui/motion";
import type { OptionIconSettings } from "@/components/socratic-ui/shared";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  Density,
  PlaygroundScenario,
  SocraticNode,
} from "@/playground/registry";

import { SocraticRenderer } from "./socratic-renderer";

const LOADING_MS = 700;

export function MockChat({
  scenario,
  liveNode,
  motion,
  density,
  animationKey,
  optionIcons,
}: {
  scenario: PlaygroundScenario;
  liveNode: SocraticNode;
  motion: SocraticMotion;
  density: Density;
  animationKey: string;
  optionIcons: OptionIconSettings;
}) {
  // Socratic messages are hoisted out of the transcript — once the fake
  // "generating" window elapses, the live component replaces the textarea
  // composer below.
  const textMessages = scenario.messages.filter(
    (message) => message.kind === "text",
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-9 shrink-0 items-center border-b border-border px-4 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Mock chat
      </div>
      <Conversation className="flex-1">
        <ConversationContent
          className={cn(
            "mx-auto w-full max-w-2xl",
            density === "compact" ? "gap-4 py-6" : "gap-8 py-10",
          )}
        >
          {textMessages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <p className="leading-relaxed">{message.text}</p>
              </MessageContent>
            </Message>
          ))}
          <GeneratingShimmer key={animationKey} />
        </ConversationContent>
      </Conversation>
      <div
        className={cn(
          "mx-auto w-full max-w-2xl px-4",
          density === "compact" ? "pb-3 pt-1" : "pb-5 pt-2",
        )}
      >
        <ComposerSlot
          key={animationKey}
          liveNode={liveNode}
          motion={motion}
          optionIcons={optionIcons}
        />
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Claude is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}

// Parent keys this on `animationKey` so remount naturally resets the timer
// on replay / scenario change / prop tweak — no reset-in-effect needed.
function GeneratingShimmer() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), LOADING_MS);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Spinner className="size-3.5" />
      <span className="animate-pulse font-mono text-[11px] uppercase tracking-wider">
        Generating questions
      </span>
    </div>
  );
}

// Parent keys this on `animationKey` so remount resets the swap timer.
// w-[95%] mirrors the assistant Message's max-w-[95%] (ai-elements/message.tsx)
// so the composer-slot contents align with the assistant bubbles above it.
function ComposerSlot({
  liveNode,
  motion,
  optionIcons,
}: {
  liveNode: SocraticNode;
  motion: SocraticMotion;
  optionIcons: OptionIconSettings;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), LOADING_MS);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-[95%]">
      {ready ? (
        <SocraticRenderer
          node={liveNode}
          motion={motion}
          optionIcons={optionIcons}
        />
      ) : (
        <TextareaComposer />
      )}
    </div>
  );
}

// Visual-only textarea composer shown *before* the socratic component takes
// over. Submit is preventDefault'd because the playground is fixture-driven,
// but the affordances exist so the initial surface reads as a complete chat.
function TextareaComposer() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="rounded-2xl border border-border px-3 pb-2 pt-3 shadow-sm">
        <Textarea
          rows={1}
          placeholder="Reply…"
          aria-label="Message"
          className="min-h-0 w-full resize-none border-0 bg-transparent px-1 pb-2 pt-0.5 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Attach"
              className="text-muted-foreground"
              disabled
            >
              <Plus className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Add context"
              className="bg-accent text-foreground"
              disabled
            >
              <Inbox className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Model picker"
              disabled
            >
              <span className="text-foreground">Opus 4.6</span>
              <span className="text-muted-foreground">Extended</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Voice input"
              className="text-muted-foreground"
              disabled
            >
              <AudioLines className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
