// An interface that every block's props must follow
export default interface RenderBlockProps {
  visible: boolean
  size?: string
  inline?: boolean
  data: any
}

export const calcFlex = (visible: boolean, inline?: boolean, size?: string) => {
  if (!visible && inline === true) return '0 0 auto';
  else if (size && visible && size === 'auto') return `1 1 auto`;
  else if (size && visible) return `0 0 ${size}`;
  else if (visible) return undefined;
  else return '0 0 0';
}
