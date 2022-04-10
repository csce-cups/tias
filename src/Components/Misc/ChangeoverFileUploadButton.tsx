/* Citation:
   Reading of input file and masking of file input element informed by:
   https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
   and
   https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8 
*/

import React, { useContext, useEffect } from 'react'
import API, { Meeting, Weekday } from '../../modules/API';
import axios from 'axios';
import uuid from '../../uuid';

interface Course {
  course_id: number
  department: string
  course_number: string
  course_name: string | null
}

type MeetingType = "INT" | "INS" | "CMP" | "LEC" | "LAB" | "PRAC" | "CLD" | "REC" | "EXAM" | "SEM" | "RES" | "PRL"

const meeting_type = new Map<MeetingType, string>([["INT", "Internship"], ["INS", "Independent Study"], ["CMP", "Competition"], ["LEC", "Lecture"], ["LAB", "Laboratory"], ["PRAC", "Practicum"], ["CLD", "Clinic"], ["REC", "Recitation"], ["EXAM", "Examination"], ["SEM", "Seminar"], ["RES", "Research"], ["PRL", "Private Lesson"]])

const weekday = new Map<string, Weekday>([["M", "Monday"], ["T", "Tuesday"], ["W", "Wednesday"], ["R", "Thursday"], ["F", "Friday"]])

interface CSCECSVRow {
  term: string
  course_section: string
  course_offering_id: number
  days_met: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  room: string
  instructor: string
}

interface CSCEJSONMeeting {
  category: string
  class: string
  faculty: {
    bannerId: string
    category: null
    class: string
    courseReferenceNumber: string
    displayName: string
    emailAddress: string
    id: null
    primaryIndicator: boolean
    term: string
    version: null
  }[]
  meetingTime: {
    beginTime: string | null
    building: string
    buildingDescription: string
    campus: string
    campusDescription: string
    category: string
    class: string
    courseReferenceNumber: string
    creditHourSession: number
    endDate: string
    endTime: string | null
    friday: boolean
    hoursWeek: number
    meetingScheduleType: string
    meetingType: MeetingType
    meetingTypeDescription: string
    monday: boolean
    room: string | null
    saturday: boolean
    startDate: string
    sunday: boolean
    term: string
    thursday: boolean
    tuesday: boolean
    wednesday: boolean
  }
  term: string
}

interface CSCEJSONDatum {
  id: number
  term: string
  termDesc: string
  courseReferenceNumber: string
  partOfTerm: string
  courseNumber: string
  subject: string
  subjectDescription: string
  sequenceNumber: string
  campusDescription: string
  scheduleTypeDescription: string
  courseTitle: string
  creditHours: number | null
  maximumEnrollment: number | null
  enrollment: number | null
  seatsAvailable: number | null
  waitCapacity: number | null
  waitCount: number | null
  waitAvailable: number | null
  crossList: null
  crossListCapacity: null
  crossListCount: null
  crossListAvailable: null
  creditHourHigh: null
  creditHourLow: number
  creditHourIndicator: null
  openSection: boolean
  linkIdentifier: null
  isSectionLinked: boolean
  subjectCourse: string
  faculty: {
    bannerId: string
    category: null
    class: string
    courseReferenceNumber: string
    displayName: string
    emailAddress: string
    id: null
    primaryIndicator: boolean
    term: string
    version: null
  }[]
  meetingsFaculty: CSCEJSONMeeting[]
  reservedSeatSummary: null
  sectionAttributes: {
    class: string
    code: string
    courseReferenceNumber: string
    description: string
    isZTCAttribute: boolean
    termCode: string
  }[]
  termType: string
  instructionalMethod: string
  instructionalMethodDescription: string
  classRoster: string
  isAdvisor: boolean
}

const parse_time_csv = (time: string, time_zone_offset: number = 0): string => {
  let time_colon = time.indexOf(":");
  let time_space = time.indexOf(" ", time_colon + 1);
  let hour = +time.substring(0, time_colon);
  let minute = +time.substring(time_colon + 1, time_space);
  let meridiem = time.substring(time_space + 1);
  if ((meridiem === "PM") && (hour !== 12)) hour += 12;

  return `${(hour + time_zone_offset) % 24}:${minute}`;
};

const parse_time_json = (time: string, time_zone_offset: number = 0): string => {
  let hour = +time.substring(0, 2)
  let minute = +time.substring(2)

  return `${(hour + time_zone_offset) % 24}:${minute}`;
}

const getDaysMet = (meeting: CSCEJSONMeeting): Weekday[] => {
  const retval: Weekday[] = []
  if (meeting.meetingTime.monday) retval.push('Monday')
  if (meeting.meetingTime.tuesday) retval.push('Tuesday')
  if (meeting.meetingTime.wednesday) retval.push('Wednesday')
  if (meeting.meetingTime.thursday) retval.push('Thursday')
  if (meeting.meetingTime.friday) retval.push('Friday')
  if (meeting.meetingTime.saturday) retval.push('Saturday')
  if (meeting.meetingTime.sunday) retval.push('Sunday')
  return retval;
}

const parseJSONFile = (jsonFileAsText: string, courses: Course[]): Meeting[] => {
  const meetings: Meeting[] = []
  const json: CSCEJSONDatum[] = JSON.parse(jsonFileAsText).data
  for (let datum of json) {
    for (let jmeeting of datum.meetingsFaculty) {
      if (jmeeting.meetingTime.beginTime === null || jmeeting.meetingTime.endTime === null) continue;
      const meeting: Meeting = {
        course_id: -1,
        department: datum.subject,
        course_number: datum.courseNumber,
        section_number: datum.sequenceNumber,
        meeting_type: meeting_type.get(jmeeting.meetingTime.meetingType) as string,
        days_met: getDaysMet(jmeeting),
        start_time: parse_time_json(jmeeting.meetingTime.beginTime),
        end_time: parse_time_json(jmeeting.meetingTime.endTime)
      }
      if (datum.faculty?.length !== 0) {
        meeting.instructor = datum.faculty.map(faculty => faculty.displayName).join(', ')
      }
      if (jmeeting.meetingTime.building !== null && jmeeting.meetingTime.room !== null) {
        meeting.room = `${jmeeting.meetingTime.building} ${jmeeting.meetingTime.room}`
      }

      const filtered_sections = courses.filter(course => course.department === meeting.department && course.course_number === meeting.course_number)

      if (filtered_sections.length === 0) continue;

      meeting.course_id = filtered_sections[0].course_id

      meetings.push(meeting)
    }
  }

  return meetings;
};

const parseCSVFile = (csvFileAsText: string, courses: Course[]): Meeting[] => {
  const meetings: Meeting[] = []
  for (let row of csvFileAsText.split('\n').map(col => col.trim())) {
    if (row.length === 0) continue;
    let elements = row.split(',')
    const parsedRow: CSCECSVRow = {
      term: elements[0],
      course_section: elements[1],
      course_offering_id: +elements[2],
      days_met: elements[3],
      start_date: elements[4],
      end_date: elements[5],
      start_time: elements[6],
      end_time: elements[7],
      room: elements[8],
      instructor: elements[9]
    }

    let course_section_first_space = parsedRow.course_section.indexOf(" ");
    let course_section_slash = parsedRow.course_section.indexOf("/");
    let course_section_second_space = parsedRow.course_section.indexOf(
      " ",
      course_section_first_space + 1
    );

    const meeting: Meeting = {
      course_id: -1,
      department: parsedRow.course_section.slice(
        0,
        course_section_first_space
      ),
      course_number: parsedRow.course_section.slice(
        course_section_first_space + 1,
        course_section_slash
      ),
      section_number: parsedRow.course_section.slice(
        course_section_slash + 1,
        course_section_second_space
      ),
      meeting_type: meeting_type.get(parsedRow.course_section.slice(
        course_section_second_space + 1
      ) as MeetingType) as string,
      days_met: [...parsedRow.days_met.split('')].map(char => weekday.get(char) as Weekday),
      start_time: parse_time_csv(parsedRow.start_time),
      end_time: parse_time_csv(parsedRow.end_time),
    }
    if (parsedRow.room.length) {
      meeting.room = parsedRow.room
    }
    if (parsedRow.instructor.length) {
      meeting.instructor = parsedRow.instructor
    }

    const filtered_sections = courses.filter(course => course.department === meeting.department && course.course_number === meeting.course_number)

    if (filtered_sections.length === 0) continue;

    meeting.course_id = filtered_sections[0].course_id

    meetings.push(meeting)
  }

  return meetings;
};

const DEFAULT_BUTTON_TEXT: string = 'Upload New Semester'

const readInputFile = (file: File) => {
  const fileReader = new FileReader();

  fileReader.onload = async () => {
    if (fileReader.result === null) return;

    let btn = document.getElementById('upload-semester-button') as HTMLDivElement;
    if (btn !== null) btn.textContent = 'Reading File...';

    const courses: Course[] = (await axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/courses")).data

    let meetings: Meeting[]
    if (['csv', 'application/csv', 'text/csv'].includes(file.type))
      meetings = parseCSVFile(fileReader.result as string, courses);
    else if (['json', 'application/json', 'text/json'].includes(file.type))
      meetings = parseJSONFile(fileReader.result as string, courses);
    else
      return;

    if (window.confirm('If you upload this schedule, all of the data related to the current semester will be irrevocably destroyed.\n\nDo you wish to continue?')) {
      btn = document.getElementById('upload-semester-button') as HTMLDivElement;
      if (btn !== null) btn.textContent = 'Sending Courses...'
      API.sendNewMeetings(meetings).then((_response) => {
        btn = document.getElementById('upload-semester-button') as HTMLDivElement;
        if (btn !== null) btn.textContent = 'Upload Successful'
        setTimeout(() => { if (btn !== null) btn.textContent = DEFAULT_BUTTON_TEXT }, 10000)
        alert('Courses Succesfully Loaded into the Database')
      }).catch((_err) => {
        btn = document.getElementById('upload-semester-button') as HTMLDivElement
        if (btn !== null) btn.textContent = 'An error occurred.';
        setTimeout(() => { if (btn !== null) btn.textContent = DEFAULT_BUTTON_TEXT }, 10000)
      })
    } else {
      btn = document.getElementById('upload-semester-button') as HTMLDivElement
      if (btn !== null) btn.textContent = 'Upload Cancelled'
      setTimeout(() => { if (btn !== null) btn.textContent = DEFAULT_BUTTON_TEXT }, 10000)
    }
  }

  fileReader.readAsText(file);
}

export const ChangeoverFileUploadButton = () => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [prompt, setPrompt] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const clickRef: any = React.useRef(null);

  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (clickRef.current && !clickRef.current.contains(event.target) && prompt) {
        setPrompt(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value === "NEW SEMESTER") setButtonDisabled(false);
    else setButtonDisabled(true);
  }

  const handleClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files === null) return;

    setPrompt(false);
    readInputFile(event.currentTarget.files[0]);

    // Reset target.value to allow user
    // to upload a new file if desired. 
    if (event.currentTarget.files !== null) {
      event.currentTarget.files = null;
    }
  }

  return (
    <div className="admin-changeover">
      <input type="file" accept=".csv,text/csv,application/csv,.json,application/json,text/json" ref={fileInputRef} onChange={handleChange} style={{ display: "none" }} />
      <div className={`red button full ${prompt ? 'inline-prompt' : ''}`} style={{ padding: '0 10px' }} onClick={() => setPrompt(true)}>
        {prompt ?
          <div ref={clickRef} className="vstack" style={{ height: '100%' }}>
            <div className="vstack" style={{ height: '100%', padding: '10px' }}>
              <div>
                This button is for the start of a new semester with a new block schedule.
                By uploading a new schedule, you will irrevocably destroy all data related to the current semester.
                Any generated schedules will be invalidated, and any peer teacher schedules or lab preferences will be lost.
              </div>
              <div className="m10" />
              If you would like to proceed, please enter "NEW SEMESTER" in the text box below.
            </div>

            <input id={'changeover-text'} value={input} onChange={handleValidationChange} type="text" className="confirm" placeholder={`Type NEW SEMESTER to confirm`} />
            <div className="m10" />
            <div className="hstack">
              <button disabled={buttonDisabled} className="short button fill onred" onClick={handleClick}>Upload block schedule</button>
            </div>
            <div className="m5" />
          </div>
          :
          <div id="upload-semester-button" className="vstack" style={{ height: '100%', justifyContent: 'center' }}>
            {DEFAULT_BUTTON_TEXT}
          </div>
        }
      </div>
    </div>
  );
}
