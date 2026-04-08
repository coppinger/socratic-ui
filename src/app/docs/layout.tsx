import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsToc } from "@/components/docs/docs-toc";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset className="bg-background">
        <DocsHeader />
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-12 px-6 py-10 xl:px-10">
          <main className="min-w-0 flex-1">{children}</main>
          <DocsToc />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
