import { registry } from "@/lib/registry";

export async function GET() {
  const items = Object.values(registry).map((c) => ({
    name: c.name,
    type: "registry:ui",
    title: c.name
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
    description: c.description,
    dependencies: c.dependencies,
    registryDependencies: c.registryDependencies,
  }));

  return Response.json(items);
}
