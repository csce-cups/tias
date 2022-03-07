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
          < Dot linkID={Math.floor(Math.random()*20)} styles={{margin: '0', width: '0.7em'}}/> {/* TODO: Random Keys to be replaced */}
        </div>
      </div>
      <div className="hr-container">
        <hr/>
      </div>
    </>
  )
}
