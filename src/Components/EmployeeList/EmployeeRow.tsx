import React, { FC } from 'react'
import { Dot } from '../Misc/Dot'

interface Props {
	element: string // The body of the list element
}

export const EmployeeRow: FC<Props> = ({element}) => {
  return (
    <>
      <div className="hstack">
        <div className="element left">
          <input type="checkbox"/>
        </div>
        <div className="element label">
         {element}
        </div>
        <div className="element right">
          < Dot styles={{margin: '0', width: '0.7em'}}/>
        </div>
      </div>
      <div className="hr-container">
        <hr/>
      </div>
    </>
  )
}
