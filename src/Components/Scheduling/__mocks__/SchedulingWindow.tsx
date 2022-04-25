import React, { FC } from 'react'
import RenderBlockProps from '../BlockBase'
import { OptionsProps } from '../SchedulingWindow'

interface Props {
  renderBlockType: React.FC<RenderBlockProps>
  top?: React.ReactNode
  options?: OptionsProps
}

export const SchedulingWindow: FC<Props> = ({top}) => {
  return (
    <div data-testid="SchedulingWindow">{top}</div>
  )
}
