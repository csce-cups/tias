import React, { FC } from 'react';
import { SchedulingBlock } from './SchedulingBlock';

let numHours = 11;

interface Props {
  blocks: any, // The blocks to be displayed for this day of the week
  end? : boolean, // Basic styling prop, the column on the end doesn't get a border on the right
  filter: Object,
  day: string, // The day of the week
  hours?: number, // The number of hours in a day
}

interface CourseInstance { // Results of a join between course, course_section, and section_meetings
  course: number,   // Course_Number from Course
  section: number,  // Section_Number from Course_Section
  start: Date,      // Start_Time from Section_Meeting
  end: Date         // End_Time from Section_Meeting 
  // If the API returns more information from this I can add them to the interface here
}

// Breaks for 3 different lengths in a block
const d_len = (e: CourseInstance | {course: number, section: number, start: Date, end: Date}) => { return e.end.getTime() - e.start.getTime(); }

const time_to_height = (start: Date, end: Date, max: number = numHours*60*60*1000) => {
  return (end.getTime() - start.getTime()) / max * 100;
}

const start_time_to_top = (start: Date, pstart: Date = new Date(0), parent: number = numHours*60*60*1000) => {
  return (start.getTime() - pstart.getTime()) / parent * 100;
}

const generateBlocks = (data: CourseInstance[], filter: any) => {
  // Data should be sorted by start time, class length, course number, and then by section number
  data.sort((a, b) => {
    // Sort by start time
    if (a.start.getTime() < b.start.getTime()) return -1;
    else if (a.start.getTime() > b.start.getTime()) return 1;
    
    // Sort by class length
    else if (d_len(a) > d_len(b)) return -1;
    else if (d_len(a) < d_len(b)) return 1;

    // Sort by course number
    else if (a.course < b.course) return -1;
    else if (a.course > b.course) return 1;

    // Sort by section number
    else if (a.section < b.section) return -1;
    else if (a.section > b.section) return 1;
    
    // They're equal
    else return 0;
  });

  let base: any = [];
  let i = 0;
  while (i < data.length) {

    let outer: any = [];
    let max = data[i];
    while (i < data.length && data[i].start.getTime() >= max.start.getTime() && data[i].end.getTime() <= max.end.getTime()) {

      let inner: any = [];
      while (i < data.length && d_len(data[i]) < d_len(max) 
        && data[i].start.getTime() >= max.start.getTime() && data[i].end.getTime() <= max.end.getTime()) {

        let temp_arr: any = [];
        let temp = data[i];
        while (i < data.length && data[i].start.getTime() === temp.start.getTime() && data[i].end.getTime() === temp.end.getTime()
          && data[i].start.getTime() >= max.start.getTime() && data[i].end.getTime() <= max.end.getTime()) {

          temp_arr.push(data[i]);
          i++;
        }
        
        if (temp_arr.length > 0) inner.push(temp_arr);

      }
      
      if (inner.length > 0) outer.push(inner);
      else { outer.push(data[i]); i++;}

    }
    
    base.push(outer);

  }
  
  return placeBlocks(base, filter);

}
  
const placeBlocks = (blocks: CourseInstance[], filter: any) => {
  const unravel = (outer: CourseInstance | CourseInstance[][], parent: CourseInstance) => {
    if (Array.isArray(outer)) {
      return (
        // Needs a key
        <div className="vstack">
          { outer.map(row => (
            // Needs a key
            <div className="hstack block-container" style={{
              height: `${time_to_height(row[0].start, row[0].end, d_len(parent))}%`,
              top: `${start_time_to_top(row[0].start, parent.start, d_len(parent))}%`
            }}>
              { row.map(c => (
                // Needs a key
                < SchedulingBlock course_instance={c} visible={filter[c.course]} />
              )) }
            </div>
          ))}
        </div>
      )
    } else {
      return (
        // Needs a key
        < SchedulingBlock course_instance={outer} visible={filter[outer.course]} />
      )
    }
  }

  let maxes: any = [];
  blocks.forEach((set: any) => {
    maxes.push(set.reduce((p: any, e: any) => {
      if (Array.isArray(e)) { return p; }
      else if (Array.isArray(p)) { return e; }
      else return d_len(p) > d_len(e) ? p : e;
    }))
  })

  return (
    <>
      { blocks.map((set: any, idx: number) => (
        // Needs a key
        <div className="block-container hstack fill" style={{ 
          padding: 0, 
          height: `${time_to_height(set[0].start, set[0].end)}%`,
          top: `${start_time_to_top(set[0].start)}%`
        }}>
          { set.map((outer: any) => (
            unravel(outer, maxes[idx])
          ))}
        </div>
      ))}
    </>
  )
}

export const SchedulingColumn: FC<Props> = ({blocks, end, filter, day, hours}) => {
  let style = {};
  if (end) {
    style = {border: '0'}
  }

  if (hours !== undefined) numHours = hours;

  let dividers = [];
  for (let i = 0; i < numHours; i++) {
    // Needs a key
    dividers[i] = <div className="divider"></div>;
  }

  return (
    <div className="vstack grow-h day" style={style} >
      <div className="day-label">
        <b>{day}</b>
      </div>
      <div className="vstack day" style={style} >
        { dividers }
        { generateBlocks(blocks, filter) }
      </div>
    </div>
  )
}
