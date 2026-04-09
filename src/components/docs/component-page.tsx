import * as React from "react";
import Link from "next/link";
import { SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SocraticKind } from "@/playground/registry";

import { CodeBlock } from "./code-block";
import { ComponentPreview } from "./component-preview";
import { PropsTable, type PropDef } from "./props-table";

export interface ComponentPageProps {
  title: string;
  description: string;
  preview: React.ReactNode;
  /** Pre-rendered HTML string from Shiki. */
  highlightedCode: string;
  /** Raw TSX source used by the copy button. */
  rawCode: string;
  /** Optional usage snippet (pre-highlighted HTML). */
  highlightedUsage?: string;
  /** Raw usage code for the copy button. */
  rawUsage?: string;
  props: PropDef[];
  playgroundSlug?: SocraticKind;
}

/**
 * Server component shell for a single component page. Composes the
 * header, preview+code tab block, usage snippet, and API reference table.
 */
export function ComponentPage({
  title,
  description,
  preview,
  highlightedCode,
  rawCode,
  highlightedUsage,
  rawUsage,
  props,
  playgroundSlug,
}: ComponentPageProps) {
  return (
    <article className="flex w-full min-w-0 flex-col gap-10">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="scroll-mt-24 text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {playgroundSlug ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/playground?component=${playgroundSlug}`} />}
            >
              <SlidersHorizontalIcon />
              Open in playground
            </Button>
          ) : null}
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2
          id="preview"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          Preview
        </h2>
        <ComponentPreview
          highlightedCode={highlightedCode}
          rawCode={rawCode}
        >
          {preview}
        </ComponentPreview>
      </section>

      {highlightedUsage && rawUsage ? (
        <section className="flex flex-col gap-4">
          <h2
            id="usage"
            className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
          >
            Usage
          </h2>
          <CodeBlock highlightedCode={highlightedUsage} rawCode={rawUsage} />
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2
          id="api-reference"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          API Reference
        </h2>
        <PropsTable props={props} />
      </section>
    </article>
  );
}
