import React, { useContext, useEffect, useRef, useState } from "react";
import API, { Course } from "../../modules/API";
import contexts from "../APIContext";
import { AdminCourseRow } from "./AdminCourseRow";

export const AdminCourseList = () => {
  const [blocks, ] = useContext(contexts.blocks);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const ref: any = useRef(null);
  
  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  
  useEffect(() => {
    API.getCourses().then(res => {
      setCourses(res);
    });
  }, []);

  const deleteCourse = (course: Course, btn: EventTarget & HTMLButtonElement) => {
    btn.innerHTML = "Deleting...";
    API.deleteCourse(course.course_id).then(() => {
      btn.innerHTML = "Done!";
      setTimeout(() => {
        btn.classList.remove("prompt");
      }, 500);
      setTimeout(() => {
        API.getCourses().then(res => {
          setCourses(res);
        });
      }, 1000);
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const btn = document.getElementById("submit-new-course-button") as HTMLButtonElement;
    if (btn !== null) btn.setAttribute('value', "Saving...");

    const validations = {
      department: /^[A-Z]{4}$/,
      course_number: /^[0-9]+$/,
      course_name: /.+/,
    }

    const newCourse: Course = {
      course_id: -1,
      department: (document.getElementById("dpt-new-course-text") as HTMLInputElement)?.value,
      course_number: (document.getElementById("num-new-course-text") as HTMLInputElement)?.value,
      course_name: (document.getElementById("name-new-course-text") as HTMLInputElement)?.value
    }

    if (!validations.department.test(newCourse.department)) {
      if (btn !== null) btn.setAttribute('value', "Department must be 4 capital letters (ie. CSCE)");
    } else if (!validations.course_number.test(newCourse.course_number)) {
      if (btn !== null) btn.setAttribute('value', "Course number must be a number");
    } else if (!validations.course_name.test(newCourse.course_name)) {
      if (btn !== null) btn.setAttribute('value', "Course name must be at least 1 character");
    } else {
      API.addCourse(newCourse).then(res => {
        if (btn !== null) btn.setAttribute('value', "Updating list...");
        API.getCourses().then(res => {
          setCourses(res);
          if (btn !== null) btn.setAttribute('value', "Done!");
        }).catch(() => {
          if (btn !== null) btn.setAttribute('value', "Error updating list, please refresh");
        })
        
      }).catch(() => {
        if (btn !== null) btn.setAttribute('value', "An error occurred.");

      })
      console.log(newCourse);
    }

  }

  return (
    <div className="vstack inner-content">
      <h2 className="panel-title">Courses</h2>
      <span>These are the courses that are registered with the scheduler. Make sure these are up to date before uploading a new semester.</span>
      <div className="hstack header-end">
        <div className="vstack fill">
          <button style={{height: '30px', padding: '0 5px', zIndex: '3'}} className="short green button fill" onClick={() => setShowMenu(true)}>Add Course</button>
          <div ref={ref} className="add-menu-container">
            <form className={`add-menu ${!showMenu? 'hidden' : ''}`} onSubmit={(e) => submit(e)}>
              <div className="hstack">
                <input id="dpt-new-course-text" className="fill" type="text" placeholder="Department"/>
                <input id="num-new-course-text" className="fill" type="text" placeholder="Course Number"/>
              </div>
              <input id="name-new-course-text" className="fill" type="text" placeholder="Course Name"/>
              <input id="submit-new-course-button" type="submit" style={{height: '30px', padding: '0 5px'}} className="short green button fill" value="Save"/>
            </form>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          style={{height: '30px', padding: '0 5px'}} 
          className={`short purple button ${isEditing? 'toggled' : ''}`}
        >Edit Courses</button>
      </div>
      <div className="scrollable">
        { courses.sort((a, b) => a.course_number.localeCompare(b.course_number)).map((c, i) =>
          <AdminCourseRow key={JSON.stringify(c)} course={c} isBottom={courses.length - i < 5} isEditing={isEditing} deleteSelf={
            (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              deleteCourse(c, e.currentTarget);
            }
          }/>
        )}
      </div>
    </div>
  );
};
