import * as React from "react";

export function SuccessSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3.5 rounded-lg border border-[color-mix(in_oklab,var(--success)_30%,transparent)] bg-[var(--success-soft)] px-4 py-3 text-[13px] font-medium text-[var(--success)]">
      ✓ {children}
    </div>
  );
}
