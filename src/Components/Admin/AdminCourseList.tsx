import React, { useContext, useEffect, useState } from "react";
import API, { Course } from "../../modules/API";
import contexts from "../APIContext";
import { AdminCourseRow } from "./AdminCourseRow";

export const AdminCourseList = () => {
  const [blocks, ] = useContext(contexts.blocks);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    API.getCourses().then(res => {
      setCourses(res);
    });
  }, []);

  return (
    <div className="vstack inner-content">
      <h2 className="panel-title">Courses</h2>
      <span>These are the courses that are registered with the scheduler. Make sure these are up to date before uploading a new semester.</span>
      <div className="hstack" style={{margin: '0 5px'}}>
        <button style={{height: '30px', padding: '0 5px'}} className="short green button fill">Add Course</button>
        <button onClick={() => setIsEditing(!isEditing)} style={{height: '30px', padding: '0 5px'}} className="short purple button">Edit Courses</button>
      </div>
      <div className="scrollable">
        { courses.map(c =>
          <AdminCourseRow key={JSON.stringify(c)} course={c} isEditing={isEditing}/>
        )}
      </div>
    </div>
  );
};
