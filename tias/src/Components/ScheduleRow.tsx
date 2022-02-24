import React, { FC } from 'react'
import './common.scss';

interface Props {
	element: string
}

export const ScheduleRow: FC<Props> = ({element}) => {
	return (
		<>
      <div className="row">
        <div className="element left">
          []
        </div>
        <div className="element right">
         {element}
        </div>
      </div>
      <hr/>
    </>
	)
}
