import React, { FC, useEffect, useRef } from "react";

interface Props {
  countState: [number, React.Dispatch<React.SetStateAction<number>>]
  valueState: [string[], React.Dispatch<React.SetStateAction<string[]>>, number]
}

export const AdminCourseRow: FC<Props> = ({countState, valueState}) => {
  const [courses, setCourses, which] = valueState;
  const [count, setCount] = countState;
  const [content, setContent] = React.useState("");

  const handleChange = (event: any) => {
    const val = event.target.value;
    setContent(val)
    if (courses[which] === undefined) {
      setCount(count + 1);
      setCourses([...courses, val]);
    } else {
      setCourses(courses.map((course, i) => i === which ? val : course));
    }
  }

  return (
    <div className="course-row">
      <input
        name={`add-course-text-${courses[which]}`}
        type="text" value={(courses[which] === undefined)? '' : courses[which]}
        placeholder="Add Course"
        onChange={handleChange}
      />
    </div>
  );
};
