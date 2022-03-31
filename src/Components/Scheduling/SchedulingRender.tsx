import React, { FC } from 'react'
import { SchedulingColumn } from './SchedulingColumn';
import { SchedulingTimes } from './SchedulingTimes';
import contexts from '../APIContext';
import RenderBlockProps from './BlockBase';
import { OptionsProps } from './SchedulingWindow';

const hours = 12;
// const start = new Date(12*24*60*60*1000);
let start = new Date(0);
start.setHours(8);

interface Props {
  renderBlockType: React.FC<RenderBlockProps>
  filter: Map<number, boolean>
  options?: OptionsProps;
}

export const SchedulingRender: FC<Props> = ({renderBlockType, filter, options}) => {
  return (
    <div className="render-container" style={{marginTop: (options?.noHeader)? '8px' : undefined}}>
      < SchedulingTimes hours={hours} start={start}/>
      <div className="render-content">
        < contexts.blocks.Consumer >
          {([blocks, setBlocks]) => (
            <>
              < SchedulingColumn renderBlockType={renderBlockType} hours={hours} filter={filter} options={options} day={'Monday'} blocks={blocks.Monday} />
              < SchedulingColumn renderBlockType={renderBlockType} hours={hours} filter={filter} options={options} day={'Tuesday'} blocks={blocks.Tuesday} />
              < SchedulingColumn renderBlockType={renderBlockType} hours={hours} filter={filter} options={options} day={'Wednesday'} blocks={blocks.Wednesday} />
              < SchedulingColumn renderBlockType={renderBlockType} hours={hours} filter={filter} options={options} day={'Thursday'} blocks={blocks.Thursday} />
              < SchedulingColumn renderBlockType={renderBlockType} hours={hours} filter={filter} options={options} day={'Friday'} blocks={blocks.Friday} />
            </>
          )}
        </contexts.blocks.Consumer>
      </div>
    </div>
  )
}
