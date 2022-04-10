/* Citation:
   Reading of input file and masking of file input element informed by:
   https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
   and
   https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8 
*/

import React, { useContext } from 'react'
import axios from 'axios';

interface AssignedPerson {
  first: string
  last: string
  classes: string[]
  labs: any
  number_lab_hours: number
}

const labsToString = (lab: any) => {
  let acc: string[] = []
  for (let key of Object.keys(lab)) {
    acc.push(`${key} - ${lab[key].join(`, ${key} - `)}`)
  }
  return acc.join(', ')
}

export const ExportFileButton = () => {
  const fileExportRef = React.useRef<HTMLAnchorElement | null>(null);

  const handleClick = () => {
    if (fileExportRef.current !== null) {
      axios.get('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/export-schedule').then(response => response.data as AssignedPerson[])
      .then(data => {
        let csvText = 'First;Last;Classes;Labs;# LH\n'
        for (let person of data) {
          csvText += `${person.first};${person.last};${person.classes.join(', ')};${labsToString(person.labs)};${person.number_lab_hours}\n`
        }
        const href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvText)}`;
        fileExportRef.current?.setAttribute('href', href)
      })
      .then(() => fileExportRef.current?.click())
    }
  }

  return (
    <div className="admin-changeover">
      <a download="exported_schedule.csv" ref={fileExportRef} style={{ display: "none" }}/>
      <button id="upload-semester-button" className="blue button full" onClick={handleClick}>Export Schedule as CSV</button>
    </div>
  );
}
