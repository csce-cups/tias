import React, { FC, useEffect, useRef, useState } from "react";
import { Course } from "../../modules/API";
import uuid from "../../uuid";

interface Props {
  course: Course
  isEditing: boolean
  deleteSelf: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isBottom: boolean
}

export const AdminCourseRow: FC<Props> = ({course, isEditing, deleteSelf, isBottom}) => {
  const [isPrompt, setIsPrompt] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const ref: any = useRef(null);
  const id = uuid();
  const bid = uuid();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === course.course_number) setButtonDisabled(false);
    else setButtonDisabled(true);
  }
  
  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && isPrompt) {
        setIsPrompt(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  if (course.course_id === -1) return (
    <div className="loading">Loading...</div>
  )

  return (
    <div className="course-row hstack">
      <div className="vstack">
        <div>
          {course.department} {course.course_number}
        </div>
        <div>
          {course.course_name} 
        </div>
      </div>
      <div className="fill"/>
      <div onClick={() => setIsPrompt(true)} 
        className={`red button course-delete ${!isEditing? 'hidden' : ''} ${isPrompt? 'prompt' : ''} ${isBottom? 'bottom' : ''}`}
      >
        { isPrompt?
          <div ref={ref} className="vstack" style={{height: '100%'}}>
            <div className="vstack" style={{height: '100%', padding: '10px'}}>
              <div>
                Are you sure you want to delete {course.department} {course.course_number}? 
                If the semester data depends on this course, you will need to upload a new semester in order to repair it.
              </div>
              <div className="m10"/>
              Please enter {course.course_number} to confirm.
            </div>

            <input id={id} onChange={handleChange} type="text" className="confirm" placeholder={`Type ${course.course_number} to confirm`}/>
            <div className="m10"/>
            <div className="hstack">
              <button disabled={buttonDisabled} className="short button fill onred" onClick={deleteSelf}>Delete</button>
            </div>
          </div>
          :
          <div>Delete</div>
        }
      </div>
    </div>
  );
};
