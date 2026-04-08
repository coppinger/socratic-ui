import { codeToHtml } from "shiki";

/**
 * Run Shiki at build time inside Server Components. We keep the call site
 * deliberately small so pages don't have to know about themes or transformers.
 * Output is trusted HTML — render with `dangerouslySetInnerHTML` inside a
 * styled `<pre>` wrapper.
 */
export async function highlight(
  code: string,
  lang: "tsx" | "ts" | "bash" = "tsx",
): Promise<string> {
  return codeToHtml(code, {
    lang,
    theme: "github-light",
  });
}
