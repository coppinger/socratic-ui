"use client";

import { Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RerollButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="w-full justify-center gap-2"
    >
      <Shuffle className="size-4" />
      Re-roll scenario
    </Button>
  );
}
