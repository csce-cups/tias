import React, { FC } from 'react'
import { ScheduleRow } from './ScheduleRow'

interface Props {
	data?: string[]
}

function getData(): Array<string> {
	return [
		"98%", "97%", "95%", "92%", "91%", 
		"90%", "90%", "87%"
	];
}

export const ScheduleList: FC<Props> = ({data}) => {
  if (data === undefined) data = getData();
  return (
    <div className="vstack">
      <div className="header">
        <h2 className="slim">Schedules</h2>
      </div>

      <div className="scrollable">
        { data.map((e, index) => (
          < ScheduleRow key={index} element={e} />
        ))}
      </div>

    </div>
  )
}
