import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <SidebarTrigger className="md:hidden" />
      <Separator orientation="vertical" className="mx-1 h-5 md:hidden" />
      <Link
        href="/docs"
        className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          S
        </span>
        Socratic UI
      </Link>
      <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
        <Link
          href="/docs"
          className="transition-colors hover:text-foreground"
        >
          Docs
        </Link>
        <Link
          href="/docs/components"
          className="transition-colors hover:text-foreground"
        >
          Components
        </Link>
      </nav>
      <ThemeToggle className="ml-auto" />
    </header>
  );
}
