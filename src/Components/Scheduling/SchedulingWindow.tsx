import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { CourseBlock } from "../../modules/API";
import contexts from "../APIContext";
import RenderBlockProps from "./BlockBase";
import { SchedulingFilter } from "./SchedulingFilter";
import { SchedulingRender } from "./SchedulingRender";

export interface OptionsProps {
  selectable?: boolean
  noHeader?: boolean
  noBorder?: boolean
  editing?: {
    bool: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    count: [number, React.Dispatch<React.SetStateAction<number>>]
  }

  // Lets you specify an externally controlled filter
  filter?: [Map<number, boolean>, React.Dispatch<React.SetStateAction<Map<number, boolean>>>]
}

interface Props {
  renderBlockType: React.FC<RenderBlockProps>
  top?: ReactNode
  options?: OptionsProps
}

export const SchedulingWindow: FC<Props> = ({renderBlockType, options, top}) => {
  const [blocks, ] = useContext(contexts.blocks);
  const [filter, setFilter] = useState(new Map<number, boolean>());
  const filterActual = options?.filter?.[0] ?? filter;

  useEffect(() => {
    if (options?.filter || filter.size !== 0) return; // Externally controlled filter shouldn't be handled
    let filterMap = new Map<number, boolean>();
    const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday];
    allBlocks.forEach((blocks: CourseBlock[] | null) => {
      blocks?.forEach((block: CourseBlock) => {
        filterMap.set(block.course_number, true)
      })
    })
    setFilter(filterMap);
  }, [blocks]);

  const styles = {
    border: (options?.noBorder)? '0' : undefined,
  }

  return (
    <div className="vstack main" data-testid="SchedulingWindow" style={styles}>
      { top?
        top
        : <div style={{height: '1.5em'}}/>
      }
      <SchedulingRender renderBlockType={renderBlockType} filter={filterActual} options={options} />
      {!options?.filter && <SchedulingFilter filter={filter} setFilter={setFilter} />}
    </div>
  );
};
