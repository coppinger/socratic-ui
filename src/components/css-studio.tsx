"use client";

import { useEffect } from "react";

export function CSSStudio() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("cssstudio").then(({ startStudio }) => {
        startStudio();
      });
    }
  }, []);

  return null;
}
