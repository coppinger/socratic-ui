export type OptionIconLayout = "horizontal" | "vertical";
export type OptionIconAlignment = "left" | "center";

/**
 * Bundled icon-display settings threaded through the playground (rail
 * → chat → entry renderers). Kept separate from core component props so
 * `SingleSelect`/etc. stay unaware of the "show" toggle.
 */
export type OptionIconSettings = {
  show: boolean;
  layout: OptionIconLayout;
  alignment: OptionIconAlignment;
};

/**
 * Container class for a list of option cards. Vertical layout moves to
 * a 2-col grid so icon-on-top cards don't stretch the full row width.
 */
export function optionListClass(layout: OptionIconLayout) {
  return layout === "vertical"
    ? "grid grid-cols-2 gap-2"
    : "flex flex-col gap-2";
}
