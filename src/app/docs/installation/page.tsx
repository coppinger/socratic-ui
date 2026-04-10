import { CodeBlock } from "@/components/docs/code-block";
import { highlight } from "@/lib/highlight";

const registrySnippet = `// components.json
{
  "registries": {
    "@socratic": "https://socraticui.com/r/{name}.json"
  }
}`;

const installSnippet = `npx shadcn add @socratic/single-select`;

const installMultipleSnippet = `npx shadcn add @socratic/single-select @socratic/multi-select @socratic/priority-rank`;

const toolSnippet = `import { tool } from "ai";
import {
  singleSelectQuestionSchema,
  singleSelectResponseSchema,
} from "@/components/socratic-ui/schemas";

const tools = {
  askSingleSelect: tool({
    description: "Ask the user to pick one option from a list",
    parameters: singleSelectQuestionSchema,
  }),
};`;

const rendererSnippet = `import { SingleSelect } from "@/components/socratic-ui/single-select";

// Inside your chat message renderer, when the tool call matches:
<SingleSelect
  question={toolCall.args.question}
  options={toolCall.args.options}
  value={selected}
  onChange={(value) => {
    setSelected(value);
    addToolResult({
      toolCallId: toolCall.toolCallId,
      result: { selected: value },
    });
  }}
/>`;

const allComponentsSnippet = `npx shadcn add \\
  @socratic/single-select \\
  @socratic/multi-select \\
  @socratic/priority-rank \\
  @socratic/fill-blank \\
  @socratic/negation-select \\
  @socratic/open-questions \\
  @socratic/spectrum \\
  @socratic/agreement-spectrum \\
  @socratic/card-sort \\
  @socratic/spatial-canvas \\
  @socratic/quick-estimate \\
  @socratic/conditional-branch \\
  @socratic/matrix \\
  @socratic/goals-non-goals \\
  @socratic/user-story-builder \\
  @socratic/metric-target \\
  @socratic/question-sequence`;

export default async function InstallationPage() {
  const [
    highlightedRegistry,
    highlightedInstall,
    highlightedInstallMultiple,
    highlightedTool,
    highlightedRenderer,
    highlightedAll,
  ] = await Promise.all([
    highlight(registrySnippet, "ts"),
    highlight(installSnippet, "bash"),
    highlight(installMultipleSnippet, "bash"),
    highlight(toolSnippet, "tsx"),
    highlight(rendererSnippet, "tsx"),
    highlight(allComponentsSnippet, "bash"),
  ]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="scroll-mt-24 text-4xl font-bold tracking-tight text-foreground">
          Installation
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Socratic UI components are distributed as a shadcn custom registry.
          Source files are copied into your project — no npm package to install.
        </p>
      </header>

      {/* ── 1. Add the registry ─────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h2
          id="add-registry"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          1. Add the registry
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Open your project&apos;s{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            components.json
          </code>{" "}
          and add the Socratic registry:
        </p>
        <CodeBlock
          rawCode={registrySnippet}
          highlightedCode={highlightedRegistry}
        />
      </section>

      {/* ── 2. Install components ───────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h2
          id="install-components"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          2. Install components
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Install the components you need. Each one is self-contained — install
          as many or as few as your project requires.
        </p>
        <CodeBlock
          rawCode={installSnippet}
          highlightedCode={highlightedInstall}
        />
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          You can install multiple at once:
        </p>
        <CodeBlock
          rawCode={installMultipleSnippet}
          highlightedCode={highlightedInstallMultiple}
        />
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This copies source files into{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            components/socratic-ui/
          </code>{" "}
          and auto-installs any npm dependencies (clsx, tailwind-merge, zod,
          motion) and shadcn primitives (card, button, etc.) that the components
          need.
        </p>
      </section>

      {/* ── 3. Wire up with AI SDK ──────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h2
          id="ai-sdk"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          3. Wire up with the AI SDK
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every component has a matching Zod schema pair in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            components/socratic-ui/schemas.ts
          </code>
          . Use the question schema as a tool&apos;s{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            parameters
          </code>{" "}
          so the model can call it:
        </p>
        <CodeBlock rawCode={toolSnippet} highlightedCode={highlightedTool} />
      </section>

      {/* ── 4. Render in your chat ──────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h2
          id="render"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          4. Render in your chat UI
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          When the model invokes the tool, render the matching component and feed
          the user&apos;s answer back via{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            addToolResult
          </code>
          :
        </p>
        <CodeBlock
          rawCode={rendererSnippet}
          highlightedCode={highlightedRenderer}
        />
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The response schema ({" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            singleSelectResponseSchema
          </code>
          ) documents the shape the model receives back. Every component follows
          the same pattern: question schema in, response schema out.
        </p>
      </section>

      {/* ── All components ──────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h2
          id="all-components"
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          All components
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          To install every Socratic UI component at once:
        </p>
        <CodeBlock
          rawCode={allComponentsSnippet}
          highlightedCode={highlightedAll}
        />
      </section>
    </div>
  );
}
