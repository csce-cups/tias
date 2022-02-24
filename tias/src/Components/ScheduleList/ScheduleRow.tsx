import React, { FC } from 'react'

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
      <div className="hr-container">
        <hr/>
      </div>
    </>
	)
}
