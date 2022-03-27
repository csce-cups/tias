import React, {FC} from 'react'
import { SchedulingColumn } from './SchedulingColumn';
import { SchedulingTimes } from './SchedulingTimes';
import BlockFormer from '../../modules/BlockFormer';
import { contexts } from '../APIContext';
import { APICourseBlockWeek } from '../../modules/API';

const hours = 12;
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
        < contexts.blocks.Consumer >
          {([blocks, setBlocks]) => (
            <>
              < SchedulingColumn hours={hours} filter={filter} day={'Monday'} blocks={blocks.Monday} />
              < SchedulingColumn hours={hours} filter={filter} day={'Tuesday'} blocks={blocks.Tuesday} />
              < SchedulingColumn hours={hours} filter={filter} day={'Wednesday'} blocks={blocks.Wednesday} />
              < SchedulingColumn hours={hours} filter={filter} day={'Thursday'} blocks={blocks.Thursday} />
              < SchedulingColumn hours={hours} filter={filter} day={'Friday'} blocks={blocks.Friday} />
            </>
          )}
        </contexts.blocks.Consumer>
      </div>
    </div>
  )
}
