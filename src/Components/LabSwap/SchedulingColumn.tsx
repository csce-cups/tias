import React, { FC, useEffect, useState } from 'react';
import { SchedulingBlock } from './SchedulingBlock';
import { CourseBlock } from './CourseBlock';
import uuid from '../../uuid';
import { APICourseBlock } from '../../modules/API'
import back_arrow from '../../assets/back_arrow_icon.svg'

let numHours = 13;
let startTime = new Date(0);
startTime.setHours(8);

interface CourseInstance{
  department: string
  course_number: number
  section_numbers: Array<number>
  start_time: Date
  end_time: Date
  weekday: string
  place: string
}
interface RenderCourseBlock extends CourseInstance {
  collisions_left: number[]
  collisions_right: number[]
}
interface Props {
  blocks?: any, // The blocks to be displayed for this day of the week
  filter: Object,
  day: string, // The day of the week
  hours?: number, // The number of hours in a day
}

// Breaks for 3 different lengths in a block
const d_len = (e: CourseInstance) => { return e.end_time.getTime() - e.start_time.getTime(); }

const time_to_height = (start: Date, end: Date, max: number = numHours*60*60*1000) => {
  return (end.getTime() - start.getTime()) / max * 100;
}

const start_time_to_top = (start: Date, pstart: Date = startTime, parent: number = numHours*60*60*1000) => {
  return (start.getTime() - pstart.getTime()) / parent * 100;
}

const generateBlocks = (data: CourseInstance[] | null, filter: any) => {
  // If no data, do nothing
  if (data === null) {
    return (
      <div className="vstack absolute">
        <div className="day-loading">Loading...</div>
      </div>
    )
  }

  if (data.length === 0) return <></>;
  
  // Data should be sorted by start time, class length, course number, and then by section number
  data.sort((a, b) => {
    // Sort by start time
    if (a.start_time.getTime() < b.start_time.getTime()) return -1;
    else if (a.start_time.getTime() > b.start_time.getTime()) return 1;
    
    // Sort by class length
    else if (d_len(a) > d_len(b)) return -1;
    else if (d_len(a) < d_len(b)) return 1;

    // Sort by course number
    else if (a.course_number < b.course_number) return -1;
    else if (a.course_number > b.course_number) return 1;

    // Sort by section number (N/A to courses)
    // else if (a.section_number < b.section_number) return -1;
    // else if (a.section_number > b.section_number) return 1;
    
    // They're equal
    else return 0;
  });
  
  return placeBlocks(data, filter);
}

const placeBlocks = (data: CourseInstance[], filter: any) => {
  let line: CourseInstance[] = [];
  let layered: CourseInstance[][] = [];
  
  let returns: JSX.Element[] = [];
  let region_start = data[0].start_time;
  let region_end = data[0].end_time;
  let inline = true;
  const startsDuring = (block: CourseInstance) => block.start_time > region_start && block.start_time < region_end;
  const endsDuring = (block: CourseInstance) => block.end_time < region_end && block.end_time > region_start;
  const isDuring = (block: CourseInstance) => block.start_time < region_start && block.end_time > region_end;
  
  data.forEach((block: CourseInstance) => {
    if (inline && block.start_time.getTime() === region_start.getTime() && block.end_time.getTime() === region_end.getTime()) { // Same line as previous
    } else if (startsDuring(block) || endsDuring(block) || isDuring(block)) { // Staggered
      inline = false;
    } else { // Not, staggered but different line
      if (!inline) { // Commit the staggered bits and flush the buffer
        returns.push(...placeStaggeredBlocks(line, filter));
        line = [];
        inline = true;
      } else {
        layered.push(line);
        line = [];
      }
      
      region_start = block.start_time;
      region_end = block.end_time;
    }
    line.push(block);
  });

  if (!inline) returns.push(...placeStaggeredBlocks(line, filter));
  else if (line.length > 0) layered.push(line);

  if (layered.length > 0) returns.push(...placeInlineBlocks(layered, filter));

  return returns;
}

const r = () => Math.floor(Math.random() * 40);
const randIDs = () => [r(), r(), r(), r()].filter((e, i, s) => s.indexOf(e) === i);

// Requires input to be pre-layered
const placeInlineBlocks = (layered_data: CourseInstance[][], filter: any): JSX.Element[] => {
  return (
    layered_data.map((layer: CourseInstance[]) => (
      <div className="block-container hstack fill" key={`blocks-set-${JSON.stringify(layer)}`} style={{ 
        padding: 0, 
        height: `${time_to_height(layer[0].start_time, layer[0].end_time)}%`,
        top: `${start_time_to_top(layer[0].start_time)}%`
      }}>
        { layer.map((block: CourseInstance) => (
          < CourseBlock course_instance={block} visible={filter[block.course_number]} linkIDs={randIDs()} inline={true} key={`deep-unravel-block-${JSON.stringify(block)}`}/>
        ))}
      </div>
    )
  ))
}

const placeStaggeredBlocks = (blocks: CourseInstance[], filter: any) => {
  // Combines the findCollision functions to produce a range of blocks that fall between region_start and region_end
  const registerCollisions = (block: CourseInstance, idx: number): RenderCourseBlock => ({...block, ...findCollisions(block.start_time, block.end_time, idx)});
  const findCollisions = (region_start: Date, region_end: Date, loc: number, arr_start: number = 0, arr_end: number = blocks.length-1) => {
    let collisions_left: number[] = [];
    let collisions_right: number[] = [];
    const startsDuring = (i: number) => blocks[i].start_time >= region_start && blocks[i].start_time < region_end;
    const endsDuring = (i: number) => blocks[i].end_time <= region_end && blocks[i].end_time > region_start;
    const isDuring = (i: number) => blocks[i].start_time < region_start && blocks[i].end_time > region_end;
    for (let i = arr_start; i <= arr_end; i++) {
      if (endsDuring(i) || startsDuring(i) || isDuring(i)) {
        if (i < loc) collisions_left.push(i);       // Found block is on the left of the target
        else if (i > loc) collisions_right.push(i); // Found block is on the right of the target
      }
    }
    return {collisions_left, collisions_right};
  }

  const renderSpacers = (target: RenderCourseBlock, collisions: number[], key: string) => {
    const doesCollide = (line: Date, block: CourseInstance) => block.start_time <= line && block.end_time > line;
    const findLineCollisions = (line: Date) => {
      let found: number[] = [];
      let spacerCount = 0;
      collisions.forEach((e: number) => {
        if (doesCollide(line, blocks[e])) {
          if (filter[blocks[e].course_number]) spacerCount++;
          found.push(e);
        }
      })
      return { arr: found, count: spacerCount};
    }

    let maxes = [findLineCollisions(target.start_time)]; // Parallel arrays of collisions
    let renderCount = 0;
    collisions.forEach((e: number) => {
      const possible_max = findLineCollisions(blocks[e].start_time);
      if (possible_max.arr.length > renderCount) renderCount = possible_max.arr.length
      if (possible_max.count > maxes[0].count) maxes = [possible_max];
      else if (possible_max.count === maxes[0].count || possible_max.arr.length > maxes[0].count) maxes.push(possible_max);
    })

    let maxLen = maxes[0].arr.length;
    let maxi = 0;
    maxes.forEach((e, ei) => {
      if (e.arr.length > maxLen) {
        maxLen = e.arr.length;
        maxi = ei;
      }
    })

    for (let i = 0; i < renderCount - maxes[maxi].count; i++) maxes[maxi].arr.push(-1); // Pad the array so enough spacers are rendered

    return ({
      collisionRatio: maxes[maxi].count,
      render: maxes[maxi].arr.map((_, idx: number) => (
        < SchedulingBlock spacer={true} visible={maxes.some(e => {
          if (idx >= e.arr.length || maxes[maxi].count === 0 || !filter[blocks[e.arr[idx]].course_number]) return false;
          else {
            maxes[maxi].count--;
            renderCount--;
            return true;
          }
        })} linkIDs={[]} key={`${key}-${idx}`}/>
      ))
    })
  }

  let ratios = new Map();
  let collisionReferences = new Map();
  return (
    blocks.map((block: CourseInstance, bidx: number) => {
      const preparedBlock = registerCollisions(block, bidx);
      const rightSpacers = renderSpacers(preparedBlock, preparedBlock.collisions_right, 'right-spacer');
      const calcRatio = (collision: number) => {
        let denominator = (ratios.get(collision) + collisionReferences.get(collision).reduce((p: number, e: number) => (filter[blocks[e].course_number])? p+1: p, 0));
        return 1/denominator*100;
      }
      const calcSelf = () => {
        let left_size = 0;
        let first_ls = -1;
        let fail = false;
        preparedBlock.collisions_left.forEach((collision: number, idx: number) => {
          const addend = (ratios.has(collision) && filter[blocks[collision].course_number])? calcRatio(collision) : 0;
          if (first_ls === -1) first_ls = addend;
          else if (first_ls !== addend) fail = true;

          left_size += addend;
        });

        if (fail) return 'auto';
        return `calc(${1/ratios.get(bidx)*100}% - 4px - ${left_size/ratios.get(bidx)}%)`
      }

      ratios.set(bidx, rightSpacers.collisionRatio + 1);
      collisionReferences.set(bidx, []);
      return (
        <div className="block-container hstack fill" key={`blocks-set-${JSON.stringify(block)}`} style={{ 
          padding: 0, 
          height: `${time_to_height(block.start_time, block.end_time)}%`,
          top: `${start_time_to_top(block.start_time)}%`
        }}>
          { preparedBlock.collisions_left.map((collision: number, idx: number) => {
            collisionReferences.get(bidx).push(collision);
            if (blocks[bidx].start_time.getTime() === blocks[collision].start_time.getTime() && blocks[bidx].end_time.getTime() === blocks[collision].end_time.getTime()) {
              return < SchedulingBlock spacer={true} size={'auto'} visible={filter[blocks[collision].course_number]} linkIDs={[]} key={`left-spacer-${idx}`}/>
            }
            return < SchedulingBlock spacer={true} size={(ratios.has(collision))? `calc(${calcRatio(collision)}% - 4px)` : undefined} visible={filter[blocks[collision].course_number]} linkIDs={[]} key={`left-spacer-${idx}`}/>
          })}
          < CourseBlock size={calcSelf()} course_instance={block} visible={filter[block.course_number]} /*linkIDs={randIDs()}*/ key={`block-${JSON.stringify(block)}`}/>
          { rightSpacers.render }
        </div>
      )
    })
  )
}

export const SchedulingColumn: FC<Props> = ({blocks, filter, day, hours}) => {
  const [detailed, setDetailed] = useState(false);
  const id = uuid();
  if (hours !== undefined) numHours = hours;

  let dividers = [];
  for (let i = 0; i < numHours; i++) {
    // Needs a key
    dividers[i] = <div className="divider" key={`divider-${i}`}/>;
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
  }

  const modifyColumns = (id: string, newClass: string, inverted: boolean = false, remove: boolean = false) => {
    const selector = `div.column${(inverted? ':not(' : '')}[id="${id}"]${(inverted? ')' : '')}`;
    let linked = Array.from(document.querySelectorAll(selector));
    if (remove) linked.forEach(e => e.classList.remove(newClass));
    else linked.forEach(e => e.classList.add(newClass));
  }

  return (
    <div className="vstack grow-h day column" id={id} onClick={select}>
      { (detailed) ? 
        <div className="day-label hstack exit" style={{padding: 0}}>
          <div className="exit left element detailed hstack" onClick={deselect}>
            <div className="vstack" style={{justifyContent: 'center'}}>
              <img className="back-arrow" src={back_arrow} alt=""/>
            </div>
            <div className="exit-text">BACK</div>
          </div>
          <div className="center element detailed" style={{padding: '3px'}} onClick={deselect}>
            {day}
          </div>
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
        { generateBlocks(blocks, filter) }
      </div>
    </div>
  )
}