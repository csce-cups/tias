import React, {FC} from 'react'
import { SchedulingColumn } from './SchedulingColumn';

import BlockFormer from './BlockFormer';

export const SchedulingRender = () => {
  return (
    <div className="render-container">
      <div className="render-content">
        < SchedulingColumn blocks={BlockFormer.samples.M_schedule} />
        < SchedulingColumn blocks={BlockFormer.samples.TH_shcedule} />
        < SchedulingColumn blocks={BlockFormer.samples.W_schedule} />
        < SchedulingColumn blocks={BlockFormer.samples.TH_shcedule} />
        < SchedulingColumn blocks={BlockFormer.samples.F_schedule} end={true} />
      </div>
    </div>
  )
}
