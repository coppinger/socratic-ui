import Link from "next/link";
import { ArrowRight, ArrowRightIcon, PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const GITHUB_URL = "https://github.com/coppinger/socratic-ui";

type Contributor = { login: string; avatar_url: string; html_url: string };

async function getContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/coppinger/socratic-ui/contributors?per_page=20",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

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

export default async function LandingPage() {
  const contributors = await getContributors();

  return (
    <div className="flex min-h-svh flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
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

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center gap-12 px-6 pt-8 pb-24 lg:gap-16">
        {/* Left column — hero */}
        <section className="flex flex-1 flex-col items-start gap-6">
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
          <h1 className="max-w-xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Replace freeform prompts with{" "}
            <span className="text-primary">low-friction elicitation</span>.
          </h1>
          <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
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
          {contributors.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {contributors.map((c) => (
                  <a
                    key={c.login}
                    href={c.html_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={c.login}
                  >
                    <img
                      src={`${c.avatar_url}&s=64`}
                      alt={c.login}
                      width={32}
                      height={32}
                      className="size-8 rounded-full border-2 border-background transition-transform hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {contributors.length === 1
                  ? "1 contributor"
                  : `${contributors.length} contributors`}
              </span>
            </div>
          )}
        </section>

        {/* Right column — mock chat preview */}
        <div className="hidden w-full max-w-md shrink-0 lg:block">
          <MockChatPreview />
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
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
          <div className="flex items-center gap-4">
            <a
              href="https://www.buildstory.com"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.buildstory.com/buildstory-logo.svg"
                alt="BuildStory"
                className="h-4"
              />
            </a>
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
        </div>
      </footer>
    </div>
  );
}

function MockChatPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
      {/* Header bar */}
      <div className="flex h-9 items-center border-b border-border px-4 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Mock chat
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-6 p-5">
        {/* User message */}
        <div className="mock-stage-1 flex w-full max-w-[95%] flex-col gap-2 ml-auto justify-end">
          <div className="ml-auto w-fit rounded-lg bg-secondary px-4 py-3 text-sm text-foreground">
            <p className="leading-relaxed">
              I have a four-day weekend coming up and I want to get away
              somewhere I haven&apos;t been before. Help me decide.
            </p>
          </div>
        </div>

        {/* Typing indicator + assistant message share the same slot */}
        <div className="relative flex w-full max-w-[95%] flex-col gap-2">
          {/* Typing indicator — absolutely positioned so it doesn't affect layout */}
          <div className="mock-stage-2 absolute inset-0 flex items-center gap-2 text-muted-foreground">
            <span className="flex size-3.5 items-center justify-center">
              <svg
                className="size-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </span>
            <span className="animate-pulse font-mono text-[11px] uppercase tracking-wider">
              Generating
            </span>
          </div>

          {/* Assistant message */}
          <div className="mock-stage-3 w-fit text-sm text-foreground">
            <p className="leading-relaxed">
              Love that. Quick question to narrow it down &mdash; what kind of
              vibe are you after?
            </p>
          </div>
        </div>
      </div>

      {/* Composer slot — static single-select */}
      <div className="mock-stage-4 border-t border-border">
        <div className="px-5 pt-5 pb-4">
          <div className="rounded-xl border border-border bg-card">
            <div className="px-5 pt-5 pb-3">
              <p className="text-[15px] font-semibold text-foreground">
                What kind of trip are you after?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick the one that pulls at you most.
              </p>
            </div>
            <div className="divide-y divide-border/60">
              {[
                {
                  n: 1,
                  title: "Coastal escape",
                  subtitle: "Salt air, slow mornings, fresh seafood.",
                },
                {
                  n: 2,
                  title: "Mountain reset",
                  subtitle: "Hikes, big skies, no agenda.",
                },
                {
                  n: 3,
                  title: "City to explore",
                  subtitle: "Museums, neighborhoods, late dinners.",
                  selected: true,
                },
              ].map((opt) => (
                <div
                  key={opt.n}
                  className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors ${opt.selected ? "bg-[var(--accent-soft)]" : "hover:bg-muted/60"}`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${opt.selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {opt.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-foreground">
                      {opt.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {opt.subtitle}
                    </p>
                  </div>
                  {opt.selected && (
                    <ArrowRight className="size-4 shrink-0 text-foreground" />
                  )}
                </div>
              ))}
              <div className="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <PencilLine className="size-4" />
                </span>
                <span className="text-[15px] text-muted-foreground">
                  Or describe something else&hellip;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
