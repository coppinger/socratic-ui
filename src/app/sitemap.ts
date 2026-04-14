import type { MetadataRoute } from "next";

import { docsNav } from "@/config/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://socraticui.com";
  const lastModified = new Date();

  const docPages = docsNav.flatMap((group) => {
    const priority = group.title === "Components" ? 0.8 : 0.7;
    return group.items.map((item) => ({
      url: `${base}${item.href}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
    }));
  });

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${base}/docs/components`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...docPages,
  ];
}
