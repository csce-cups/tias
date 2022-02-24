import React, { FC } from 'react'
import { EmployeeRow } from './EmployeeRow'

interface Props {
	width: string
}

function getData(): Array<string> {
	return [
		"Geralt of Rivia", "Gary Chess", "Sandy Banks", "Sharpness IV", "Star Fox", 
		"Luigi Smansion", "John Doom", "Suzzie Sunshine", "A", "B", "C", "D", "E"
	];
	// return [
	// 	"Geralt of Rivia"
	// ];
}

export const EmployeeList: FC<Props> = ({width}) => {
  return (
	<div className="column" style={{width: width}}>
    <div className="header">
		  <h2 className="slim">Employee</h2>
    </div>

    <div className="scrollable" style={{width: width}}>
      { getData().map((e, index) => (
        < EmployeeRow key={index} element={e} />
      ))}
    </div>

    <div className="column">
      <div className="button">Generate</div>
      <div className="button">Accept</div>
    </div>
	</div>
  )
}
