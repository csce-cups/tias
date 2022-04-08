import React, { FC, useEffect, useRef } from "react";

interface Props {
  countState: [number, React.Dispatch<React.SetStateAction<number>>]
  valueState: [string[], React.Dispatch<React.SetStateAction<string[]>>, number]
}

export const AdminCourseRow: FC<Props> = ({countState, valueState}) => {
  const [courses, setCourses, which] = valueState;
  const [content, setContent] = React.useState("");
  const [active, setActive] = React.useState(false);
  const ref: any = useRef(null);

  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && active) {
        handleClick(true);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const handleClick = (out?: boolean) => {
    console.log(content)
    if (out && content === '') {
      countState[1](countState[0] - 1);
    } else if (content === '') {
      countState[1](countState[0] + 1);
      setCourses([...courses, ""]);
    }
    setActive(!active);
  }

  const handleChange = (event: any) => {
    const val = event.target.value;
    setContent(val);
    console.log(courses.map((course, i) => i === which ? val : course));
    setCourses(courses.map((course, i) => i === which ? val : course));
  }

  return (
    <div className="course-row">
      <input 
        ref={ref}
        name={`add-course-text-${courses[which]}`}
        type="text" value={(courses[which] === undefined)? '' : courses[which]}
        placeholder="Add Course"
        onChange={handleChange}
        onClick={() => handleClick}
      />
    </div>
  );
};
