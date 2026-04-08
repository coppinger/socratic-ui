import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { docsNav } from "@/config/docs";
import { Button } from "@/components/ui/button";

export default function DocsIntroPage() {
  const componentsGroup = docsNav.find((group) => group.title === "Components");

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="scroll-mt-24 text-4xl font-bold tracking-tight text-foreground">
          Introduction
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Socratic UI is a set of structured input components for AI chat
          interfaces. Instead of asking users to answer everything in freeform
          text, these components replace open questions with low-friction,
          low-cognitive-load elicitation patterns.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2
          id="why-structured-inputs"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          Why structured inputs?
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Freeform text is high-effort for users and lossy for models. A
          well-designed picker, rank, or fill-in-the-blank pattern produces
          cleaner signal, respects the user&apos;s attention, and leaves the
          AI with structured data it can reason over directly.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2
          id="components"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          Components
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {componentsGroup?.items.length ?? 0} components are available today.
          Each one is a controlled input with a matching Zod schema — use the
          schemas to wire the components up to tool calls in the Vercel AI SDK.
        </p>
        <div>
          <Button
            render={<Link href="/docs/components" />}
            variant="default"
            className="gap-1.5"
          >
            Explore components
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
