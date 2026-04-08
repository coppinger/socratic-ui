"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyCodeButton({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!copied && !failed) return;
    const timer = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [copied, failed]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn(
        "absolute right-3 top-3 z-10 h-7 w-7 bg-background/70 text-muted-foreground backdrop-blur hover:bg-background hover:text-foreground",
        className,
      )}
      onClick={() => {
        navigator.clipboard.writeText(code).then(
          () => setCopied(true),
          () => setFailed(true),
        );
      }}
      aria-label={
        copied ? "Copied" : failed ? "Copy failed" : "Copy code"
      }
      title={failed ? "Copy failed" : undefined}
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </Button>
  );
}
