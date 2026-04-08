"use client";

import { ChevronRight, Layers } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  getPlaygroundEntries,
  type SocraticKind,
} from "@/playground/registry";

/**
 * Replaces the previous Select dropdown with a modal-driven card picker.
 * The trigger button shows the active component label; clicking opens a
 * dialog with one card per registered entry. The card layout gives more
 * room for descriptions and a clearer visual scan than a 1-line dropdown.
 */
export function ComponentPicker({
  value,
  onChange,
}: {
  value: SocraticKind;
  onChange: (slug: SocraticKind) => void;
}) {
  const [open, setOpen] = useState(false);
  const entries = getPlaygroundEntries();
  const active = entries.find((entry) => entry.slug === value);

  const handleSelect = (slug: SocraticKind) => {
    onChange(slug);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-auto w-full justify-between gap-2 px-3 py-2.5 text-left"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Layers className="size-3.5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {active?.label ?? "Choose component"}
            </span>
            <span className="truncate text-[10px] text-muted-foreground">
              {entries.length} available
            </span>
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a component</DialogTitle>
          <DialogDescription>
            Pick which Socratic input to drop into the mock chat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {entries.map((entry) => {
            const isActive = entry.slug === value;
            return (
              <button
                key={entry.slug}
                type="button"
                onClick={() => handleSelect(entry.slug)}
                className={cn(
                  "group flex flex-col gap-2 rounded-lg border px-4 py-3 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-primary" : "text-foreground",
                    )}
                  >
                    {entry.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {entry.scenarios.length} scenario
                    {entry.scenarios.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
