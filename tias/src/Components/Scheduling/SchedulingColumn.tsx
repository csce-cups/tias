import React, { FC } from 'react';
import { SchedulingBlock } from './SchedulingBlock';

const classlength = 50;
const breaklength = 10;

let A = new Date(0);
let A_short = new Date(A.getTime() + 1000*60*classlength); 
let A_long = new Date(A.getTime() + 1000*60*(classlength*2+breaklength));
let A_extralong = new Date(A.getTime() + 1000*60*(classlength*3+breaklength*2));

let B = new Date(A.getTime() + 1000*60*(classlength+breaklength));
let B_short = new Date(B.getTime() + 1000*60*classlength);
let B_long = new Date(B.getTime() + 1000*60*(classlength*2+breaklength));

let C = new Date(B.getTime() + 1000*60*(classlength+breaklength));
let C_short = new Date(C.getTime() + 1000*60*classlength);

let A2 = new Date(A.getTime() + 1000*60*(3*classlength+3*breaklength));
let A2_short = new Date(A2.getTime() + 1000*60*classlength); 
let A2_long = new Date(A2.getTime() + 1000*60*(classlength*2+breaklength));
let A2_extralong = new Date(A2.getTime() + 1000*60*(classlength*3+breaklength*2));

let B2 = new Date(A2.getTime() + 1000*60*(classlength+breaklength));
let B2_short = new Date(B2.getTime() + 1000*60*classlength);
let B2_long = new Date(B2.getTime() + 1000*60*(classlength*2+breaklength));

let C2 = new Date(B2.getTime() + 1000*60*(classlength+breaklength));
let C2_short = new Date(C2.getTime() + 1000*60*classlength);

let A3 = new Date(A2.getTime() + 1000*60*(3*classlength+3*breaklength));
let A3_short = new Date(A3.getTime() + 1000*60*classlength); 
let A3_long = new Date(A3.getTime() + 1000*60*(classlength*2+breaklength));
let A3_extralong = new Date(A3.getTime() + 1000*60*(classlength*3+breaklength*2));

let B3 = new Date(A3.getTime() + 1000*60*(classlength+breaklength));
let B3_short = new Date(B3.getTime() + 1000*60*classlength);
let B3_long = new Date(B3.getTime() + 1000*60*(classlength*2+breaklength));

let C3 = new Date(B3.getTime() + 1000*60*(classlength+breaklength));
let C3_short = new Date(C3.getTime() + 1000*60*classlength);

const numHours = 12;
interface Props {
  end? : boolean
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
const generateBlocks = (data: CourseInstance[]) => {
  console.log(data);
  
  data.sort((a, b) => {
    
    // Sort by start.getTime() time
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
  
  console.log(data);
  console.log("==============================================================")

  let layered_data: any = [];
  let outer_buffered_data: any = [];
  let inner_buffered_data: any = [];
  let i = 0;
  while (i < data.length) {
    console.log("BASE", i, data[i], outer_buffered_data, inner_buffered_data)
    let top_start = data[i].start.getTime();
    let top_len = d_len(data[i]);
    let prev_start = top_start;
    while (i < data.length && d_len(data[i]) === top_len && data[i].start.getTime() === top_start) {
      console.log("OUTER INSERT", data[i]);
      outer_buffered_data.push(data[i]);
      i++;
      
      let inner_buffered_data_set: any = [];
      while (i < data.length && d_len(data[i]) < top_len) {
        console.log("INNER START", data[i], d_len(data[i]), top_len);
        while (i < data.length && data[i].start.getTime() === prev_start) {
          console.log("INNER INSERT", data[i], data[i].start.getTime(), prev_start);
          inner_buffered_data.push(data[i]);
          i++
        }
        if (inner_buffered_data.length > 0) {
          prev_start = (i < data.length)? data[i].start.getTime() : prev_start;
          console.log("INNER PUSH", inner_buffered_data, i-1 < data.length, data[i-1].start.getTime(), prev_start);
          inner_buffered_data_set.push(inner_buffered_data);
          inner_buffered_data = [];
        } else {
          break;
        }
      }

      if (inner_buffered_data_set.length > 0) {
        console.log("SET PUSH");
        outer_buffered_data.push(inner_buffered_data_set);
        inner_buffered_data = [];
      }
    }
    console.log("OUTER PUSH", outer_buffered_data);
    layered_data.push(outer_buffered_data);
    outer_buffered_data = [];
  }

  let a: any = [
    [
      {course: 121, section: 1210, start: A, end: A_extralong},
      [
        [
          {course: 121, section: 1211, start: A, end: A_short},
          {course: 121, section: 1212, start: A, end: A_short},
          {course: 121, section: 1213, start: A, end: A_short},
          {course: 121, section: 1214, start: A, end: A_short},
          {course: 121, section: 1215, start: A, end: A_short},
        ],
        [
          {course: 121, section: 1216, start: new Date(A_short.getTime() + 1000*60*breaklength), end: A_long},
        ]
      ]
    ],
    [
      {course: 121, section: 1218, start: A2, end: A2_extralong},
    ]
  ];
  console.log(layered_data);
  console.log(a);
  return placeLevel(layered_data);
  return placeLevel(a);
}

const time_to_height = (start: Date, end: Date, max: number = numHours*60*60*1000) => {
  return (end.getTime() - start.getTime()) / max * 100;
}

const start_time_to_top = (e: any, start: Date, pstart: Date = new Date(0), parent: number = numHours*60*60*1000) => {
  return (start.getTime() - pstart.getTime()) / parent * 100;
}
  
const placeLevel = (blocks: CourseInstance[]) => {
  const unwrap = (outer: CourseInstance | CourseInstance[][], parent: CourseInstance) => {
    if (Array.isArray(outer)) {
      return (
        <div className="vstack fill">
          { outer.map(row => (
            <div className="hstack block-container" style={{
              height: `${time_to_height(row[0].start, row[0].end, d_len(parent))}%`,
              top: `${start_time_to_top(row[0], row[0].start, parent.start, d_len(parent))}%`
            }}>
              { row.map(c => (
                < SchedulingBlock course_instance={c} />
              )) }
            </div>
          ))}
        </div>
      )
    } else {
      return (
        < SchedulingBlock course_instance={outer} />
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
        <div className="block-container hstack fill" style={{ 
          padding: 0, 
          height: `${time_to_height(set[0].start, set[0].end)}%`,
          top: `${start_time_to_top(set[0], set[0].start)}%`
        }}>
          { set.map((outer: any) => (
            unwrap(outer, maxes[idx])
          ))}
        </div>
      ))}
    </>
  )
}

export const SchedulingColumn: FC<Props> = ({end}) => {
  // let blocks: any = [
  //   {course: 121, section: 1210, start: A, end: A_extralong},
  //   {course: 121, section: 1211, start: A, end: A_short},
  //   {course: 121, section: 1212, start: A, end: A_short},
  //   {course: 121, section: 1213, start: C, end: C_short},
  //   {course: 221, section: 2210, start: A, end: A_extralong},
  //   {course: 313, section: 3130, start: A, end: A_extralong},
  //   {course: 121_2, section: 11210, start: A2, end: A2_extralong},
  //   {course: 121_2, section: 11212, start: A2, end: A2_short},
  //   {course: 121_2, section: 11212, start: A2, end: A2_short},
  //   {course: 121_2, section: 11213, start: C2, end: C2_short},
  //   {course: 221_2, section: 12210, start: A2, end: A2_extralong},
  //   {course: 221_2, section: 12211, start: A2, end: A2_extralong},
  // ];
  let blocks: any = [
    {course: 121, section: 1, start:  A, end: A_extralong},
    {course: 121, section: 2, start:  A, end: A_short},
    {course: 121, section: 3, start:  A, end: A_short},
    {course: 221, section: 4, start:  A, end: A_short},
    {course: 221, section: 5, start:  A, end: A_short},
    {course: 313, section: 6, start:  A, end: A_short},
    {course: 221, section: 7, start:  B, end: B_short},
    {course: 313, section: 8, start:  B, end: B_short},
    {course: 121, section: 9, start:  C, end: C_short},
    {course: 221, section: 10, start: C, end: C_short},
    {course: 313, section: 11, start: C, end: C_short},
    
    {course: 121, section: 12, start: A2, end: A2_extralong},
    {course: 121, section: 13, start: A2, end: A2_short},
    {course: 221, section: 14, start: A2, end: A2_extralong},
    {course: 313, section: 15, start: A2, end: A2_short},
    {course: 313, section: 16, start: B2, end: B2_short},
    {course: 221, section: 17, start: C2, end: C2_short},
    {course: 314, section: 18, start: A2, end: A2_extralong},
    {course: 314, section: 19, start: A2, end: A2_short},
    {course: 314, section: 20, start: C2, end: C2_short},
    {course: 121, section: 21, start: C2, end: C2_short},
    
    {course: 121, section: 21, start: A3, end: A3_short},
    {course: 121, section: 22, start: A3, end: A3_short},
    {course: 121, section: 23, start: B3, end: B3_short},
    {course: 221, section: 24, start: A3, end: A3_extralong},
    {course: 221, section: 25, start: C3, end: C3_short},
    {course: 313, section: 26, start: A3, end: A3_extralong},
    {course: 314, section: 27, start: A3, end: A3_extralong},
  ];


  let style = {};
  if (end) {
    style = {border: '0'}
  }

  let dividers = [];
  for (let i = 0; i < numHours; i++) {
    dividers[i] = <div className="divider"></div>;
  }

  // console.log(blocks);

  return (
    <div className="vstack grow-h day" style={style}>
      {dividers}
      { generateBlocks(blocks) }
    </div>
  )
}
