import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { registry, registryNames, registryTitle } from "@/lib/registry";

const componentsDir = join(process.cwd(), "src/components");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  // Strip .json suffix — shadcn registry URLs use `{name}.json`
  const slug = name.replace(/\.json$/, "");

  const component = registry[slug];
  if (!component) {
    return Response.json(
      { error: `Unknown component: ${slug}` },
      { status: 404 },
    );
  }

  let files: { type: "registry:component"; path: string; content: string }[];
  try {
    files = await Promise.all(
      component.files.map(async (filePath) => {
        const content = await readFile(join(componentsDir, filePath), "utf-8");
        return {
          type: "registry:component" as const,
          path: filePath,
          content,
        };
      }),
    );
  } catch {
    return Response.json(
      { error: `Failed to read source files for component: ${slug}` },
      { status: 500 },
    );
  }

  return Response.json({
    name: component.name,
    type: "registry:ui",
    title: registryTitle(component.name),
    description: component.description,
    dependencies: component.dependencies,
    registryDependencies: component.registryDependencies,
    files,
  });
}

/** Index route — returns all available component names. */
export async function generateStaticParams() {
  return registryNames.map((name) => ({ name: `${name}.json` }));
}
