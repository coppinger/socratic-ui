import { registry, registryTitle } from "@/lib/registry";

export async function GET() {
  const items = Object.values(registry).map((c) => ({
    name: c.name,
    type: "registry:ui",
    title: registryTitle(c.name),
    description: c.description,
    dependencies: c.dependencies,
    registryDependencies: c.registryDependencies,
  }));

  return Response.json(items);
}
