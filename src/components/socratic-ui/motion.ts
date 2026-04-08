/**
 * Opt-in entry-animation config for every Socratic UI component. When the
 * `motion` prop is undefined the component renders the same JSX it always
 * has — docs demos depend on that invariant, so this prop must stay
 * default-off in any caller that isn't the playground.
 */
export type SocraticMotion = {
  enabled?: boolean;
  duration?: number;
  stagger?: number;
  ease?: "easeOut" | "easeInOut" | "linear" | [number, number, number, number];
  delay?: number;
};

export const defaultMotion = {
  duration: 0.35,
  stagger: 0.04,
  ease: "easeOut" as const,
  delay: 0,
};

/**
 * The "Subtle" preset, used as the playground's default and as the
 * baseline preset in the rail. Lives here so the playground client can
 * import without reaching into a UI-layer presets array.
 */
export const subtleMotion: Required<
  Pick<SocraticMotion, "duration" | "stagger" | "delay" | "ease">
> = {
  duration: 0.35,
  stagger: 0.04,
  delay: 0,
  ease: "easeOut",
};
