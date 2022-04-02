import { CourseBlock, CourseBlockWeek } from "./API";

export interface CompressedCourseBlock extends CourseBlock {
	section_numbers: string[]
	professors: string[]
	section_ids: number[]
}

export const cmp = (
	course1: CompressedCourseBlock,
	course2: CourseBlock
) => {
	return (
		course1.course_number === course2.course_number &&
		course1.start_time.getTime() === course2.start_time.getTime() &&
		course1.end_time.getTime() === course2.end_time.getTime()
	);
};

export const compressDay = (
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
			section_numbers: [c.section_number],
			section_ids: [c.section_id],
			professors: [c.professor],
		});

		fidx++; //update to the newly added index
		cidx++; //move to the next uncondensed section
		//while the next course in the array is compatiable with the current one
		while (cidx < courses.length && cmp(compressed[fidx], courses[cidx])) {
			compressed[fidx].section_numbers.push(courses[cidx].section_number);
			compressed[fidx].section_ids.push(courses[cidx].section_id);
			compressed[fidx].professors.push(courses[cidx].professor);
			cidx++;
		}
	}
	return compressed;
}

export const compressWeek = (week: CourseBlockWeek): CourseBlockWeek => {
	return {
		Monday: compressDay(week.Monday),
		Tuesday: compressDay(week.Tuesday),
		Wednesday: compressDay(week.Wednesday),
		Thursday: compressDay(week.Thursday),
		Friday: compressDay(week.Friday),
	}
}