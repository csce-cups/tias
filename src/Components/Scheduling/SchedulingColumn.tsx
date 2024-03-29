import React, { useState } from 'react';
import back_arrow from '../../assets/back_arrow_icon.svg';
import { CourseBlock } from '../../modules/API';
import uuid from '../../uuid';
import RenderBlockProps from './BlockBase';
import placeBlocks from './renderHelper';
import { OptionsProps } from './SchedulingWindow';

interface Props<DataCourseBlock> {
  renderBlockType: React.FC<RenderBlockProps>
  blocks: DataCourseBlock[] | null // The blocks to be displayed for this day of the week
  filter: Map<number, boolean>
  day: string // The day of the week
  hours?: number // The number of hours in a day
  startTime?: Date
  options?: OptionsProps
}

export const SchedulingColumn = <DataCourseBlock extends CourseBlock>(props: React.PropsWithChildren<Props<DataCourseBlock>>) => {
  let { renderBlockType, blocks, filter, day, hours, startTime, options } = props;
  const {editing} = options || {
    editing: {
      bool: [false, () => {}],
      count: [0, () => {}],
    }
  };
  const [detailed, setDetailed] = useState(false);
  const [hatsHidden, setHatsHidden] = useState(false);

  if (hours === undefined) hours = 12;
  if (startTime === undefined) {
    startTime = new Date(0);
    startTime.setHours(8);
  }

  const selectable = (options?.selectable === false || editing?.bool[0])? false : true;
  const id = uuid();

  let dividers = [];
  for (let i = 0; i < hours; i++) {
    // Needs a key
    dividers[i] = <div className={`divider ${editing?.bool[0]? 'editing' : ''}`} key={`divider-${i}`}/>;
  }

  const select = () => {
    if (!detailed) {
      setDetailed(true);
      modifyColumns(id, 'detailed');
      modifyColumns(id, 'undetailed', true);
    }
  }
  
  const deselect = () => {
    setDetailed(false);
    modifyColumns(id, 'detailed', false, true);
    modifyColumns(id, 'undetailed', true, true);
    modifyHatContainers('shrunk', true);
    setHatsHidden(false);
  }

  const toggleHats = () => {
    modifyHatContainers('shrunk', hatsHidden);
    setHatsHidden(!hatsHidden);
  }

  const modifyColumns = (id: string, newClass: string, inverted: boolean = false, remove: boolean = false) => {
    const selector = `div.column${(inverted? ':not(' : '')}[id="${id}"]${(inverted? ')' : '')}`;
    let linked = Array.from(document.querySelectorAll(selector));
    if (remove) linked.forEach(e => e.classList.remove(newClass));
    else linked.forEach(e => e.classList.add(newClass));
  }

  const modifyHatContainers = (newClass: string, remove: boolean = false) => {
    const selector = `div.hat-container`;
    let linked = Array.from(document.querySelectorAll(selector));
    if (remove) linked.forEach(e => e.classList.remove(newClass));
    else linked.forEach(e => e.classList.add(newClass));
  }

  const edge: "left" | "right" | "center" = (day === "Monday" || day === "Tuesday")? "left" : (day === "Friday")? "right" : "center"; 

  return (
    <div className={`vstack day column ${selectable? 'grow-h' : ''} ${editing?.bool[0]? 'editing' : ''}`} id={id} onClick={selectable? select : () => {}}>
      { (detailed) ? 
        <div className="day-label hstack detailed" style={{padding: 0}}>
          <div className="exit btn element detailed hstack" onClick={deselect}>
            <div className="fill"/>
            <div className="vstack" style={{justifyContent: 'center', width: '0', flex: '0 0 0'}}>
              <img className="back-arrow" src={back_arrow} alt=""/>
            </div>
            <div>BACK</div>
            <div className="fill"/>
          </div>
          <div className="center element detailed" style={{padding: '3px'}}>
            {day}
          </div>
          {
            (blocks !== null && blocks.length > 0 && blocks[0].scheduled !== null) ?
              (hatsHidden)?
                <div className="hide btn element detailed hstack" onClick={toggleHats}>
                  <div className="center">SHOW LABELS</div>
                </div>
                :
                <div className="hide btn element detailed hstack" onClick={toggleHats}>
                  <div className="center">HIDE LABELS</div>
                </div>
              :
              <div className="btn element detailed hstack"/>
          }
        </div>
      : 
        <div className="day-label hstack">
          <div className="center element">
            {day}
          </div>
        </div> 
      }
      <div className="vstack day" >
        { dividers }
        { placeBlocks(blocks, filter, renderBlockType, edge, startTime, new Date(startTime.getTime() + hours*60*60*1000), hours, startTime, options) }
      </div>
    </div>
  )
}