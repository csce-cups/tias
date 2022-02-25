import React, { FC } from 'react'

interface Props {
  end? : boolean
}

export const SchedulingColumn: FC<Props> = ({end}) => {
  let style = {};
  if (end) {
    style = {border: '0'}
  }

  let dividers = [];
  for (let i = 0; i < 11; i++) {
    dividers[i] = <div className="divider"></div>;
  }

  return (
    <div className="column grow-h" style={style}>
      {dividers}
    </div>
  )
}
