import { CourseBlock, CourseBlockWeek, parseCookie } from "./API";

export const findScheduled = (week: CourseBlockWeek ) => {
    const id = parseCookie().tias_user_id;
    let retData: CourseBlock[] = [];

    const days = [week.Monday, week.Tuesday, week.Wednesday, week.Thursday, week.Friday];
    days.forEach(day => {
      day?.forEach(block => {
        if (block.scheduled?.includes(+id)) retData.push(block)
      })
    })

    return retData;
}