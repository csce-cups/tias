import React, {FC} from 'react'
import { Store } from 'state-pool'
import { SchedulingColumn } from './SchedulingColumn';
import { SchedulingTimes } from './SchedulingTimes';
import BlockFormer from '../../modules/BlockFormer';

const hours = 11;
// const start = new Date(12*24*60*60*1000);
let start = new Date(0);
start.setHours(8);

interface Props {
  filter: Object //int -> bool
}

export const SchedulingRender: FC<Props> = ({filter}) => {
  return (
    <div className="render-container">
      < SchedulingTimes hours={hours} start={start}/>
      <div className="render-content">
        < SchedulingColumn hours={hours} day={'Monday'} blocks={BlockFormer.samples.M_schedule} filter={filter} />
        < SchedulingColumn hours={hours} day={'Tuesday'} blocks={BlockFormer.samples.TH_shcedule} filter={filter} />
        < SchedulingColumn hours={hours} day={'Wednesday'} blocks={BlockFormer.samples.W_schedule} filter={filter} />
        < SchedulingColumn hours={hours} day={'Thursday'} blocks={BlockFormer.samples.TH_shcedule} filter={filter} />
        < SchedulingColumn hours={hours} day={'Friday'} blocks={BlockFormer.samples.F_schedule} filter={filter} />
      </div>
    </div>
  )
}
