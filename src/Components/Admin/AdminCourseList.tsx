import React, { useEffect, useRef, useState } from "react";
import API, { Course } from "../../modules/API";
import { Scrollable } from "../Misc/Scrollable";
import { AdminCourseRow } from "./AdminCourseRow";

export const AdminCourseList = () => {
  const [courses, setCourses] = useState<Course[]>([{course_id: -1} as Course]); // Local storage for courses from the API
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownRendered, setDropdownRendered] = useState(false);
  const ref: any = useRef(null);

  const toggleMenu = (to: boolean) => {
    setTimeout(() => {
      setShowMenu(to);
    }, 1);
    if (to) setDropdownRendered(true);
    else setTimeout(() => setDropdownRendered(false), 210);
  }
  
  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && showMenu) {
        toggleMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  
  // Grabs the courses from the API when the component mounts
  useEffect(() => {
    let rendered = true;
    API.getCourses().then(res => {
      if (rendered) setCourses(res);
    });

    return () => {rendered = false};
  }, []);

  const deleteCourse = (course: Course, btn: EventTarget & HTMLButtonElement) => {
    btn.innerHTML = "Deleting...";
    API.deleteCourse(course.course_id).then(() => {
      btn.innerHTML = "Done!";
      // Timeouts for UX, it is jarring to have things happen immediately after text changes
      setTimeout(() => {
        btn.classList.remove("prompt");
      }, 1000);
      
      // Fetch courses after the animation for removing "prompt is gone"
      setTimeout(() => {
        API.getCourses().then(res => {
          setCourses(res);
        });
      }, 1410);
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const btn = document.getElementById("submit-new-course-button") as HTMLButtonElement;
    if (btn !== null) btn.setAttribute('value', "Saving...");

    // Basic regex to ensure the department is an all caps 4 letter string, course number is only numbers, and course name isn't empty
    const validations = { 
      department: /^[A-Z]{4}$/,
      course_number: /^[0-9]+$/,
      course_name: /.+/,
    }

    // We set the course_id to -1 because it is assigned by backend. It'll get populated after API,getCourses
    const newCourse: Course = {
      course_id: -1, 
      department: (document.getElementById("dpt-new-course-text") as HTMLInputElement)?.value,
      course_number: (document.getElementById("num-new-course-text") as HTMLInputElement)?.value,
      course_name: (document.getElementById("name-new-course-text") as HTMLInputElement)?.value
    }

    // Validations first, then API call
    if (!validations.department.test(newCourse.department)) {
      if (btn !== null) btn.setAttribute('value', "Department must be 4 capital letters (ie. CSCE)");
    } else if (!validations.course_number.test(newCourse.course_number)) {
      if (btn !== null) btn.setAttribute('value', "Course number must be a number");
    } else if (!validations.course_name.test(newCourse.course_name)) {
      if (btn !== null) btn.setAttribute('value', "Course name must be at least 1 character");
    } else {
      API.addCourse(newCourse).then(res => {
        if (btn !== null) btn.setAttribute('value', "Updating list...");
        // Refetch courses from backend to ensure consistancy
        API.getCourses().then(res => {
          setCourses(res);
          if (btn !== null) btn.setAttribute('value', "Done!");
        }).catch(rej => {
          if (btn !== null) btn.setAttribute('value', "Error updating list, please refresh");
        })
      }).catch(rej => {
        if (btn !== null) btn.setAttribute('value', "An error occurred.");

      })
    }
  }

  const courseBtnStyles = {
    height: '30px', padding: '0 5px', zIndex: '3'
  }

  return (
    <div className="vstack inner-content">
      <h2 className="panel-title">Courses</h2>
      <span className="element">These are the courses that are registered with the scheduler. Make sure these are up to date before uploading a new semester.</span>
      <div className="hstack header-end">
        <div className="vstack fill">
          <button style={courseBtnStyles} className="short green button fill" onClick={() => toggleMenu(true)}>Add Course</button>
          { dropdownRendered?
            <div ref={ref} className="add-menu-container">
              <form className={`add-menu ${!showMenu? 'hidden' : ''}`} onSubmit={(e) => submit(e)}>
                <div className="hstack">
                  <input id="dpt-new-course-text" className="fill" type="text" placeholder="Department"/>
                  <input id="num-new-course-text" className="fill" type="text" placeholder="Course Number"/>
                </div>
                <input id="name-new-course-text" className="fill" type="text" placeholder="Course Name"/>
                <input id="submit-new-course-button" type="submit" style={courseBtnStyles} className="short green button fill" value="Save"/>
              </form>
            </div>
          : <></> }
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} style={courseBtnStyles} className={`short purple button ${isEditing? 'toggled' : ''}`}
        >Edit Courses</button>
      </div>
      < Scrollable deps={[courses]}>
        { courses.length > 0? 
          courses.sort((a, b) => a.course_number.localeCompare(b.course_number)).map((c, i) =>
            <AdminCourseRow key={JSON.stringify(c)} course={c} isBottom={courses.length - i < 5} isEditing={isEditing} deleteSelf={
              (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                deleteCourse(c, e.currentTarget);
              }
            }/>
          )
          : <div className="loading">No courses.</div>
        }
      </Scrollable>
    </div>
  );
};
