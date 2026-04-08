"use client";

import { ArrowUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import type { SocraticMotion } from "@/components/socratic-ui/motion";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  Density,
  PlaygroundMessage,
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
}: {
  scenario: PlaygroundScenario;
  liveNode: SocraticNode;
  motion: SocraticMotion;
  density: Density;
  animationKey: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <Conversation className="flex-1">
        <ConversationContent
          className={cn(
            "mx-auto w-full max-w-2xl",
            density === "compact" ? "gap-4 py-6" : "gap-8 py-10",
          )}
        >
          {scenario.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              liveNode={liveNode}
              motion={motion}
              animationKey={animationKey}
            />
          ))}
        </ConversationContent>
      </Conversation>
      <MockChatInput density={density} />
    </div>
  );
}

function ChatMessage({
  message,
  liveNode,
  motion,
  animationKey,
}: {
  message: PlaygroundMessage;
  liveNode: SocraticNode;
  motion: SocraticMotion;
  animationKey: string;
}) {
  if (message.kind === "text") {
    return (
      <Message from={message.role}>
        <MessageContent>
          <p className="leading-relaxed">{message.text}</p>
        </MessageContent>
      </Message>
    );
  }
  // Keyed on `animationKey` so any replay trigger remounts the subtree,
  // restarting the loading shimmer and the entry animation.
  return (
    <SocraticChatMessage
      key={animationKey}
      liveNode={liveNode}
      motion={motion}
    />
  );
}

function SocraticChatMessage({
  liveNode,
  motion,
}: {
  liveNode: SocraticNode;
  motion: SocraticMotion;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOADING_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <Message from="assistant" className="w-full">
      {loading ? (
        <LoadingShimmer />
      ) : (
        <SocraticRenderer node={liveNode} motion={motion} />
      )}
    </Message>
  );
}

function LoadingShimmer() {
  return (
    <div className="flex items-center gap-2 py-2 text-muted-foreground">
      <Spinner className="size-3.5" />
      <span className="animate-pulse font-mono text-[11px] uppercase tracking-wider">
        Generating questions
      </span>
    </div>
  );
}

// Visual-only — submit is preventDefault'd because the playground is
// fixture-driven, but the affordances exist so the chat surface reads
// as a complete chat UI.
function MockChatInput({ density }: { density: Density }) {
  return (
    <div
      className={cn(
        "border-t border-border",
        density === "compact" ? "px-4 py-3" : "px-6 py-4",
      )}
    >
      <form
        onSubmit={(event) => event.preventDefault()}
        className="mx-auto flex w-full max-w-2xl items-end gap-2"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Attach"
          className="mb-0.5 shrink-0 text-muted-foreground"
          disabled
        >
          <Plus className="size-4" />
        </Button>
        <Textarea
          rows={1}
          placeholder="Reply to keep the conversation going…"
          className="min-h-0 flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-sm shadow-none focus-visible:ring-0"
          aria-label="Message"
        />
        <Button
          type="submit"
          size="icon-sm"
          aria-label="Send"
          className="mb-0.5 shrink-0"
          disabled
        >
          <ArrowUp className="size-4" />
        </Button>
      </form>
    </div>
  );
}
