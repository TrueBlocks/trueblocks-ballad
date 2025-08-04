export const getBarWidth = (collapsed: boolean, factor: number) =>
  collapsed ? 50 : 160 * factor;
