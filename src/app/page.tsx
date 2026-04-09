import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { docsNav } from "@/config/docs";

export default function LandingPage() {
  const components =
    docsNav.find((group) => group.title === "Components")?.items ?? [];

  return (
    <div className="flex min-h-svh flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground"
        >
          socratic/ui
        </Link>
        <div className="flex items-center gap-1">
          <Button
            render={<Link href="/docs" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            Docs
          </Button>
          <Button
            render={<Link href="/playground" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            Playground
          </Button>
          <ThemeToggle className="ml-1" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-6 pt-16 pb-24">
        <section className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Structured inputs for AI chat
          </span>
          <h1 className="max-w-3xl text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Replace freeform prompts with{" "}
            <span className="text-primary">low-friction elicitation</span>.
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Socratic UI is a set of structured input components for AI chat
            interfaces. Instead of asking users to type everything, these
            patterns produce cleaner signal for the model and respect the
            user&apos;s attention.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button
              render={<Link href="/docs" />}
              nativeButton={false}
              variant="default"
              size="lg"
              className="gap-1.5"
            >
              Read the docs
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button
              render={<Link href="/playground" />}
              nativeButton={false}
              variant="outline"
              size="lg"
            >
              Open playground
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="components"
              className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
            >
              {components.length} components
            </h2>
            <Link
              href="/docs/components"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <li key={component.href}>
                <Link
                  href={component.href}
                  className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent-soft"
                >
                  <span className="text-sm font-semibold tracking-tight text-foreground">
                    {component.title}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {component.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>
            Built on{" "}
            <Link
              href="https://ui.shadcn.com"
              className="hover:text-foreground"
            >
              shadcn/ui
            </Link>{" "}
            and the Vercel AI SDK.
          </span>
          <span className="font-mono">socratic/ui</span>
        </div>
      </footer>
    </div>
  );
}
