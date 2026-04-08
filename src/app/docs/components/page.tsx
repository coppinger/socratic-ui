import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { docsNav } from "@/config/docs";

export default function ComponentsIndexPage() {
  const components = docsNav.find((group) => group.title === "Components");
  if (!components) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="scroll-mt-24 text-4xl font-bold tracking-tight text-foreground">
          Components
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A growing set of structured input components. Each one is a
          controlled React component with a Zod schema for wiring it up to AI
          tool calls.
        </p>
      </header>

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {components.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-start justify-between gap-6 px-5 py-4 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-foreground">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
