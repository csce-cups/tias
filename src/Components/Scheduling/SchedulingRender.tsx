import React, {FC} from 'react'
import { SchedulingColumn } from './SchedulingColumn';

import BlockFormer from './BlockFormer';

interface Props {
  filter: any //int -> bool
}

export const SchedulingRender: FC<Props> = ({filter}) => {
  return (
    <div className="render-container">
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
