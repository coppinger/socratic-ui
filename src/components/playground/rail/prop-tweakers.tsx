"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TweakerField } from "@/playground/registry";

export function PropTweakers<TProps extends Record<string, unknown>>({
  fields,
  props,
  onChange,
}: {
  fields: ReadonlyArray<TweakerField>;
  props: TProps;
  onChange: (next: TProps) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <FieldEditor
          key={field.path}
          field={field}
          value={props[field.path]}
          onChange={(next) => onChange({ ...props, [field.path]: next })}
        />
      ))}
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: TweakerField;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const id = useId();
  switch (field.kind) {
    case "string": {
      const stringValue = typeof value === "string" ? value : "";
      // Empty string on an optional field clears via undefined so the
      // schema's `.optional()` is honored.
      const handleChange = (next: string) =>
        onChange(next === "" ? undefined : next);
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={id} className="text-xs font-medium">
            {field.label}
          </Label>
          {field.multiline ? (
            <Textarea
              id={id}
              value={stringValue}
              placeholder={field.placeholder}
              onChange={(event) => handleChange(event.target.value)}
              rows={2}
              className="resize-y text-sm"
            />
          ) : (
            <Input
              id={id}
              value={stringValue}
              placeholder={field.placeholder}
              onChange={(event) => handleChange(event.target.value)}
              className="h-8 text-sm"
            />
          )}
        </div>
      );
    }
    case "number": {
      const numberValue = typeof value === "number" ? value : 0;
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={id} className="text-xs font-medium">
            {field.label}
          </Label>
          <Input
            id={id}
            type="number"
            value={numberValue}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              if (!Number.isNaN(parsed)) onChange(parsed);
            }}
            className="h-8 text-sm"
          />
        </div>
      );
    }
    case "boolean": {
      const boolValue = Boolean(value);
      return (
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-xs font-medium">
            {field.label}
          </Label>
          <Switch id={id} checked={boolValue} onCheckedChange={onChange} />
        </div>
      );
    }
    case "enum": {
      const stringValue = typeof value === "string" ? value : "";
      return (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium">{field.label}</Label>
          <div className="flex flex-wrap gap-1">
            {field.options.map((option) => {
              const active = option.value === stringValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    case "options-list": {
      const optionsValue = Array.isArray(value)
        ? (value as Array<{ title: string; subtitle?: string }>)
        : [];
      return (
        <OptionsListEditor
          label={field.label}
          options={optionsValue}
          min={field.min}
          max={field.max}
          onChange={onChange}
        />
      );
    }
  }
}

function OptionsListEditor({
  label,
  options,
  min = 2,
  max = 20,
  onChange,
}: {
  label: string;
  options: Array<{ title: string; subtitle?: string }>;
  min?: number;
  max?: number;
  onChange: (next: Array<{ title: string; subtitle?: string }>) => void;
}) {
  // Collapsed by default — most sessions tweak options via edge-case presets.
  const [open, setOpen] = useState(false);

  const setOption = (
    index: number,
    patch: Partial<{ title: string; subtitle?: string }>,
  ) => {
    const next = options.map((opt, i) => (i === index ? { ...opt, ...patch } : opt));
    onChange(next);
  };
  const remove = (index: number) => {
    if (options.length <= min) return;
    onChange(options.filter((_, i) => i !== index));
  };
  const add = () => {
    if (options.length >= max) return;
    onChange([
      ...options,
      { title: `Option ${options.length + 1}`, subtitle: "" },
    ]);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md border border-border px-2.5 py-1.5 text-left transition-colors hover:bg-muted"
          />
        }
      >
        <span className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
          <Label className="cursor-pointer text-xs font-medium">{label}</Label>
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {options.length}/{max}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <ul className="flex flex-col gap-2">
          {options.map((option, index) => (
            <li
              key={index}
              className="flex flex-col gap-1 rounded-md border border-border p-2"
            >
              <div className="flex items-center gap-1">
                <Input
                  value={option.title}
                  onChange={(event) =>
                    setOption(index, { title: event.target.value })
                  }
                  placeholder="Title"
                  className="h-7 text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  disabled={options.length <= min}
                  aria-label={`Remove option ${index + 1}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <Input
                value={option.subtitle ?? ""}
                onChange={(event) =>
                  setOption(index, {
                    subtitle: event.target.value || undefined,
                  })
                }
                placeholder="Subtitle (optional)"
                className="h-7 text-xs"
              />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          disabled={options.length >= max}
          className="mt-2 h-7 w-full justify-center gap-1.5 text-xs"
        >
          <Plus className="size-3.5" />
          Add option
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}
