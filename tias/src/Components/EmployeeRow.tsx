import React, { FC } from 'react'
import './common.scss';

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
      <hr/>
    </>
  )
}
