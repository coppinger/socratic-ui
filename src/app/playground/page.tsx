import type { Metadata } from "next";

import { PlaygroundClient } from "./playground-client";

export const metadata: Metadata = {
  title: "Playground · Socratic UI",
  description:
    "Interactive workbench for previewing and tuning Socratic UI components inside a mock chat.",
  robots: { index: false, follow: false },
};

// URL-param validation lives in `<PlaygroundClient>`, not here. The
// playground registry imports `"use client"` entries, so reading them from
// a server component returns client references — server-side `.find()`
// would silently hit `undefined`.
export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <PlaygroundClient
      initialComponentParam={first(params.component)}
      initialScenarioParam={first(params.scenario)}
    />
  );
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
