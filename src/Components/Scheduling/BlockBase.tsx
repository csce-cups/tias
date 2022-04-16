import { APIUserPreferenceEnum } from "../../modules/API";

// An interface that every block's props must follow
export default interface RenderBlockProps {
  visible: boolean
  size?: string
  inline?: boolean
  edge?: "left" | "right" | "center"
  bottom?: boolean
  data: any
}

export const blockColors = new Map([
  [110, '#4F405A'],
  [111, '#826a94'],
  [120, '#0e544f'],
  [121, '#0e544f'],
  [206, '#006b47'],
  [221, '#009489'],
  [222, '#5358AE'],
  [312, '#0086B6'],
  [313, '#434F6F'],
  [314, '#807391'],
  [315, '#6e438c'],
  [331, '#8f2476'],
]);

export const statusColors = new Map<APIUserPreferenceEnum, string>([
  ["Can't Do",         '#FF8C8C'],
  ["Prefer Not To Do", '#F1FF28'],
  ["Indifferent",      'white'],
  ["Prefer To Do",     '#75FF70']
])

export const calcFlex = (visible: boolean, inline?: boolean, size?: string) => {
  if (!visible && inline === true) return '0 0 auto';
  else if (size && visible && size === 'auto') return `1 1 auto`;
  else if (size && visible) return `0 0 ${size}`;
  else if (visible) return undefined;
  else return '0 0 0';
}
