import React, {FC} from 'react'
import { SchedulingColumn } from './SchedulingColumn';
import { SchedulingTimes } from './SchedulingTimes';
import BlockFormer from './BlockFormer';

const hours = 11;
// const start = new Date(12*24*60*60*1000);
let start = new Date(0);
start.setHours(8);

interface Props {
  filter: any //int -> bool
}

export const SchedulingRender: FC<Props> = ({filter}) => {
  console.log(start);
  return (
    <div className="render-container">
      < SchedulingTimes hours={hours} start={start}/>
      <div className="render-content">
        < SchedulingColumn day={'Monday'} blocks={BlockFormer.samples.M_schedule} filter={filter} />
        < SchedulingColumn day={'Tuesday'} blocks={BlockFormer.samples.TH_shcedule} filter={filter} />
        < SchedulingColumn day={'Wednesday'} blocks={BlockFormer.samples.W_schedule} filter={filter} />
        < SchedulingColumn day={'Thursday'} blocks={BlockFormer.samples.TH_shcedule} filter={filter} />
        < SchedulingColumn day={'Friday'} blocks={BlockFormer.samples.F_schedule} filter={filter} end={true} />
      </div>
    </div>
  )
}
