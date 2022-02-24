import React, { FC } from 'react'
import { EmployeeRow } from './EmployeeRow'

interface Props {
	width: string
}

function getData(): Array<string> {
	return [
		"Geralt of Rivia", "Gary Chess", "Sandy Banks", "Sharpness IV", "Star Fox", 
		"Luigi Smansion", "John Doom", "Suzzie Sunshine"
	];
}

export const EmployeeList: FC<Props> = ({width}) => {
  return (
	<div className="column" style={{width: width}}>
		<h2>Employee</h2>
		<hr />
    	{ getData().map((e, index) => (
			  < EmployeeRow key={index + 30} element={e} />
		  ))}
	</div>
  )
}
