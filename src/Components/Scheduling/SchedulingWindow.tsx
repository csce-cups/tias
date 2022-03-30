import React, { FC, useContext, useEffect, useState } from "react";
import { SchedulingRender } from "./SchedulingRender";
import { SchedulingFilter } from "./SchedulingFilter";
import contexts from "../APIContext";
import { CourseBlock, CourseBlockWeek } from "../../modules/API";
import RenderBlockProps from "./BlockBase";

interface Props {
  renderBlockType: React.FC<RenderBlockProps>
  options?: {
    selectable?: boolean
  }
}

export const SchedulingWindow: FC<Props> = ({renderBlockType, options}) => {
  const [blocks, _] = useContext(contexts.blocks);
  const [filter, setFilter] = useState(new Map<number, boolean>());

  useEffect(() => {
    let filterMap = new Map<number, boolean>();
    const allBlocks = [
      blocks.Monday,
      blocks.Tuesday,
      blocks.Wednesday,
      blocks.Thursday,
      blocks.Friday,
    ];
    console.log(allBlocks);
    allBlocks.forEach((blocks: CourseBlock[] | null) => {
      blocks?.forEach((block: CourseBlock) => {
        filterMap.set(block.course_number, true);
      });
    });
    setFilter(filterMap);
  }, [blocks]);

  return (
    <div className="vstack main">
      <SchedulingRender renderBlockType={renderBlockType} filter={filter} options={options} />
      <SchedulingFilter filter={filter} setFilter={setFilter} />
    </div>
  );
};
