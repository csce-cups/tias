import React, {FC} from 'react'
import { SchedulingColumn } from './SchedulingColumn';
import { SchedulingTimes } from './SchedulingTimes';
import BlockFormer from '../../modules/BlockFormer';
import { contexts } from '../APIContext';
import { APICourseBlockWeek, APICourseBlock } from '../../modules/API';

const hours = 12;
// const start = new Date(12*24*60*60*1000);
let start = new Date(0);
start.setHours(8);
interface CourseInstance{
  department: string
	course_number: number
	section_numbers: Array<number>
	start_time: Date
	end_time: Date
	weekday: string
	place: string
}
interface Props {
  filter: Object //int -> bool
}
const cmp = (course1:CourseInstance, course2:APICourseBlock, debug:boolean) => {
  // if(debug && course1.course_number!==course2.course_number){
  //   console.log({course1,course2,t:"DIFFER NUM"})
  // }
  // if(debug && course1.start_time!==course2.start_time){
  //   console.log({course1,course2,t:"DIFFER START"})
  // }
  // if(debug && course1.end_time!==course2.end_time){
  //   console.log({course1,course2,t:"DIFFER END"})
  // }
  return course1.course_number===course2.course_number && course1.start_time.getTime()===course2.start_time.getTime() && course1.end_time.getTime()===course2.end_time.getTime();
}
const compressValid = (courses:Array<APICourseBlock>|null, debug:boolean) =>{
  let filtered: Array<CourseInstance> = [];
  if(courses===null){
    return filtered;
  }
  let fidx = -1;
  let cidx = 0;
  while(cidx<courses.length){
    let c = courses[cidx];
    filtered.push({ //make object from current section to push
      department: c.department,
      course_number: c.course_number,
      section_numbers: [c.section_number],
      start_time: c.start_time,
      end_time: c.end_time,
      weekday: c.weekday,
      place: c.place
    });
    fidx++; //update to the newly added index
    cidx++; //move to the next uncondensed section
    //while the next course in the array is compatiable with the current one
    while(cidx<courses.length && cmp(filtered[fidx],courses[cidx],debug)){ 
      filtered[fidx].section_numbers.push(courses[cidx].section_number)
      cidx++;
    }
  }
  return filtered
}
export const SchedulingRender: FC<Props> = ({filter}) => {
  return (
    <div className="render-container">
      < SchedulingTimes hours={hours} start={start}/>
      <div className="render-content">
        < contexts.blocks.Consumer >
          { (blocks: APICourseBlockWeek) => (
            <>
              < SchedulingColumn hours={hours} filter={filter} day={'Monday'} blocks={compressValid(blocks.Monday, false)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Tuesday'} blocks={compressValid(blocks.Tuesday, false)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Wednesday'} blocks={compressValid(blocks.Wednesday, false)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Thursday'} blocks={compressValid(blocks.Thursday, false)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Friday'} blocks={compressValid(blocks.Friday, false)} />
            </>
          )}
        </contexts.blocks.Consumer>
      </div>
    </div>
  )
}
