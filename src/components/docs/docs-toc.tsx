"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Right-rail "On this page" TOC. After mount it queries `main h2, main h3`
 * and uses IntersectionObserver to highlight the active section on scroll.
 * Headings are expected to already have server-rendered `id` attributes
 * (so deep links work on initial load) — any without one get a client-side
 * slugified fallback.
 *
 * Rescans on every pathname change because this component lives in the docs
 * layout and persists across sibling-route navigations.
 *
 * Hidden below `xl` to avoid squeezing the main content column.
 */
export function DocsToc() {
  const pathname = usePathname();
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const nodes = Array.from(
      main.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    );

    const collected: Heading[] = nodes.map((node) => {
      if (!node.id) {
        node.id = slugify(node.textContent ?? "");
      }
      return {
        id: node.id,
        text: node.textContent ?? "",
        level: node.tagName === "H2" ? 2 : 3,
      };
    });

    setHeadings(collected);
    setActiveId(collected[0]?.id ?? null);

    if (collected.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-20 hidden w-56 shrink-0 self-start xl:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              "text-sm",
              heading.level === 3 && "pl-4",
              heading.level === 2 && "pl-3",
            )}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block border-l-2 border-transparent pl-3 -ml-[1px] transition-colors",
                activeId === heading.id
                  ? "border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
