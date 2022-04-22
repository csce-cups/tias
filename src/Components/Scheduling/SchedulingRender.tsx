import React, { FC, useContext, useEffect, useState } from 'react';
import { CourseBlock, CourseBlockWeek } from '../../modules/API';
import contexts from '../APIContext';
import RenderBlockProps from './BlockBase';
import { SchedulingColumn } from './SchedulingColumn';
import { SchedulingTimes } from './SchedulingTimes';
import { OptionsProps } from './SchedulingWindow';

interface Props {
  renderBlockType: React.FC<RenderBlockProps>
  filter: Map<number, boolean>
  options?: OptionsProps
}

export const SchedulingRender: FC<Props> = ({renderBlockType, filter, options}) => {
  const {editing} = options || {
    editing: {
      bool: [false, () => {}],
      count: [0, () => {}],
    }
  };
  const [blocks,] = useContext(contexts.blocks);
  const [hours, setHours] = useState<number>(0);
  const [start, setStart] = useState<Date>(new Date(0));

  useEffect(() => {
    if (blocks) {
      const keys: (keyof CourseBlockWeek)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      let allBlocksFlat: CourseBlock[] = [];
      keys.forEach(k => {
        if (blocks[k] !== null) {
          allBlocksFlat.push(...(blocks[k]!));
        }
      });
      if (allBlocksFlat.length === 0) return;
      if (allBlocksFlat[0].course_number === -1) {
        setHours(0);
        setStart(new Date(0));
        return;
      }

      let startDate = new Date(allBlocksFlat.map(b => b.start_time).reduce((acc, curr) => (curr < acc ? curr : acc)));
      startDate.setMinutes(0);
      const start = startDate.getTime();
      const end = allBlocksFlat.reduce((max, block) => Math.max(max, block.end_time.getTime()), 0);
      
      setHours(Math.ceil((end - start) / 1000 / 60 / 60));
      
      setStart(startDate);
    }
  }, [blocks]);

  return (
    <div className="render-container" style={{marginTop: (options?.noHeader)? '8px' : undefined}}>
      < SchedulingTimes hours={hours} start={start} editing={editing}/>
      <div className={`render-content ${editing?.bool[0]? 'interact-blocks editing' : ''}`}>
        < SchedulingColumn renderBlockType={renderBlockType} hours={hours} startTime={start} filter={filter} options={options} day={'Monday'} blocks={blocks? blocks.Monday : [{course_number: -1} as CourseBlock]} />
        < SchedulingColumn renderBlockType={renderBlockType} hours={hours} startTime={start} filter={filter} options={options} day={'Tuesday'} blocks={blocks? blocks.Tuesday : [{course_number: -1} as CourseBlock]} />
        < SchedulingColumn renderBlockType={renderBlockType} hours={hours} startTime={start} filter={filter} options={options} day={'Wednesday'} blocks={blocks? blocks.Wednesday : [{course_number: -1} as CourseBlock]} />
        < SchedulingColumn renderBlockType={renderBlockType} hours={hours} startTime={start} filter={filter} options={options} day={'Thursday'} blocks={blocks? blocks.Thursday : [{course_number: -1} as CourseBlock]} />
        < SchedulingColumn renderBlockType={renderBlockType} hours={hours} startTime={start} filter={filter} options={options} day={'Friday'} blocks={blocks? blocks.Friday : [{course_number: -1} as CourseBlock]} />
      </div>
    </div>
  )
}
