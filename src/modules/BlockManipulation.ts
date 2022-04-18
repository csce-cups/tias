import React from "react";
import API, { CourseBlock, CourseBlockWeek, Person } from "./API";

export interface CompressedCourseBlock extends CourseBlock {
  section_numbers: string[]
  professors: string[]
  section_ids: number[]
  locations: string[]
	scheduledAll: number[][]
}

export const cmp = (course1: CompressedCourseBlock, course2: CourseBlock) => {
  return (
    course1.course_number === course2.course_number &&
    course1.start_time.getTime() === course2.start_time.getTime() &&
    course1.end_time.getTime() === course2.end_time.getTime()
  );
};

export const compressDay = (courses: Array<CourseBlock> | null | undefined) => {
  let compressed: Array<CompressedCourseBlock> = [];
  if (courses === null || courses === undefined) return null;

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
      section_numbers: [c.section_number],
      section_ids: [c.section_id],
      professors: [c.professor],
      locations: [c.place],
      scheduledAll: (c.scheduled)? [c.scheduled] : []
    });

    fidx++; //update to the newly added index
    cidx++; //move to the next uncondensed section
    //while the next course in the array is compatiable with the current one
    while (cidx < courses.length && cmp(compressed[fidx], courses[cidx])) {
      compressed[fidx].section_numbers.push(courses[cidx].section_number);
      compressed[fidx].section_ids.push(courses[cidx].section_id);
      compressed[fidx].professors.push(courses[cidx].professor);
      compressed[fidx].locations.push(courses[cidx].place);
      if (courses[cidx].scheduled) compressed[fidx].scheduledAll.push(courses[cidx].scheduled!);
      cidx++;
    }
  }
  return compressed;
};

export const compressWeek = (week: CourseBlockWeek): CourseBlockWeek => {
  return {
    Monday: compressDay(week.Monday),
    Tuesday: compressDay(week.Tuesday),
    Wednesday: compressDay(week.Wednesday),
    Thursday: compressDay(week.Thursday),
    Friday: compressDay(week.Friday),
  };
};

export interface loadScheduleParams {
  employees: Person[];
  setEmployees: React.Dispatch<React.SetStateAction<Person[]>>;
  blocks: CourseBlockWeek;
  setBlocks: React.Dispatch<React.SetStateAction<CourseBlockWeek>>;
  setLoadedSchedule: React.Dispatch<
    React.SetStateAction<Map<string, number[]>>
  >;
}

export const loadSchedule = (params: loadScheduleParams): Promise<void> => {
  const { employees, setEmployees, blocks, setBlocks, setLoadedSchedule } =
    params;

  let scheduled = new Set<number>();
  employees.forEach((e, i) => {
    // At the start of scheduling, nobody is scheduled.
    employees[i].isScheduled = false;
  });
  setEmployees(employees);

  return API.getSavedSchedule().then((resp) => {
    const allBlocks = [
      blocks.Monday,
      blocks.Tuesday,
      blocks.Wednesday,
      blocks.Thursday,
      blocks.Friday,
    ] as any; // For easier iteration
    
    allBlocks.forEach((day: any, oidx: number) => {
      day?.forEach((block: any, iidx: number) => {
        const pids = resp.has(`${block.section_id}`)
          ? resp.get(`${block.section_id}`)!
          : [];
        allBlocks[oidx][iidx].scheduled = pids;
        allBlocks[oidx][iidx].ronly_scheduled = pids;
        pids.forEach((id) => scheduled.add(id));
      });
    });

    // Update if the employees are scheduled or not
    employees.forEach((e, i) => {
      employees[i].isScheduled = scheduled.has(e.person_id);
    });

    setEmployees(employees);
    setLoadedSchedule(new Map(resp));
    setBlocks({
      Monday: allBlocks[0],
      Tuesday: allBlocks[1],
      Wednesday: allBlocks[2],
      Thursday: allBlocks[3],
      Friday: allBlocks[4],
    });
  });
};

export const updateWithSchedule = (
  schedule: Map<string, number[]>,
  toUpdate: CourseBlockWeek,
  udpate: React.Dispatch<React.SetStateAction<CourseBlockWeek>>
) => {
  const allBlocks = [
    toUpdate.Monday,
    toUpdate.Tuesday,
    toUpdate.Wednesday,
    toUpdate.Thursday,
    toUpdate.Friday,
  ] as any; // For easier iteration
  
  allBlocks.forEach((day: any, oidx: number) => {
    day?.forEach((block: any, iidx: number) => {
      const pids = schedule.has(`${block.section_id}`)
        ? schedule.get(`${block.section_id}`)!
        : [];
      allBlocks[oidx][iidx].scheduled = pids;
    });
  });

  udpate({
    Monday: allBlocks[0],
    Tuesday: allBlocks[1],
    Wednesday: allBlocks[2],
    Thursday: allBlocks[3],
    Friday: allBlocks[4],
  });
}
