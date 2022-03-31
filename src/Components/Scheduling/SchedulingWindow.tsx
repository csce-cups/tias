import React, { FC, useContext, useEffect, useState } from "react";
import { SchedulingRender } from "./SchedulingRender";
import { SchedulingFilter } from "./SchedulingFilter";
import contexts from "../APIContext";
import { CourseBlock } from "../../modules/API";
import RenderBlockProps from "./BlockBase";

export interface OptionsProps {
  selectable?: boolean
  noHeader?: boolean
  noBorder?: boolean
  noFilter?: boolean
}

interface Props {
  renderBlockType: React.FC<RenderBlockProps>
  options?: OptionsProps
}

export const SchedulingWindow: FC<Props> = ({renderBlockType, options}) => {
  const [blocks, _] = useContext(contexts.blocks);
  const [filter, setFilter] = useState(new Map<number, boolean>());

  useEffect(() => {
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
    <div className="vstack main" style={styles}>
      <SchedulingRender renderBlockType={renderBlockType} filter={filter} options={options} />
      {!options?.noFilter && <SchedulingFilter filter={filter} setFilter={setFilter} />}
      {/* <SchedulingFilter filter={filter} setFilter={setFilter} /> */}
    </div>
  );
};
