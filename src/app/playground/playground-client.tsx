"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, useCallback, useMemo, useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";

import {
  type SocraticMotion,
  subtleMotion,
} from "@/components/socratic-ui/motion";
import type { OptionIconSettings } from "@/components/socratic-ui/shared";
import { MockChat } from "@/components/playground/chat/mock-chat";
import { Rail } from "@/components/playground/rail/rail";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  type Density,
  getAnyPlaygroundEntry,
  getPlaygroundEntries,
  type PlaygroundMessage,
  type SocraticKind,
  type SocraticNode,
} from "@/playground/registry";

type InitialState = {
  componentSlug: SocraticKind;
  scenarioId: string;
  node: SocraticNode | null;
};

function resolveInitialState(
  componentParam: string | undefined,
  scenarioParam: string | undefined,
): InitialState {
  const entries = getPlaygroundEntries();
  const fallback = entries[0];
  const componentSlug: SocraticKind = entries.some(
    (entry) => entry.slug === componentParam,
  )
    ? (componentParam as SocraticKind)
    : (fallback?.slug ?? "single-select");
  const entry =
    entries.find((entry) => entry.slug === componentSlug) ?? fallback;
  const scenarioId =
    entry?.scenarios.find((s) => s.id === scenarioParam)?.id ??
    entry?.scenarios[0]?.id ??
    "";
  const scenario = entry?.scenarios.find((s) => s.id === scenarioId);
  const node = scenario ? findFirstSocraticNode(scenario.messages) : null;
  return { componentSlug, scenarioId, node };
}

export function PlaygroundClient({
  initialComponentParam,
  initialScenarioParam,
}: {
  initialComponentParam?: string;
  initialScenarioParam?: string;
}) {
  const router = useRouter();

  const initial = useMemo(
    () => resolveInitialState(initialComponentParam, initialScenarioParam),
    [initialComponentParam, initialScenarioParam],
  );
  const [componentSlug, setComponentSlug] = useState(initial.componentSlug);
  const [scenarioId, setScenarioId] = useState(initial.scenarioId);
  const [node, setNode] = useState<SocraticNode | null>(initial.node);
  const [motion, setMotion] = useState<SocraticMotion>(() => ({
    enabled: true,
    ...subtleMotion,
  }));
  const [density, setDensity] = useState<Density>("comfy");
  const [optionIcons, setOptionIcons] = useState<OptionIconSettings>({
    show: false,
    layout: "horizontal",
    alignment: "left",
  });
  const [animationNonce, setAnimationNonce] = useState(0);
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  const entry = useMemo(
    () => getAnyPlaygroundEntry(componentSlug),
    [componentSlug],
  );
  const scenario = useMemo(
    () =>
      entry?.scenarios.find((s) => s.id === scenarioId) ?? entry?.scenarios[0],
    [entry, scenarioId],
  );

  const replayAnimation = useCallback(
    () => setAnimationNonce((n) => n + 1),
    [],
  );

  const updateUrl = useCallback(
    (slug: SocraticKind, scenario: string) => {
      const params = new URLSearchParams();
      params.set("component", slug);
      params.set("scenario", scenario);
      router.replace(`/playground?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  const handleComponentChange = useCallback(
    (slug: SocraticKind) => {
      const nextEntry = getAnyPlaygroundEntry(slug);
      const nextScenario = nextEntry?.scenarios[0];
      if (!nextEntry || !nextScenario) return;
      setComponentSlug(slug);
      setScenarioId(nextScenario.id);
      setNode(findFirstSocraticNode(nextScenario.messages));
      replayAnimation();
      updateUrl(slug, nextScenario.id);
    },
    [replayAnimation, updateUrl],
  );

  const handleScenarioChange = useCallback(
    (id: string) => {
      if (!entry) return;
      const nextScenario = entry.scenarios.find((s) => s.id === id);
      if (!nextScenario) return;
      setScenarioId(id);
      setNode(findFirstSocraticNode(nextScenario.messages));
      replayAnimation();
      updateUrl(componentSlug, id);
    },
    [entry, componentSlug, replayAnimation, updateUrl],
  );

  const handleReroll = useCallback(() => {
    if (!entry || entry.scenarios.length <= 1) return;
    const currentIndex = entry.scenarios.findIndex((s) => s.id === scenarioId);
    const nextIndex = (currentIndex + 1) % entry.scenarios.length;
    const nextScenario = entry.scenarios[nextIndex];
    setScenarioId(nextScenario.id);
    setNode(findFirstSocraticNode(nextScenario.messages));
    replayAnimation();
    updateUrl(componentSlug, nextScenario.id);
  }, [entry, scenarioId, componentSlug, replayAnimation, updateUrl]);

  const handleMotionPresetSelect = useCallback(
    (next: SocraticMotion) => {
      setMotion(next);
      replayAnimation();
    },
    [replayAnimation],
  );

  if (!entry || !scenario || !node) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No playground entry available for{" "}
          <code className="font-mono">{componentSlug}</code>.
        </p>
      </main>
    );
  }

  const railProps: ComponentProps<typeof Rail> = {
    entry,
    node,
    motion,
    density,
    optionIcons,
    componentSlug,
    scenarioId,
    onComponentChange: handleComponentChange,
    onScenarioChange: handleScenarioChange,
    onNodeChange: setNode,
    onMotionChange: setMotion,
    onMotionPresetSelect: handleMotionPresetSelect,
    onDensityChange: setDensity,
    onOptionIconsChange: setOptionIcons,
    onReroll: handleReroll,
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <PlaygroundHeader
        onOpenMobileRail={() => setMobileRailOpen(true)}
      />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[320px] shrink-0 border-r border-border bg-card md:block">
          <Rail {...railProps} />
        </aside>

        {/* Mobile rail sheet */}
        <Sheet open={mobileRailOpen} onOpenChange={setMobileRailOpen}>
          <SheetContent side="left" className="w-[320px] p-0 md:hidden">
            <SheetTitle className="sr-only">Playground controls</SheetTitle>
            <Rail {...railProps} />
          </SheetContent>
        </Sheet>

        <WorkbenchCanvas>
          <MockChat
            key={`${componentSlug}:${scenarioId}`}
            scenario={scenario}
            liveNode={node}
            motion={motion}
            density={density}
            optionIcons={optionIcons}
            animationKey={`${componentSlug}:${scenarioId}:${animationNonce}`}
          />
        </WorkbenchCanvas>
      </div>
    </div>
  );
}

// Inline SVG (rather than CSS gradients) so we can use stroke-dasharray
// for true dashes — CSS gradients can't draw dashes along an arbitrary
// axis without stacking patterns.
function WorkbenchCanvas({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-w-0 flex-1 overflow-hidden bg-background">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full text-foreground/[0.10]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="workbench-dashes"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="22"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeDasharray="5 5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#workbench-dashes)" />
      </svg>
      <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col border-x border-border bg-background">
        {children}
      </div>
    </main>
  );
}

// Hoisted out of `PlaygroundClient` so it doesn't re-render on every
// motion-slider drag in the parent.
function PlaygroundHeader({
  onOpenMobileRail,
}: {
  onOpenMobileRail: () => void;
}) {
  const count = getPlaygroundEntries().length;
  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenMobileRail}
        aria-label="Open playground controls"
      >
        <SlidersHorizontalIcon className="size-4" />
      </Button>
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-semibold tracking-tight"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          S
        </span>
        Socratic UI
      </Link>
      <nav className="flex items-center gap-4 text-xs text-muted-foreground">
        <Link href="/docs" className="hover:text-foreground">
          Docs
        </Link>
        <span className="text-foreground">Playground</span>
      </nav>
      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
        {count} component{count === 1 ? "" : "s"}
      </span>
    </header>
  );
}

function findFirstSocraticNode(
  messages: ReadonlyArray<PlaygroundMessage>,
): SocraticNode | null {
  for (const message of messages) {
    if (message.kind === "socratic") return message.node;
  }
  return null;
}
