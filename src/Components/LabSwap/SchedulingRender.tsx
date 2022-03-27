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
const cmp = (course1:CourseInstance, course2:APICourseBlock) => {
  return course1.course_number===course2.course_number && course1.start_time===course2.start_time&&course1.end_time===course2.end_time;
}
const filterValid = (courses:Array<APICourseBlock> | null) =>{
  let filtered: Array<CourseInstance> = [];
  let fidx = -1;
  let cidx = 0;
  while(courses!==null && cidx<courses.length){
    let c = courses[cidx];
    filtered.push({
      department: c.department,
      course_number: c.course_number,
      section_numbers: [c.section_number],
      start_time: c.start_time,
      end_time: c.end_time,
      weekday: c.weekday,
      place: c.place

    });
    fidx++;
    filtered[fidx].section_numbers=[courses[cidx].section_number];
    cidx++;
    // console.log(filtered[fidx])
    while(courses!==null && cidx<courses.length && cmp(filtered[fidx],courses[cidx])){ //while the next course in the array is compatiable with the current one
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
              < SchedulingColumn hours={hours} filter={filter} day={'Monday'} blocks={filterValid(blocks.Monday)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Tuesday'} blocks={filterValid(blocks.Tuesday)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Wednesday'} blocks={filterValid(blocks.Wednesday)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Thursday'} blocks={filterValid(blocks.Thursday)} />
              < SchedulingColumn hours={hours} filter={filter} day={'Friday'} blocks={filterValid(blocks.Friday)} />
            </>
          )}
        </contexts.blocks.Consumer>
      </div>
    </div>
  )
}
