import React, { FC } from 'react';

interface Props {
  titles: [string, string]
}

export const TitleSet: FC<Props> = ({titles}) => {
  return (
    <div className="hstack reqoff-col">
      <div className='interact-blocks standalone new-trade-col' style={{width:"12vw"}}>
        <div className="new-trade-col-title">
          {titles[0]}
        </div>
      </div>

      <div className="arrow hidden"/>

      <div className='interact-blocks standalone new-trade-col' style={{width:"12vw"}}>
        <div className="new-trade-col-title">
          {titles[1]}
        </div>
      </div>
    </div>
  )
}

