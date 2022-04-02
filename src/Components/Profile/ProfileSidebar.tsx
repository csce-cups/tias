import React from 'react'
import { CourseBlock, CourseBlockWeek, parseCookie } from '../../modules/API'
import contexts from '../APIContext'

interface DisplayBlock extends CourseBlock {
  days: ('M' | 'T' | 'W' | 'R' | 'F')[]
}

export const ProfileSidebar = () => {
  const findScheduled = (week: CourseBlockWeek) => {
    const id = parseCookie().tias_user_id;
    let retData: CourseBlock[] = [];
    let retFormat: DisplayBlock[] = [];
    let ret: JSX.Element[] = [];

    const days = [week.Monday, week.Tuesday, week.Wednesday, week.Thursday, week.Friday];
    days.forEach(day => {
      day?.forEach(block => {
        console.log(block);
        console.log(block.scheduled?.includes(+id))
        if (block.scheduled?.includes(+id)) retData.push(block)
      })
    })

    const dayMap = new Map(
      [
        ['Monday', 'M'],
        ['Tuesday', 'T'],
        ['Wednesday', 'W'],
        ['Thursday', 'R'],
        ['Friday', 'F']
      ]
    )

    retData.sort((a, b) => {
      if (a.course_number < b.course_number) return -1;
      else if (a.course_number > b.course_number) return 1;
      else if (a.section_number < b.section_number) return -1;
      else if (a.section_number > b.section_number) return 1;
      return 0;
    }).forEach(block => {
      const where = retFormat.findIndex(b => b.course_number === block.course_number && b.section_number === block.section_number);
      if (where === -1) retFormat.push({...block, days: [dayMap.get(block.weekday) as 'M' | 'T' | 'W' | 'R' | 'F']})
      else retFormat[where].days.push(dayMap.get(block.weekday) as 'M' | 'T' | 'W' | 'R' | 'F');
    })

    retFormat.forEach(block => {
      ret.push(
        <div className="schedule-info-element" key={`sie-${JSON.stringify(block)}`}>
          <div>
            {block.course_number}-{block.section_number} on {block.days.join('')}
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
      return <img alt="" src={(googleData !== {})? googleData.getImageUrl() : undefined} className="profile-picture"/>
    } catch (TypeError) {
      return <div>No Image</div>
    }
  }

  const name = (googleData: any) => {
    try {
      return <span>{googleData.getGivenName()} {googleData.getFamilyName()}</span>
    } catch (TypeError) {
      return <span>Loading...</span>
    }
  }

  return (
    <div className="profile-sidebar">
      <div style={{height: '100px'}}/>
      <span>Peer Teacher</span>
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
      <div className="schedule-info-container">
        <div className="schedule-info-title">Currently Scheduled For:</div>
        < contexts.blocks.Consumer >
          {([week,]) => findScheduled(week)}
        </contexts.blocks.Consumer>
      </div>
    </div>
  )
}
