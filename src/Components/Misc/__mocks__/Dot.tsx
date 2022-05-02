import React from 'react'

interface Props {
  linkID: number
}

export const Dot: React.FC<Props> = ({linkID}) => {
  return (
    <div>
      <div>
        <div className="dot" data-testid="Dot" link-id={linkID}/>
      </div>
    </div>
  )
}
