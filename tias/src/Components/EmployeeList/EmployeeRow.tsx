import React, { FC } from 'react'

interface Props {
	element: string
}

export const EmployeeRow: FC<Props> = ({element}) => {
  return (
    <>
      <div className="row">
        <div className="element left">
          []
        </div>
        <div className="element label">
         {element}
        </div>
        <div className="element right">
          •
        </div>
      </div>
      <div className="hr-container">
        <hr/>
      </div>
    </>
  )
}
