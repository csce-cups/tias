import React from "react";
import { AdminCourseRow } from "./AdminCourseRow";

export const AdminCourseList = () => {
  
  return (
    <div className="vstack course-list">
      <h2 className="panel-title">Possible Courses</h2>
      < AdminCourseRow />
    </div>
  );
};
