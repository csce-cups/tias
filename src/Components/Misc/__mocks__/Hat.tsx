import React, { FC } from 'react'

interface Props {
  linkID: number, // An id that ties this dot corresponding dots elsewhere on the page
}

export const Hat: FC<Props> = ({linkID}) => {
  if (linkID === -1) {
    return (
      <div className="hat alert" data-testid="alert hat">
        <span className="alert-text">UNSCHEDULED</span>
      </div>
    )
  }

  return <div link-id={linkID} data-testid="hat"/>
}
