import { CopyCodeButton } from "./copy-code-button";

export interface CodeBlockProps {
  /** Pre-rendered HTML from Shiki. */
  highlightedCode: string;
  /** Raw source used by the copy button. */
  rawCode: string;
}

/**
 * Standalone syntax-highlighted code block with a copy button. Unlike
 * `ComponentPreview`, there's no Preview/Code tab pair — use this when the
 * code is the whole point (Usage snippets, install commands, etc.).
 */
export function CodeBlock({ highlightedCode, rawCode }: CodeBlockProps) {
  return (
    <div className="not-prose relative rounded-xl border border-border bg-[#f6f8fa]">
      <CopyCodeButton code={rawCode} />
      <div
        className="max-h-[560px] overflow-auto rounded-xl p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
}
