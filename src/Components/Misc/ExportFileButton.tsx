/* Citation:
   Reading of input file and masking of file input element informed by:
   https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
   and
   https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8 
*/

import React from 'react'
import axios from 'axios';

interface AssignedCourse {
  course_id: string
  sec: string
  lab_days: string[]
  begin: string
  end: string
  instructor: string
  lab_room: string
  peer_teachers: string[]
}

interface AssignedPerson {
  first: string
  last: string
  classes: string[]
  labs: any
  number_lab_hours: number
}

interface Response {
  courses: AssignedCourse[]
  people: AssignedPerson[]
}

const labsToString = (lab: any) => {
  let acc: string[] = []
  for (let key of Object.keys(lab)) {
    acc.push(`${key} - ${lab[key].join(`, ${key} - `)}`)
  }
  return acc.join(', ')
}

export const ExportFileButton = () => {
  const fileExportPeopleRef = React.useRef<HTMLAnchorElement | null>(null);
  const fileExportCoursesRef = React.useRef<HTMLAnchorElement | null>(null);

  const handleClick = () => {
    if (fileExportPeopleRef.current !== null && fileExportCoursesRef.current !== null) {
      axios.get('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/export-schedule').then(response => response.data as Response)
      .then(data => {
        let coursesTsvText = 'Course ID\tSec\tLab Days\tBegin\tEnd\tInstructor\tLab Room\n'
        for (let course of data.courses) {
          coursesTsvText += `${course.course_id}\t${course.sec}\t${course.lab_days.join('')}\t${course.begin}\t${course.end}\t${course.instructor}\t${course.lab_room}\t${course.peer_teachers.join('\t')}\n`
        }
        const courseshref = `data:text/tab-separated-values;charset=utf-8,${encodeURIComponent(coursesTsvText)}`;
        fileExportCoursesRef.current?.setAttribute('href', courseshref)

        let personTsvText = 'First\tLast\tClasses\tLabs\t# LH\n'
        for (let person of data.people) {
          personTsvText += `${person.first}\t${person.last}\t${person.classes.join(', ')}\t${labsToString(person.labs)}\t${person.number_lab_hours}\n`
        }
        const peoplehref = `data:text/tab-separated-values;charset=utf-8,${encodeURIComponent(personTsvText)}`;
        fileExportPeopleRef.current?.setAttribute('href', peoplehref)
      })
      .then(() => {
        fileExportCoursesRef.current?.click();
        fileExportPeopleRef.current?.click();
      })
    }
  }

  return (
    <div className="admin-changeover">
      <a download="exported_people_schedule.tsv" ref={fileExportPeopleRef} style={{ display: "none" }}/>
      <a download="exported_courses_schedule.tsv" ref={fileExportCoursesRef} style={{ display: "none" }}/>
      <button id="export-courses-button" className="blue button full" style={{marginTop: '0', marginBottom: '0'}} onClick={handleClick}>Export Schedule as TSV files</button>
    </div>
  );
}
