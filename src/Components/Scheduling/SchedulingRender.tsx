import React, {FC} from 'react'
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
  {course: 121, section: 101, start:  MW_A, end: MW_A_short},
  {course: 121, section: 101, start:  MW_A, end: MW_A_short},
  {course: 121, section: 101, start:  MW_A, end: MW_A_short},
  {course: 221, section: 101, start:  MW_A, end: MW_A_short},
  {course: 221, section: 101, start:  MW_A, end: MW_A_short},
  {course: 313, section: 101, start:  MW_A, end: MW_A_short},

  {course: 121, section: 102, start:  MW_B, end: MW_B_short},
  {course: 121, section: 102, start:  MW_B, end: MW_B_short},
  {course: 121, section: 102, start:  MW_B, end: MW_B_short},
  {course: 221, section: 102, start:  MW_B, end: MW_B_short},
  {course: 221, section: 102, start:  MW_B, end: MW_B_short},
  {course: 313, section: 102, start:  MW_B, end: MW_B_short},

  {course: 121, section: 103, start:  MW_C, end: MW_C_short},
  {course: 121, section: 103, start:  MW_C, end: MW_C_short},
  {course: 121, section: 103, start:  MW_C, end: MW_C_short},
  {course: 221, section: 103, start:  MW_C, end: MW_C_short},
  {course: 221, section: 103, start:  MW_C, end: MW_C_short},
  {course: 313, section: 103, start:  MW_C, end: MW_C_short},


  {course: 121, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 104, start:  MW_A2, end: MW_A2_short},

  {course: 121, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 315, section: 105, start:  MW_B2, end: MW_B2_short},

  {course: 121, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 106, start:  MW_C2, end: MW_C2_short},
  

  {course: 121, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 121, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 121, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 107, start:  MW_A3, end: MW_A3_short},

  {course: 121, section: 108, start:  MW_B3, end: MW_B3_short},
  {course: 121, section: 108, start:  MW_B3, end: MW_B3_short},
  {course: 121, section: 108, start:  MW_B3, end: MW_B3_short},
  {course: 221, section: 108, start:  MW_B3, end: MW_B3_short},
  {course: 221, section: 108, start:  MW_B3, end: MW_B3_short},
  {course: 313, section: 108, start:  MW_B3, end: MW_B3_short},

  {course: 121, section: 109, start:  MW_C3, end: MW_C3_short},
  {course: 121, section: 109, start:  MW_C3, end: MW_C3_short},
  {course: 121, section: 109, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 109, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 109, start:  MW_C3, end: MW_C3_short},
  {course: 313, section: 109, start:  MW_C3, end: MW_C3_short},
  {course: 313, section: 109, start:  MW_C3, end: MW_C3_short},
];

const TH_shcedule: any = [
  {course: 121, section: 101, start:  TH_A, end: TH_A_short},
  {course: 121, section: 101, start:  TH_A, end: TH_A_short},
  {course: 121, section: 101, start:  TH_A, end: TH_A_short},
  {course: 221, section: 101, start:  TH_A, end: TH_A_short},
  {course: 221, section: 101, start:  TH_A, end: TH_A_short},
  {course: 313, section: 101, start:  TH_A, end: TH_A_short},
  
  {course: 121, section: 102, start:  TH_B, end: TH_B_short},
  {course: 121, section: 102, start:  TH_B, end: TH_B_short},
  {course: 121, section: 102, start:  TH_B, end: TH_B_short},
  {course: 221, section: 102, start:  TH_B, end: TH_B_short},
  {course: 221, section: 102, start:  TH_B, end: TH_B_short},
  {course: 313, section: 102, start:  TH_B, end: TH_B_short},

  {course: 121, section: 103, start:  TH_C, end: TH_C_short},
  {course: 121, section: 103, start:  TH_C, end: TH_C_short},
  {course: 121, section: 103, start:  TH_C, end: TH_C_short},
  {course: 221, section: 103, start:  TH_C, end: TH_C_short},
  {course: 221, section: 103, start:  TH_C, end: TH_C_short},
  {course: 313, section: 103, start:  TH_C, end: TH_C_short},
  {course: 313, section: 103, start:  TH_C, end: TH_C_short},
  {course: 313, section: 103, start:  TH_C, end: TH_C_short},

  {course: 121, section: 104, start:  TH_B2, end: TH_B2_short},
  {course: 221, section: 104, start:  TH_B2, end: TH_B2_short},
  {course: 313, section: 104, start:  TH_B2, end: TH_B2_short},

  {course: 121, section: 105, start:  TH_C2, end: TH_C2_short},
  {course: 221, section: 105, start:  TH_C2, end: TH_C2_short},

  {course: 121, section: 106, start:  TH_A3, end: TH_A3_short},
];

const W_schedule: any = [
  // MONDAYS //
  {course: 121, section: 101, start:  MW_A, end: MW_A_short},
  {course: 121, section: 101, start:  MW_A, end: MW_A_short},
  {course: 121, section: 101, start:  MW_A, end: MW_A_short},
  {course: 221, section: 101, start:  MW_A, end: MW_A_short},
  {course: 221, section: 101, start:  MW_A, end: MW_A_short},
  {course: 313, section: 101, start:  MW_A, end: MW_A_short},
  {course: 313, section: 101, start:  MW_A, end: MW_A_short},
  {course: 313, section: 101, start:  MW_A, end: MW_A_short},

  {course: 121, section: 102, start:  MW_B, end: MW_B_short},
  {course: 121, section: 102, start:  MW_B, end: MW_B_short},
  {course: 121, section: 102, start:  MW_B, end: MW_B_short},
  {course: 221, section: 102, start:  MW_B, end: MW_B_short},
  {course: 221, section: 102, start:  MW_B, end: MW_B_short},
  {course: 313, section: 102, start:  MW_B, end: MW_B_short},
  {course: 313, section: 102, start:  MW_B, end: MW_B_short},
  {course: 313, section: 102, start:  MW_B, end: MW_B_short},

  {course: 121, section: 103, start:  MW_C, end: MW_C_short},
  {course: 121, section: 103, start:  MW_C, end: MW_C_short},
  {course: 121, section: 103, start:  MW_C, end: MW_C_short},
  {course: 121, section: 103, start:  MW_C, end: MW_C_short},
  {course: 221, section: 103, start:  MW_C, end: MW_C_short},
  {course: 221, section: 103, start:  MW_C, end: MW_C_short},
  {course: 221, section: 103, start:  MW_C, end: MW_C_short},
  {course: 221, section: 103, start:  MW_C, end: MW_C_short},
  {course: 313, section: 103, start:  MW_C, end: MW_C_short},
  {course: 313, section: 103, start:  MW_C, end: MW_C_short},
  {course: 313, section: 103, start:  MW_C, end: MW_C_short},
  
  {course: 121, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 121, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 121, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 121, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 221, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 104, start:  MW_A2, end: MW_A2_short},
  {course: 313, section: 104, start:  MW_A2, end: MW_A2_short},
  
  {course: 121, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 121, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 121, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 121, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 221, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 105, start:  MW_B2, end: MW_B2_short},
  {course: 313, section: 105, start:  MW_B2, end: MW_B2_short},

  {course: 121, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 121, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 121, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 221, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 313, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 315, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 315, section: 106, start:  MW_C2, end: MW_C2_short},
  {course: 315, section: 106, start:  MW_C2, end: MW_C2_short},

  {course: 121, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 121, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 221, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 313, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 315, section: 107, start:  MW_A3, end: MW_A3_short},
  {course: 315, section: 107, start:  MW_A3, end: MW_A3_short},

  {course: 121, section: 108, start:  MW_B3, end: MW_B3_short},
  {course: 221, section: 108, start:  MW_B3, end: MW_B3_short},
  {course: 313, section: 108, start:  MW_B3, end: MW_B3_short},

  {course: 121, section: 108, start:  MW_C3, end: MW_C3_short},
  {course: 121, section: 108, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 108, start:  MW_C3, end: MW_C3_short},
  {course: 221, section: 108, start:  MW_C3, end: MW_C3_short},
  {course: 313, section: 108, start:  MW_C3, end: MW_C3_short},
  {course: 315, section: 108, start:  MW_C3, end: MW_C3_short},
];

const F_schedule: any = [
  {course: 121, section: 101, start:  MW_A, end: MW_A_extralong},
  {course: 121, section: 102, start:  MW_A, end: MW_A_short},
  {course: 121, section: 103, start:  MW_A, end: MW_A_short},
  {course: 221, section: 104, start:  MW_A, end: MW_A_short},
  {course: 221, section: 105, start:  MW_A, end: MW_A_short},
  {course: 313, section: 106, start:  MW_A, end: MW_A_short},
  {course: 221, section: 107, start:  MW_B, end: MW_B_short},
  {course: 313, section: 108, start:  MW_B, end: MW_B_short},
  {course: 121, section: 109, start:  MW_C, end: MW_C_short},
  {course: 221, section: 110, start: MW_C, end: MW_C_short},
  {course: 313, section: 111, start: MW_C, end: MW_C_short},
  
  {course: 121, section: 112, start: MW_A2, end: MW_A2_extralong}, // Section is incorrect
  {course: 121, section: 113, start: MW_A2, end: MW_A2_short},
  {course: 221, section: 114, start: MW_A2, end: MW_A2_extralong},
  {course: 313, section: 115, start: MW_A2, end: MW_A2_short},
  {course: 313, section: 116, start: MW_B2, end: MW_B2_short},
  {course: 221, section: 117, start: MW_C2, end: MW_C2_short},
  {course: 315, section: 118, start: MW_A2, end: MW_A2_extralong},
  {course: 315, section: 119, start: MW_A2, end: MW_A2_short},
  {course: 315, section: 120, start: MW_C2, end: MW_C2_short},
  
  {course: 121, section: 121, start: MW_A3, end: MW_A3_short},
  {course: 121, section: 122, start: MW_A3, end: MW_A3_short},
  {course: 121, section: 123, start: MW_B3, end: MW_B3_short},
  {course: 221, section: 124, start: MW_A3, end: MW_A3_extralong}, // Arrested
  {course: 221, section: 125, start: MW_C3, end: MW_C3_short},
  {course: 313, section: 126, start: MW_A3, end: MW_A3_extralong},
  {course: 315, section: 127, start: MW_A3, end: MW_A3_extralong},
]
interface Props {
    filter: Object
}
export const SchedulingRender: FC<Props> = ({filter}) => {
  let grid = [];
  for (let i = 0; i < 5*11; i++) {
    grid.push(<div></div>)
  }

  return (
    <div className="render-container">
      <div className="render-content">
        < SchedulingColumn blocks={M_schedule} filter={filter} /> 
        < SchedulingColumn blocks={TH_shcedule} filter={filter} />
        < SchedulingColumn blocks={W_schedule} filter={filter} />
        < SchedulingColumn blocks={TH_shcedule} filter={filter} />
        < SchedulingColumn blocks={F_schedule} end={true} filter={filter} />
      </div>
    </div>
  )
}
