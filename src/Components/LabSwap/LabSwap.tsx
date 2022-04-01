import React, { useState, createContext, useContext } from "react";
import { LabSwapBlock } from "./LabSwapBlock";
import { Selection } from "./Selection";
// import { SchedulingWindow } from "./SchedulingWindow";
import { Button } from "@material-ui/core";
import { CourseBlock, CourseBlockWeek } from "../../modules/API";
import contexts from '../APIContext'
import { SchedulingWindow } from "../Scheduling/SchedulingWindow";
//for main component
//needs selection confirmation window
//submition ability
//render viewce: string

export interface CompressedCourseBlock extends CourseBlock {
  section_numbers: string[]
}

const cmp = (
  course1: CompressedCourseBlock,
  course2: CourseBlock
) => {
  return (
    course1.course_number === course2.course_number &&
    course1.start_time.getTime() === course2.start_time.getTime() &&
    course1.end_time.getTime() === course2.end_time.getTime()
  );
};

const compressDay = (
  courses: Array<CourseBlock> | null
) => {
  let compressed: Array<CompressedCourseBlock> = [];
  if (courses === null) return compressed;

  courses.sort((a, b) => {
    if (a.start_time.getTime() < b.start_time.getTime()) return -1;
    else if (a.start_time.getTime() > b.start_time.getTime()) return 1;
    else if (a.end_time.getTime() < b.end_time.getTime()) return -1;
    else if (a.end_time.getTime() > b.end_time.getTime()) return 1;
    else if (a.course_number < b.course_number) return -1;
    else if (a.course_number > b.course_number) return 1;
    else return 0;
  });

  let fidx = -1;
  let cidx = 0;
  while (cidx < courses.length) {
    let c: CourseBlock = courses[cidx];
    compressed.push({
      ...c,
      section_numbers: [c.section_number]
    });

    fidx++; //update to the newly added index
    cidx++; //move to the next uncondensed section
    //while the next course in the array is compatiable with the current one
    while (cidx < courses.length && cmp(compressed[fidx], courses[cidx])) {
      compressed[fidx].section_numbers.push(courses[cidx].section_number);
      cidx++;
    }
  }
  return compressed;
}

const compressWeek = (week: CourseBlockWeek): CourseBlockWeek => {
  return {
    Monday: compressDay(week.Monday),
    Tuesday: compressDay(week.Tuesday),
    Wednesday: compressDay(week.Wednesday),
    Thursday: compressDay(week.Thursday),
    Friday: compressDay(week.Friday),
  }
}

export const selectFunction = createContext<any>(null); // TODO: These should be more strongly typed
export const LabSwap = () => {
  const [blockWeek, setBlockWeek] = useContext(contexts.blocks);
  const [requests, setRequests] = useState<any>({ valid: false }); // TODO: These should be more strongly typed
  const [offers, setOffers] = useState<any>({ valid: false }); // TODO: These should be more strongly typed
  const selectSection = (course: CompressedCourseBlock, section: string) => {
    let data = {
      valid: true,
      ...course,
    };

    data.section_numbers = [section]; // only include chosen course
    if (offers.valid) setRequests(data);
    else setOffers(data);
  };

  const submitTrade = () => {
    setRequests({ valid: false });
    setOffers({ valid: false });
  };

  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(blockWeek), setBlockWeek];

  return (
    <div className="app-body">
      <div className="vstack sidebar">
        {/*for selection and submit button */}
        <div className="hstack">
          {/*TODO: Better CSS for these*/}
          <Selection sections={requests} title="Request" />
          <Selection sections={offers} title="Offer" />
        </div>
        <Button variant="outlined" onClick={submitTrade}>
          Request Trade
        </Button>
      </div>
      < contexts.blocks.Provider value={blocksPayload} >
        <selectFunction.Provider value={selectSection}>
          <SchedulingWindow renderBlockType={LabSwapBlock} options={{selectable: false}} />
        </selectFunction.Provider>
      </ contexts.blocks.Provider >
    </div>
  );
};
