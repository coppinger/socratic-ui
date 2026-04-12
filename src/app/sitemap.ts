import type { MetadataRoute } from "next";

import { docsNav } from "@/config/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://socraticui.com";

  const docPages = docsNav.flatMap((group) =>
    group.items.map((item) => ({
      url: `${base}${item.href}`,
      changeFrequency: "weekly" as const,
    })),
  );

  return [
    { url: base, changeFrequency: "weekly" as const },
    { url: `${base}/docs/components`, changeFrequency: "weekly" as const },
    ...docPages,
  ];
}
