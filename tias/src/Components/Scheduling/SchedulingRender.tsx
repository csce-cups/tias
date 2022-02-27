import React from 'react'
import { SchedulingColumn } from './SchedulingColumn';

const MW_classlength = 50;
const TH_classlength = 75;
const breaklength = 20;

let MW_A = new Date(0);
let MW_A_short = new Date(MW_A.getTime() + 1000*60*MW_classlength); 
let MW_A_long = new Date(MW_A.getTime() + 1000*60*(MW_classlength*2+breaklength));
let MW_A_extralong = new Date(MW_A.getTime() + 1000*60*(MW_classlength*3+breaklength*2));

let MW_B = new Date(MW_A.getTime() + 1000*60*(MW_classlength+breaklength));
let MW_B_short = new Date(MW_B.getTime() + 1000*60*MW_classlength);
let MW_B_long = new Date(MW_B.getTime() + 1000*60*(MW_classlength*2+breaklength));

let MW_C = new Date(MW_B.getTime() + 1000*60*(MW_classlength+breaklength));
let MW_C_short = new Date(MW_C.getTime() + 1000*60*MW_classlength);

let MW_A2 = new Date(MW_A.getTime() + 1000*60*(3*MW_classlength+3*breaklength));
let MW_A2_short = new Date(MW_A2.getTime() + 1000*60*MW_classlength); 
let MW_A2_long = new Date(MW_A2.getTime() + 1000*60*(MW_classlength*2+breaklength));
let MW_A2_extralong = new Date(MW_A2.getTime() + 1000*60*(MW_classlength*3+breaklength*2));

let MW_B2 = new Date(MW_A2.getTime() + 1000*60*(MW_classlength+breaklength));
let MW_B2_short = new Date(MW_B2.getTime() + 1000*60*MW_classlength);
let MW_B2_long = new Date(MW_B2.getTime() + 1000*60*(MW_classlength*2+breaklength));

let MW_C2 = new Date(MW_B2.getTime() + 1000*60*(MW_classlength+breaklength));
let MW_C2_short = new Date(MW_C2.getTime() + 1000*60*MW_classlength);

let MW_A3 = new Date(MW_A2.getTime() + 1000*60*(3*MW_classlength+3*breaklength));
let MW_A3_short = new Date(MW_A3.getTime() + 1000*60*MW_classlength); 
let MW_A3_long = new Date(MW_A3.getTime() + 1000*60*(MW_classlength*2+breaklength));
let MW_A3_extralong = new Date(MW_A3.getTime() + 1000*60*(MW_classlength*3+breaklength*2));

let MW_B3 = new Date(MW_A3.getTime() + 1000*60*(MW_classlength+breaklength));
let MW_B3_short = new Date(MW_B3.getTime() + 1000*60*MW_classlength);
let MW_B3_long = new Date(MW_B3.getTime() + 1000*60*(MW_classlength*2+breaklength));

let MW_C3 = new Date(MW_B3.getTime() + 1000*60*(MW_classlength+breaklength));
let MW_C3_short = new Date(MW_C3.getTime() + 1000*60*MW_classlength);


let TH_A = new Date(0);
let TH_A_short = new Date(TH_A.getTime() + 1000*60*TH_classlength); 
let TH_A_long = new Date(TH_A.getTime() + 1000*60*(TH_classlength*2+breaklength));
let TH_A_extralong = new Date(TH_A.getTime() + 1000*60*(TH_classlength*3+breaklength*2));

let TH_B = new Date(TH_A.getTime() + 1000*60*(TH_classlength+breaklength));
let TH_B_short = new Date(TH_B.getTime() + 1000*60*TH_classlength);
let TH_B_long = new Date(TH_B.getTime() + 1000*60*(TH_classlength*2+breaklength));

let TH_C = new Date(TH_B.getTime() + 1000*60*(TH_classlength+breaklength));
let TH_C_short = new Date(TH_C.getTime() + 1000*60*TH_classlength);

let TH_A2 = new Date(TH_A.getTime() + 1000*60*(3*TH_classlength+3*breaklength));
let TH_A2_short = new Date(TH_A2.getTime() + 1000*60*TH_classlength); 
let TH_A2_long = new Date(TH_A2.getTime() + 1000*60*(TH_classlength*2+breaklength));
let TH_A2_extralong = new Date(TH_A2.getTime() + 1000*60*(TH_classlength*3+breaklength*2));

let TH_B2 = new Date(TH_A2.getTime() + 1000*60*(TH_classlength+breaklength));
let TH_B2_short = new Date(TH_B2.getTime() + 1000*60*TH_classlength);
let TH_B2_long = new Date(TH_B2.getTime() + 1000*60*(TH_classlength*2+breaklength));

let TH_C2 = new Date(TH_B2.getTime() + 1000*60*(TH_classlength+breaklength));
let TH_C2_short = new Date(TH_C2.getTime() + 1000*60*TH_classlength);

let TH_A3 = new Date(TH_A2.getTime() + 1000*60*(3*TH_classlength+3*breaklength));
let TH_A3_short = new Date(TH_A3.getTime() + 1000*60*TH_classlength); 
let TH_A3_long = new Date(TH_A3.getTime() + 1000*60*(TH_classlength*2+breaklength));
let TH_A3_extralong = new Date(TH_A3.getTime() + 1000*60*(TH_classlength*3+breaklength*2));

let TH_B3 = new Date(TH_A3.getTime() + 1000*60*(TH_classlength+breaklength));
let TH_B3_short = new Date(TH_B3.getTime() + 1000*60*TH_classlength);
let TH_B3_long = new Date(TH_B3.getTime() + 1000*60*(TH_classlength*2+breaklength));

let TH_C3 = new Date(TH_B3.getTime() + 1000*60*(TH_classlength+breaklength));
let TH_C3_short = new Date(TH_C3.getTime() + 1000*60*TH_classlength);

const M_schedule: any = [
  // MONDAYS //
  {course: 121, section: 1, start:  MW_A, end: MW_A_short},
  {course: 121, section: 1, start:  MW_A, end: MW_A_short},
  {course: 121, section: 1, start:  MW_A, end: MW_A_short},
  {course: 221, section: 1, start:  MW_A, end: MW_A_short},
  {course: 221, section: 1, start:  MW_A, end: MW_A_short},
  {course: 313, section: 1, start:  MW_A, end: MW_A_short},

  {course: 121, section: 2, start:  MW_B, end: MW_B_short},
  {course: 121, section: 2, start:  MW_B, end: MW_B_short},
  {course: 121, section: 2, start:  MW_B, end: MW_B_short},
  {course: 221, section: 2, start:  MW_B, end: MW_B_short},
  {course: 221, section: 2, start:  MW_B, end: MW_B_short},
  {course: 313, section: 2, start:  MW_B, end: MW_B_short},

  {course: 121, section: 3, start:  MW_C, end: MW_C_short},
  {course: 121, section: 3, start:  MW_C, end: MW_C_short},
  {course: 121, section: 3, start:  MW_C, end: MW_C_short},
  {course: 221, section: 3, start:  MW_C, end: MW_C_short},
  {course: 221, section: 3, start:  MW_C, end: MW_C_short},
  {course: 313, section: 3, start:  MW_C, end: MW_C_short},


  {course: 121, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 4, start:  MW_A2, end: MW_A2_short},

  {course: 121, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 315, section: 5, start:  MW_B2, end: MW_B2_short},

  {course: 121, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 6, start:  MW_C2, end: MW_C2_short},
  

  {course: 121, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 121, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 121, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 7, start:  MW_A3, end: MW_A3_short},

  {course: 121, section: 8, start:  MW_B3, end: MW_B3_short},
  {course: 121, section: 8, start:  MW_B3, end: MW_B3_short},
  {course: 121, section: 8, start:  MW_B3, end: MW_B3_short},
  {course: 221, section: 8, start:  MW_B3, end: MW_B3_short},
  {course: 221, section: 8, start:  MW_B3, end: MW_B3_short},
  {course: 313, section: 8, start:  MW_B3, end: MW_B3_short},

  {course: 121, section: 9, start:  MW_C3, end: MW_C3_short},
  {course: 121, section: 9, start:  MW_C3, end: MW_C3_short},
  {course: 121, section: 9, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 9, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 9, start:  MW_C3, end: MW_C3_short},
  {course: 313, section: 9, start:  MW_C3, end: MW_C3_short},
  {course: 313, section: 9, start:  MW_C3, end: MW_C3_short},
];

const TH_shcedule: any = [
  {course: 121, section: 1, start:  TH_A, end: TH_A_short},
  {course: 121, section: 1, start:  TH_A, end: TH_A_short},
  {course: 121, section: 1, start:  TH_A, end: TH_A_short},
  {course: 221, section: 1, start:  TH_A, end: TH_A_short},
  {course: 221, section: 1, start:  TH_A, end: TH_A_short},
  {course: 313, section: 1, start:  TH_A, end: TH_A_short},
  
  {course: 121, section: 2, start:  TH_B, end: TH_B_short},
  {course: 121, section: 2, start:  TH_B, end: TH_B_short},
  {course: 121, section: 2, start:  TH_B, end: TH_B_short},
  {course: 221, section: 2, start:  TH_B, end: TH_B_short},
  {course: 221, section: 2, start:  TH_B, end: TH_B_short},
  {course: 313, section: 2, start:  TH_B, end: TH_B_short},

  {course: 121, section: 3, start:  TH_C, end: TH_C_short},
  {course: 121, section: 3, start:  TH_C, end: TH_C_short},
  {course: 121, section: 3, start:  TH_C, end: TH_C_short},
  {course: 221, section: 3, start:  TH_C, end: TH_C_short},
  {course: 221, section: 3, start:  TH_C, end: TH_C_short},
  {course: 313, section: 3, start:  TH_C, end: TH_C_short},
  {course: 313, section: 3, start:  TH_C, end: TH_C_short},
  {course: 313, section: 3, start:  TH_C, end: TH_C_short},

  {course: 121, section: 4, start:  TH_B2, end: TH_B2_short},
  {course: 221, section: 4, start:  TH_B2, end: TH_B2_short},
  {course: 313, section: 4, start:  TH_B2, end: TH_B2_short},

  {course: 121, section: 5, start:  TH_C2, end: TH_C2_short},
  {course: 221, section: 5, start:  TH_C2, end: TH_C2_short},

  {course: 121, section: 6, start:  TH_A3, end: TH_A3_short},
];

const W_schedule: any = [
  // MONDAYS //
  {course: 121, section: 1, start:  MW_A, end: MW_A_short},
  {course: 121, section: 1, start:  MW_A, end: MW_A_short},
  {course: 121, section: 1, start:  MW_A, end: MW_A_short},
  {course: 221, section: 1, start:  MW_A, end: MW_A_short},
  {course: 221, section: 1, start:  MW_A, end: MW_A_short},
  {course: 313, section: 1, start:  MW_A, end: MW_A_short},
  {course: 313, section: 1, start:  MW_A, end: MW_A_short},
  {course: 313, section: 1, start:  MW_A, end: MW_A_short},

  {course: 121, section: 2, start:  MW_B, end: MW_B_short},
  {course: 121, section: 2, start:  MW_B, end: MW_B_short},
  {course: 121, section: 2, start:  MW_B, end: MW_B_short},
  {course: 221, section: 2, start:  MW_B, end: MW_B_short},
  {course: 221, section: 2, start:  MW_B, end: MW_B_short},
  {course: 313, section: 2, start:  MW_B, end: MW_B_short},
  {course: 313, section: 2, start:  MW_B, end: MW_B_short},
  {course: 313, section: 2, start:  MW_B, end: MW_B_short},

  {course: 121, section: 3, start:  MW_C, end: MW_C_short},
  {course: 121, section: 3, start:  MW_C, end: MW_C_short},
  {course: 121, section: 3, start:  MW_C, end: MW_C_short},
  {course: 121, section: 3, start:  MW_C, end: MW_C_short},
  {course: 221, section: 3, start:  MW_C, end: MW_C_short},
  {course: 221, section: 3, start:  MW_C, end: MW_C_short},
  {course: 221, section: 3, start:  MW_C, end: MW_C_short},
  {course: 221, section: 3, start:  MW_C, end: MW_C_short},
  {course: 313, section: 3, start:  MW_C, end: MW_C_short},
  {course: 313, section: 3, start:  MW_C, end: MW_C_short},
  {course: 313, section: 3, start:  MW_C, end: MW_C_short},
  
  {course: 121, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 121, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 121, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 121, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 4, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 4, start:  MW_A2, end: MW_A2_short},
  
  {course: 121, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 121, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 121, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 121, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 5, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 5, start:  MW_B2, end: MW_B2_short},

  {course: 121, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 121, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 121, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 315, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 315, section: 6, start:  MW_C2, end: MW_C2_short},
  {course: 315, section: 6, start:  MW_C2, end: MW_C2_short},

  {course: 121, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 121, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 315, section: 7, start:  MW_A3, end: MW_A3_short},
  {course: 315, section: 7, start:  MW_A3, end: MW_A3_short},

  {course: 121, section: 8, start:  MW_B3, end: MW_B3_short},
  {course: 221, section: 8, start:  MW_B3, end: MW_B3_short},
  {course: 313, section: 8, start:  MW_B3, end: MW_B3_short},

  {course: 121, section: 8, start:  MW_C3, end: MW_C3_short},
  {course: 121, section: 8, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 8, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 8, start:  MW_C3, end: MW_C3_short},
  {course: 313, section: 8, start:  MW_C3, end: MW_C3_short},
  {course: 315, section: 8, start:  MW_C3, end: MW_C3_short},
];

const F_schedule = [
  {course: 121, section: 1, start:  MW_A, end: MW_A_extralong},
  {course: 121, section: 2, start:  MW_A, end: MW_A_short},
  {course: 121, section: 3, start:  MW_A, end: MW_A_short},
  {course: 221, section: 4, start:  MW_A, end: MW_A_short},
  {course: 221, section: 5, start:  MW_A, end: MW_A_short},
  {course: 313, section: 6, start:  MW_A, end: MW_A_short},
  {course: 221, section: 7, start:  MW_B, end: MW_B_short},
  {course: 313, section: 8, start:  MW_B, end: MW_B_short},
  {course: 121, section: 9, start:  MW_C, end: MW_C_short},
  {course: 221, section: 10, start: MW_C, end: MW_C_short},
  {course: 313, section: 11, start: MW_C, end: MW_C_short},
  
  {course: 121, section: 12, start: MW_A2, end: MW_A2_extralong}, // Section is incorrect
  {course: 121, section: 13, start: MW_A2, end: MW_A2_short},
  {course: 221, section: 14, start: MW_A2, end: MW_A2_extralong},
  {course: 313, section: 15, start: MW_A2, end: MW_A2_short},
  {course: 313, section: 16, start: MW_B2, end: MW_B2_short},
  {course: 221, section: 17, start: MW_C2, end: MW_C2_short},
  {course: 315, section: 18, start: MW_A2, end: MW_A2_extralong},
  {course: 315, section: 19, start: MW_A2, end: MW_A2_short},
  {course: 315, section: 20, start: MW_C2, end: MW_C2_short},
  
  {course: 121, section: 21, start: MW_A3, end: MW_A3_short},
  {course: 121, section: 22, start: MW_A3, end: MW_A3_short},
  {course: 121, section: 23, start: MW_B3, end: MW_B3_short},
  {course: 221, section: 24, start: MW_A3, end: MW_A3_extralong}, // Arrested
  {course: 221, section: 25, start: MW_C3, end: MW_C3_short},
  {course: 313, section: 26, start: MW_A3, end: MW_A3_extralong},
  {course: 315, section: 27, start: MW_A3, end: MW_A3_extralong},
]

export const SchedulingRender = () => {
  let grid = [];
  for (let i = 0; i < 5*11; i++) {
    grid.push(<div></div>)
  }

  return (
    <div className="render-container">
      <div className="render-content">
        < SchedulingColumn blocks={M_schedule}/>
        < SchedulingColumn blocks={TH_shcedule}/>
        < SchedulingColumn blocks={W_schedule}/>
        < SchedulingColumn blocks={TH_shcedule}/>
        < SchedulingColumn blocks={F_schedule} end={true} />
      </div>
    </div>
  )
}
