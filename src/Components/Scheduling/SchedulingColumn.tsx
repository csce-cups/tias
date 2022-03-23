import React, { FC, useState } from 'react';
import { SchedulingBlock } from './SchedulingBlock';
import uuid from '../../uuid';
import { APICourseBlock } from '../../modules/API'

let numHours = 11;

interface Props {
  blocks: any, // The blocks to be displayed for this day of the week
  filter: Object,
  day: string, // The day of the week
  hours?: number, // The number of hours in a day
}

// Breaks for 3 different lengths in a block
const d_len = (e: APICourseBlock) => { return e.end_time.getTime() - e.start_time.getTime(); }

const time_to_height = (start: Date, end: Date, max: number = numHours*60*60*1000) => {
  return (end.getTime() - start.getTime()) / max * 100;
}

const start_time_to_top = (start: Date, pstart: Date = new Date(0), parent: number = numHours*60*60*1000) => {
  return (start.getTime() - pstart.getTime()) / parent * 100;
}

const generateBlocks = (data: APICourseBlock[], filter: any) => {
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

    // Sort by section number
    else if (a.section_number < b.section_number) return -1;
    else if (a.section_number > b.section_number) return 1;
    
    // They're equal
    else return 0;
  });

  let base: any = [];
  let i = 0;
  while (i < data.length) {

    let outer: any = [];
    let max = data[i];
    while (i < data.length && data[i].start_time.getTime() >= max.start_time.getTime() && data[i].end_time.getTime() <= max.end_time.getTime()) {

      let inner: any = [];
      while (i < data.length && d_len(data[i]) < d_len(max) 
        && data[i].start_time.getTime() >= max.start_time.getTime() && data[i].end_time.getTime() <= max.end_time.getTime()) {

        let temp_arr: any = [];
        let temp = data[i];
        while (i < data.length && data[i].start_time.getTime() === temp.start_time.getTime() && data[i].end_time.getTime() === temp.end_time.getTime()
          && data[i].start_time.getTime() >= max.start_time.getTime() && data[i].end_time.getTime() <= max.end_time.getTime()) {

          temp_arr.push(data[i]);
          i++;
        }
        
        if (temp_arr.length > 0) inner.push(temp_arr);

      }
      
      if (inner.length > 0) outer.push(inner);
      else { outer.push(data[i]); i++;}

    }
    
    base.push(outer);

  }
  
  return placeBlocks(base, filter);

}


const placeBlocks = (blocks: APICourseBlock[], filter: any) => {
  const r = () => Math.floor(Math.random() * 40);
  const randIDs = () => [r(), r(), r(), r()].filter((e, i, s) => s.indexOf(e) === i);

  const unravel = (outer: APICourseBlock | APICourseBlock[][], parent: APICourseBlock, spacerSz: string) => {
    if (Array.isArray(outer)) { // Creates a subview for the smaller elements
      return (
        // Needs a key
        <div className="vstack absolute" key={`deep-unravel-outer-${JSON.stringify(outer)}`}>
          { outer.map((row: APICourseBlock[]) => (
            // Needs a key
            <div className="hstack block-container" key={`deep-unravel-row-${JSON.stringify(row)}`} style={{
              height: `${time_to_height(row[0].start_time, row[0].end_time, d_len(parent))}%`,
              top: `${start_time_to_top(row[0].start_time, parent.start_time, d_len(parent))}%`
            }}>
              <div className="block spacer" style={{flex: `0 0 ${spacerSz}`}}/>
              { row.map(c => (
                // Needs a key
                < SchedulingBlock course_instance={c} visible={filter[c.course_number]} linkIDs={randIDs()} key={`deep-unravel-block-${JSON.stringify(c)}`}/>
              )) }
            </div>
          ))}
        </div>
      )
    } else {
      return (
        // Needs a key
        < SchedulingBlock course_instance={outer} visible={filter[outer.course_number]} linkIDs={randIDs()} key={`shallow-unravel-${JSON.stringify(outer)}`}/>
      )
    }
  }

  // Find the largest block for each set of blocks
  let maxes: any = [];
  blocks.forEach((set: any) => {
    maxes.push(set.reduce((p: any, e: any) => {
      if (Array.isArray(e)) { return p; }
      else if (Array.isArray(p)) { return e; }
      else return d_len(p) > d_len(e) ? p : e;
    }))
  })
  
  let spacers: any = [];
  let spacerLens: any = [];
  blocks.forEach((set: any) => {

    // Calculate how many spacers to add to the end of the top level block list
    let count = 0;
    set.forEach((subset: any) => {
      let maxCount = 0;
      if (Array.isArray(subset)) {
        subset.forEach((block: any) => {
          if (Array.isArray(block)) {
            maxCount = Math.max(maxCount, block.length);
          } else {
            maxCount = Math.max(maxCount, 1);
          }
        })
      }
      count = Math.max(maxCount, count);
    });
    
    // Add the spacers to the block list
    spacers.push([]);
    for (let j = 0; j < count; j++) {
      spacers[spacers.length - 1].push(<div className="block spacer" key={`spacer-${j}`}/>)
    }

    // Pre-calculate how large the spacer should be in subviews
    spacerLens.push(100 * (set.length - 1) / (spacers[spacers.length - 1].length + (set.length - 1)));
  })

  return (
    <>
      { blocks.map((set: any, idx: number) => (
        // Needs a key
        <div className="block-container hstack fill" key={`blocks-set-${JSON.stringify(set)}`} style={{ 
          padding: 0, 
          height: `${time_to_height(set[0].start_time, set[0].end_time)}%`,
          top: `${start_time_to_top(set[0].start_time)}%`
        }}>
          { set.map((outer: any) => (
            unravel(outer, maxes[idx], `${spacerLens[idx]}%`)
          ))}
          { spacers[idx] }
        </div>
      ))}
    </>
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
        <div className="day-label hstack" style={{padding: 0}}>
          <div className="left element detailed" style={{padding: '5px'}}>
            Viewing: {day}
          </div>
          <div className="center element detailed" style={{padding: '3px'}} onClick={deselect}>
            Exit
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