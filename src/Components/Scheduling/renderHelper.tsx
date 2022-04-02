import React from "react";
import { CourseBlock } from "../../modules/API";
import RenderBlockProps from "./BlockBase";
import { SpacerBlock } from "./SpacerBlock";

interface RenderCourseBlock extends CourseBlock {
  collisions_left: number[]
  collisions_right: number[]
}

let numHours = 13;
let startTime = new Date(0);
startTime.setHours(8);

// Breaks for 3 different lengths in a block
const d_len = (e: CourseBlock) => { return e.end_time.getTime() - e.start_time.getTime(); }

const time_to_height = (start: Date, end: Date, max: number = numHours*60*60*1000) => {
  return (end.getTime() - start.getTime()) / max * 100;
}

const start_time_to_top = (start: Date, pstart: Date = startTime, parent: number = numHours*60*60*1000) => {
  return (start.getTime() - pstart.getTime()) / parent * 100;
}

const placeBlocks = <DataCourseBlock extends CourseBlock>(data: DataCourseBlock[] | null, filter: Map<number, boolean>, renderBlockType: React.FC<RenderBlockProps>) => {
  // If no data, do nothing
  if (data === null) return (
    <div className="vstack absolute">
      <div className="day-loading">Loading...</div>
    </div>
  )
  if (data.length > 0 && data[0].course_number === -1) return (
    <div className="vstack absolute">
      <div className="day-loading">An error occurred.</div>
    </div>
  )

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

    // Sort by section number
    else if (a.section_number < b.section_number) return -1;
    else if (a.section_number > b.section_number) return 1;
    
    // They're equal
    else return 0;
  });

  let line: DataCourseBlock[] = [];
  let layered: DataCourseBlock[][] = [];
  
  let returns: JSX.Element[] = [];
  let region_start = data[0].start_time;
  let region_end = data[0].end_time;
  let inline = true;

  const startsDuring = (block: DataCourseBlock) => block.start_time > region_start && block.start_time < region_end;
  const endsDuring = (block: DataCourseBlock) => block.end_time < region_end && block.end_time > region_start;
  const isDuring = (block: DataCourseBlock) => block.start_time < region_start && block.end_time > region_end;

  // const collides = (block: DataCourseBlock) => !(block.end_time < region_start || block.start_time > region_end)
  
  data.forEach((block: DataCourseBlock) => {
    if (inline && block.start_time.getTime() === region_start.getTime() && block.end_time.getTime() === region_end.getTime()) { // Same line as previous
    } else if (startsDuring(block) || endsDuring(block) || isDuring(block)) { // Staggered
      inline = false;
    } else { // Not, staggered but different line
      if (!inline) { // Commit the staggered bits and flush the buffer
        returns.push(...placeStaggeredBlocks(line, filter, renderBlockType));
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

  if (!inline) returns.push(...placeStaggeredBlocks(line, filter, renderBlockType));
  else if (line.length > 0) layered.push(line);

  if (layered.length > 0) returns.push(...placeInlineBlocks(layered, filter, renderBlockType));

  return returns;
}

// Requires input to be pre-layered
const placeInlineBlocks = (layered_data: CourseBlock[][], filter: Map<number, boolean>, renderBlockType: React.FC<RenderBlockProps>): JSX.Element[] => {
  return (
    layered_data.map((layer: CourseBlock[]) => (
      <div className="block-container hstack fill" key={`blocks-set-${JSON.stringify(layer)}`} style={{ 
        padding: 0, 
        height: `${time_to_height(layer[0].start_time, layer[0].end_time)}%`,
        top: `${start_time_to_top(layer[0].start_time)}%`
      }}>
        { layer.map((block: CourseBlock) => (
          // < SchedulingBlock data={{course_instance: block, linkIDs: block.scheduled}} visible={filter.get(block.course_number)!} inline={true} key={`deep-unravel-block-${JSON.stringify(block)}`}/>
          React.createElement(renderBlockType, {
            data: {course_instance: block, linkIDs: block.scheduled},
            visible: filter.get(block.course_number)!,
            inline: true,
            key: `deep-unravel-block-${JSON.stringify(block)}`,
          })
        ))}
      </div>
    )
  ))
}

const placeStaggeredBlocks = (blocks: CourseBlock[], filter: Map<number, boolean>, renderBlockType: React.FC<RenderBlockProps>) => {
  // Combines the findCollision functions to produce a range of blocks that fall between region_start and region_end
  const registerCollisions = (block: CourseBlock, idx: number): RenderCourseBlock => ({...block, ...findCollisions(block.start_time, block.end_time, idx)});
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
    const doesCollide = (line: Date, block: CourseBlock) => block.start_time <= line && block.end_time > line;
    const findLineCollisions = (line: Date) => {
      let found: number[] = [];
      let spacerCount = 0;
      collisions.forEach((e: number) => {
        if (doesCollide(line, blocks[e])) {
          if (filter.get(blocks[e].course_number)) spacerCount++;
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
        < SpacerBlock visible={maxes.some(e => {
          if (idx >= e.arr.length || maxes[maxi].count === 0 || !filter.get(blocks[e.arr[idx]].course_number)) return false;
          else {
            maxes[maxi].count--;
            renderCount--;
            return true;
          }
        })} key={`${key}-${idx}`}/>
      ))
    })
  }

  let ratios = new Map();
  let collisionReferences = new Map();
  return (
    blocks.map((block: CourseBlock, bidx: number) => {
      const preparedBlock = registerCollisions(block, bidx);
      const rightSpacers = renderSpacers(preparedBlock, preparedBlock.collisions_right, 'right-spacer');
      const calcRatio = (collision: number) => {
        let denominator = (ratios.get(collision) + collisionReferences.get(collision).reduce((p: number, e: number) => (filter.get(blocks[e].course_number))? p+1: p, 0));
        return 1/denominator*100;
      }
      const calcSelf = () => {
        let left_size = 0;
        let first_ls = -1;
        let fail = false;
        preparedBlock.collisions_left.forEach((collision: number, idx: number) => {
          const addend = (ratios.has(collision) && filter.get(blocks[collision].course_number))? calcRatio(collision) : 0;
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
              return < SpacerBlock size={'auto'} visible={filter.get(blocks[collision].course_number)!} key={`left-spacer-${idx}`}/>
            }
            return < SpacerBlock size={(ratios.has(collision))? `calc(${calcRatio(collision)}% - 4px)` : undefined} visible={filter.get(blocks[collision].course_number)!} key={`left-spacer-${idx}`}/>
          })}
          {/* < SchedulingBlock data={{course_instance: block, linkIDs: block.scheduled}} size={calcSelf()} visible={filter.get(block.course_number)!} key={`block-${JSON.stringify(block)}`}/> */}
          { React.createElement(renderBlockType, {
            data: {course_instance: block, linkIDs: block.scheduled},
            size: calcSelf(),
            visible: filter.get(block.course_number)!,
            inline: true,
            key: `block-${JSON.stringify(block)}`,
          })}
          { rightSpacers.render }
        </div>
      )
    })
  )
}

export default placeBlocks;