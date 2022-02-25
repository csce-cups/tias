import React, { FC } from 'react'
import { EmployeeRow } from './EmployeeRow'
import { GenerateButton } from './GenerateButton'
import { AcceptButton } from './AcceptButton'

interface Props {
	
}

function getData(): Array<string> {
	return [
		"Geralt of Rivia", "Gary Chess", "Sandy Banks", "Sharpness IV", "Star Fox", 
		"Luigi Smansion", "John Doom", "Suzzie Sunshine"
	];
}

export const EmployeeList: FC<Props> = () => {
  return (
	<div className="column">
    <div className="header">
		  <h2 className="slim">Employee</h2>
    </div>

    <div className="scrollable">
      { getData().map((e, index) => (
        < EmployeeRow key={index} element={e} />
      ))}
    </div>

    <div className="column top-border">
      < GenerateButton />
      < AcceptButton />
    </div>
	</div>
  )
}
