import type { Metadata } from "next";

import { docsNav } from "@/config/docs";

const components =
  docsNav.find((g) => g.title === "Components")?.items ?? [];

export function componentMetadata(slug: string): Metadata {
  const item = components.find(
    (i) => i.href === `/docs/components/${slug}`,
  );
  return {
    title: item?.title ?? slug,
    description: item?.description,
  };
}
