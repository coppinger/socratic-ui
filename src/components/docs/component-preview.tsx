"use client";

import * as React from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { CopyCodeButton } from "./copy-code-button";

export interface ComponentPreviewProps {
  /**
   * Pre-rendered HTML from Shiki. Rendered via `dangerouslySetInnerHTML` —
   * trusted input because we produce it ourselves at build time.
   */
  highlightedCode: string;
  /** Raw TSX source used by the copy button. */
  rawCode: string;
  /** Live preview content (usually a Demo component). */
  children: React.ReactNode;
}

export function ComponentPreview({
  highlightedCode,
  rawCode,
  children,
}: ComponentPreviewProps) {
  return (
    <Tabs defaultValue="preview" className="not-prose w-full gap-0">
      <div className="flex items-center justify-between border-b border-border">
        <TabsList variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="preview"
        className="relative flex min-h-[380px] items-start justify-center rounded-b-xl border border-border border-t-0 bg-background p-6 sm:p-10"
      >
        <div className="w-full max-w-xl">{children}</div>
      </TabsContent>
      <TabsContent
        value="code"
        className="relative rounded-b-xl border border-border border-t-0 bg-[#f6f8fa]"
      >
        <CopyCodeButton code={rawCode} />
        <div
          className="max-h-[560px] overflow-auto rounded-b-xl p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:font-mono"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </TabsContent>
    </Tabs>
  );
}
