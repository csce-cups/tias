import React, {FC, SetStateAction} from 'react'
import { SchedulingColumn } from './SchedulingColumn';
import { SchedulingTimes } from './SchedulingTimes';
import BlockFormer from './BlockFormer';

const hours = 11;
// const start = new Date(12*24*60*60*1000);
let start = new Date(0);
start.setHours(8);
interface CourseInstance { // Results of a join between course, course_section, and section_meetings
  course: number,   // Course_Number from Course
  section: number,  // Section_Number from Course_Section
  start: Date,      // Start_Time from Section_Meeting
  end: Date         // End_Time from Section_Meeting 
  sections: Array<number>
  // If the API returns more information from this I can add them to the interface here
}
interface Props {
  filter: any, //int -> bool
  select: any
}

export const SchedulingRender: FC<Props> = ({filter, select}) => {
  console.log(start);
  const cmp = (course1:any, course2:any) => {
    return course1.course===course2.course && course1.start===course2.start&&course1.end===course2.end;
  }
  const filterValid = (courses:Array<any>) =>{
    let filtered: Array<any> = [];
    let fidx = -1;
    let cidx=0;
    while(cidx<courses.length){
      filtered.push({...courses[cidx]});
      fidx++;
      filtered[fidx].sections=[courses[cidx].section];
      cidx++;
      // console.log(filtered[fidx])
      while(cidx<courses.length && cmp(filtered[fidx],courses[cidx])){ //while the next course in the array is compatiable with the current one
        filtered[fidx].sections.push(courses[cidx].section)
        cidx++;
      }
    }
    return filtered
  }
  // console.log(filterValid(BlockFormer.samples.M_schedule));
  return (
    <div className="render-container">
      < SchedulingTimes hours={hours} start={start}/>
      <div className="render-content">
        < SchedulingColumn hours={hours} day={'Monday'} blocks={filterValid(BlockFormer.samples.M_schedule)} filter={filter} select={select}/>
        < SchedulingColumn hours={hours} day={'Tuesday'} blocks={filterValid(BlockFormer.samples.TH_shcedule)} filter={filter} select={select}/>
        < SchedulingColumn hours={hours} day={'Wednesday'} blocks={filterValid(BlockFormer.samples.W_schedule)} filter={filter} select={select}/>
        < SchedulingColumn hours={hours} day={'Thursday'} blocks={filterValid(BlockFormer.samples.TH_shcedule)} filter={filter} select={select}/>
        < SchedulingColumn hours={hours} day={'Friday'} blocks={filterValid(BlockFormer.samples.F_schedule)} filter={filter} end={true} select={select}/>
      </div>
    </div>
  )
}
