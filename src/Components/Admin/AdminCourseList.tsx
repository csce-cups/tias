import React, { useContext, useEffect, useState } from "react";
import { CourseBlock } from "../../modules/API";
import contexts from "../APIContext";
import { AdminCourseRow } from "./AdminCourseRow";

export const AdminCourseList = () => {
  const [count, setCount] = useState<number>(1);
  const [blocks, ] = useContext(contexts.blocks);
  const [courses, setCourses] = useState<string[]>([]);
  
  useEffect(() => {
    let course_set = new Set<string>();
    const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday];
    allBlocks.forEach((blocks: CourseBlock[] | null) => {
      blocks?.forEach((block: CourseBlock) => {
        course_set.add(`${block.course_number}`);
      })
    })
    setCount(course_set.size + 1);
    setCourses(Array.from(course_set).sort());
  }, [blocks]);

  return (
    <div className="vstack inner-content">
      <h2 className="panel-title">Courses</h2>
      <span>These are the courses that are registered with the scheduler. Make sure these are up to date before uploading a new semester</span>
      { Array.from(Array(count).keys()).map(i => 
        (courses[i] === '')? <></> :
        <AdminCourseRow key={i} valueState={[courses, setCourses, i]} countState={[count, setCount]}/>
      )}
    </div>
  );
};
