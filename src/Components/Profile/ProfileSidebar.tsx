import React, { useContext } from 'react'
import { CourseBlock, CourseBlockWeek } from '../../modules/API'
import { findScheduled } from '../../modules/FindSchedule'
import contexts from '../APIContext'

type shortday = 'M' | 'T' | 'W' | 'R' | 'F';
interface DisplayBlock extends CourseBlock {
  days: (shortday)[]
}

export const ProfileSidebar = () => {
  const user = useContext(contexts.user);
  const [schedule,] = useContext(contexts.loadedSchedule);
  const formatDate = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = (hour === 12) ? 12 : hour % 12;
    const minutes = minute < 10 ? `0${minute}` : minute;
    return `${hour12}:${minutes} ${ampm}`;
  }

  const renderScheduled = (retData: CourseBlock[]) => {    
    let retFormat: DisplayBlock[] = [];
    let ret: JSX.Element[] = [];

    const shortDays = ['M', 'T', 'W', 'R', 'F'];
    const dayMap = new Map<string, shortday>(
      [
        ['Monday', 'M'],
        ['Tuesday', 'T'],
        ['Wednesday', 'W'],
        ['Thursday', 'R'],
        ['Friday', 'F']
      ]
    )

    const cmpDay = (a: shortday, b: shortday) => {
      if (shortDays.indexOf(a) < shortDays.indexOf(b)) return -1;
      else if (shortDays.indexOf(a) > shortDays.indexOf(b)) return 1;
      return 0;
    }

    retData.sort((a, b) => {
      if (cmpDay(dayMap.get(a.weekday)!, dayMap.get(b.weekday)!) !== 0) return cmpDay(dayMap.get(a.weekday)!, dayMap.get(b.weekday)!);
      else if (a.start_time < b.start_time) return -1;
      else if (a.start_time > b.start_time) return 1;
      else if (a.course_number < b.course_number) return -1;
      else if (a.course_number > b.course_number) return 1;
      else if (a.section_number < b.section_number) return -1;
      else if (a.section_number > b.section_number) return 1;
      return 0;
    }).forEach(block => {
      const where = retFormat.findIndex(b => b.course_number === block.course_number && b.section_number === block.section_number);
      if (where === -1) retFormat.push({...block, days: [dayMap.get(block.weekday) as shortday]})
      else retFormat[where].days.push(dayMap.get(block.weekday) as shortday);
    })

    retFormat.forEach(block => {
      ret.push(
        <div className="schedule-info-element" key={`sie-${JSON.stringify(block)}`}>
          <div>
            {block.department}: {block.course_number}-{block.section_number}
          </div>
          <div>
            {formatDate(block.start_time)}-{formatDate(block.end_time)} {block.days.join('')}
          </div>
          <div>
            Professor {block.professor}
          </div>
          <div>
            {block.place}
          </div>
        </div>
      )
    })

    return ret;
  }

  const img = (googleData: any) => {
    try {
      return <img alt="" src={(googleData !== {})? googleData.eN : undefined} className="profile-picture" referrerPolicy="no-referrer"/>
    } catch (err) {
      return <div>No Image</div>
    }
  }

  const name = (googleData: any) => {
    try {
      return <span>{googleData.tf}</span>
    } catch (err) {
      return <span>Loading...</span>
    }
  }

  const titles = () => {
    let str = '';
    if (user.user?.peer_teacher) str += 'Peer Teacher';
    if (user.user?.teaching_assistant) str += `${(str === '')? '' : ', '}Teaching Assistant`;
    if (user.user?.professor) str += `${(str === '')? '' : ', '}Professor`;
    if (user.user?.administrator) str += `${(str === '')? '' : ', '}Administrator`;
    return str;
  }

  return (
    <div className="profile-sidebar">
      <div style={{height: '100px'}}/>
      <span>{titles()}</span>
      < contexts.googleData.Consumer >
        {([googleData, _]) => (
          <>
            <div className="hstack">
              {img(googleData)}
            </div>
            <span>{name(googleData)}</span>
          </>
        )}
      </contexts.googleData.Consumer>
      < contexts.blocks.Consumer >
      {([week,]) => {
        const retData = findScheduled(week);
        return (
          <div className="schedule-info-container">
            { (retData.length === 0 && schedule.size > 0)?
              <>
                <div className="loading-inline">No assigned labs</div>
              </>
              : (retData.length === 0)?
              <>
                <div className="loading-inline">Scheduling hasn't happened.</div>
                <div className="loading-inline">Check back later!</div>
              </>
              :
              <>
                <div className="schedule-info-title">Currently Scheduled For:</div>
                { renderScheduled(retData) }
              </>
            }
          </div>
        )
      }}
      </contexts.blocks.Consumer>
    </div>
  )
}
