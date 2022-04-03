import React, { FC } from 'react'

interface Props {
  visible: boolean
  size?: string
}

export const SpacerBlock: FC<Props> = ({visible, size}) => {
  let flex: string | undefined = '0 0 0';
  if (size && visible && size === 'auto') flex = `1 1 auto`
  else if (size && visible) flex = `0 0 ${size}`
  else if (visible) flex = '1 1 auto'

  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }

  return <div className="block spacer" style={isVisible}/>
}
