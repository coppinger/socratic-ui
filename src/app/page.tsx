import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { docsNav } from "@/config/docs";

const GITHUB_URL = "https://github.com/coppinger/socratic-ui";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.17a11.03 11.03 0 0 1 5.79 0c2.2-1.48 3.17-1.17 3.17-1.17.63 1.59.23 2.77.11 3.06.74.8 1.19 1.82 1.19 3.08 0 4.42-2.7 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.15 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

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
          <Button
            render={
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Socratic UI on GitHub"
              />
            }
            nativeButton={false}
            variant="ghost"
            size="icon-sm"
            className="ml-1"
          >
            <GitHubIcon className="size-4" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-6 pt-16 pb-24">
        <section className="flex flex-col items-start gap-6">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Open source on GitHub
            <ArrowRightIcon className="size-3 -translate-x-0.5 transition-transform group-hover:translate-x-0" />
          </a>
          <h1 className="max-w-3xl text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Replace freeform prompts with{" "}
            <span className="text-primary">low-friction elicitation</span>.
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Socratic UI is an open source set of structured input components
            for AI chat interfaces. Instead of asking users to type everything,
            these patterns produce cleaner signal for the model and respect
            the user&apos;s attention.
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
            <Button
              render={
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                />
              }
              nativeButton={false}
              variant="ghost"
              size="lg"
              className="gap-1.5"
            >
              <GitHubIcon className="size-4" />
              Star on GitHub
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
            Open source. Built on{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-foreground"
            >
              shadcn/ui
            </a>{" "}
            and the Vercel AI SDK.
          </span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 font-mono hover:text-foreground"
          >
            <GitHubIcon className="size-3.5" />
            coppinger/socratic-ui
          </a>
        </div>
      </footer>
    </div>
  );
}
