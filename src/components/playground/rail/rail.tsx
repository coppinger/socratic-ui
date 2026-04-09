"use client";

import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import type { SocraticMotion } from "@/components/socratic-ui/motion";
import type { OptionIconSettings } from "@/components/socratic-ui/shared";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type {
  AnyPlaygroundEntry,
  Density,
  ErasedEdgeCasePreset,
  SocraticKind,
  SocraticNode,
} from "@/playground/registry";

import { ComponentPicker } from "./component-picker";
import { EdgeCaseButtons } from "./edge-case-buttons";
import { MotionControls } from "./motion-controls";
import { OptionControls } from "./option-controls";
import { PropTweakers } from "./prop-tweakers";
import { RerollButton } from "./reroll-button";
import { ScenarioPicker } from "./scenario-picker";
import { ThemeDensityToggle } from "./theme-density-toggle";

export function Rail({
  entry,
  node,
  motion,
  density,
  optionIcons,
  componentSlug,
  scenarioId,
  onComponentChange,
  onScenarioChange,
  onNodeChange,
  onMotionChange,
  onMotionPresetSelect,
  onDensityChange,
  onOptionIconsChange,
  onReroll,
}: {
  entry: AnyPlaygroundEntry;
  node: SocraticNode;
  motion: SocraticMotion;
  density: Density;
  optionIcons: OptionIconSettings;
  componentSlug: SocraticKind;
  scenarioId: string;
  onComponentChange: (slug: SocraticKind) => void;
  onScenarioChange: (id: string) => void;
  onNodeChange: (next: SocraticNode) => void;
  onMotionChange: (next: SocraticMotion) => void;
  onMotionPresetSelect: (next: SocraticMotion) => void;
  onDensityChange: (next: Density) => void;
  onOptionIconsChange: (next: OptionIconSettings) => void;
  onReroll: () => void;
}) {
  const handlePropsChange = (nextProps: Record<string, unknown>) => {
    // Validate via Zod before committing — silently drop invalid edits.
    const result = entry.schema.safeParse(nextProps);
    if (!result.success) return;
    onNodeChange({ ...node, props: result.data } as SocraticNode);
  };

  const erasedPresets =
    entry.edgeCases as unknown as ReadonlyArray<ErasedEdgeCasePreset>;

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-5">
        <header>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Playground
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {entry.label}
            </h1>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={`/docs/components/${componentSlug}`} />}
            >
              <BookOpenIcon />
              Docs
            </Button>
          </div>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">
            {entry.description}
          </p>
        </header>

        <Section title="Component">
          <ComponentPicker
            value={componentSlug}
            onChange={onComponentChange}
          />
        </Section>

        <Separator />

        <Section title="Animation">
          <MotionControls
            motion={motion}
            onChange={onMotionChange}
            onPresetSelect={onMotionPresetSelect}
          />
        </Section>

        <Separator />

        <Section title="Options">
          <OptionControls value={optionIcons} onChange={onOptionIconsChange} />
        </Section>

        <Separator />

        <Section title="Edge cases">
          <EdgeCaseButtons
            presets={erasedPresets}
            onApply={(preset) => onNodeChange(preset.apply(node))}
          />
        </Section>

        <Separator />

        <Section title="Props">
          <PropTweakers
            fields={entry.tweakers}
            props={node.props as Record<string, unknown>}
            onChange={handlePropsChange}
          />
        </Section>

        <Separator />

        <Section title="Surface">
          <ThemeDensityToggle
            density={density}
            onDensityChange={onDensityChange}
          />
        </Section>

        <Separator />

        <Section title="Scenario">
          <ScenarioPicker
            scenarios={entry.scenarios}
            value={scenarioId}
            onChange={onScenarioChange}
          />
          <RerollButton
            onClick={onReroll}
            disabled={entry.scenarios.length <= 1}
          />
        </Section>

        <p className="mt-2 text-[10px] leading-snug text-muted-foreground/70">
          Prop edits, animation, and density reset on refresh. Component and
          scenario survive via URL state.
        </p>
      </div>
    </ScrollArea>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
