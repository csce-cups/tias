"use strict";

const { Client } = require("pg");
const fs = require("fs");
const { parse } = require("csv-parse");
const { finished } = require("stream/promises");

const client = new Client();

let course_sections = [];

const DEBUG = false;
let query_count = 0;

const loader = DEBUG
  ? async (query, values) => {
      let res = await client.query(query, values);
      if (DEBUG) console.log(`Query ${query_count++} Completed`);
      return res;
    }
  : async (query, values) => client.query(query, values);

const processFile = async (filepath) => {
  const records = [];
  const parser = fs.createReadStream(filepath).pipe(
    parse({
      // CSV options if any
    })
  );
  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  return records;
};

const weekday_map = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  R: "Thursday",
  F: "Friday",
  S: "Saturday",
  U: "Sunday",
};

const course_type_map = {
  INT: "Internship",
  INS: "Independent Study",
  CMP: "Competition",
  LEC: "Lecture",
  LAB: "Laboratory",
  PRAC: "Practicum",
  CLD: "Clinic",
  REC: "Recitation",
  EXAM: "Examination",
  SEM: "Seminar",
  RES: "Research",
  PRL: "Private Lesson",
};

const to_db_time = time => `${time}:00`;

const update_course_sections = (
  dbobj,
  section_id,
  section_number,
  weekday,
  start_time,
  end_time,
  place,
  course_type
) => {
  course_sections.push({
    course_id: dbobj.course_id,
    department: dbobj.department,
    course_number: dbobj.course_number,
    course_name: dbobj.course_name,
    section_id: section_id,
    person_id_professor: null,
    section_number: section_number,
    placeholder_professor_name: null,
    capacity_peer_teachers: null,
    capacity_teaching_assistants: null,
    weekday: weekday_map[weekday],
    start_time: to_db_time(start_time),
    end_time: to_db_time(end_time),
    place: place,
    meeting_type: course_type_map[course_type],
  });
};

const add_section_meetings = (
  modifications,
  weekdays,
  section_id,
  start_time,
  end_time,
  place,
  course_type,
  dbobj,
  section_number
) => {
  for (let day of weekdays) {
    modifications.push(
      loader(
        `
          INSERT INTO section_meeting (section_id, weekday, start_time, end_time, place, meeting_type)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          section_id,
          weekday_map[day],
          start_time,
          end_time,
          place,
          course_type_map[course_type],
        ]
      )
    );
    update_course_sections(
      dbobj,
      section_id,
      section_number,
      day,
      start_time,
      end_time,
      place,
      course_type
    );
  }
};

const parse_time = (time_str, time_zone_offset) => {
  let time_colon = time_str.indexOf(":");
  let time_space = time_str.indexOf(" ", time_colon + 1);
  let hour = +time_str.substring(0, time_colon);
  let minute = +time_str.substring(time_colon + 1, time_space);
  let meridiem = time_str.substring(time_space + 1);
  if ((meridiem === "PM") && (hour !== 12)) hour += 12;

  return `${(hour + time_zone_offset) % 24}:${minute}`;
};

const compare_time = (db_time, csv_time) => db_time === to_db_time(csv_time);

client
  .connect()
  .then(() =>
    loader(
      `
        SELECT
          course.course_id, course.department, course.course_number, course.course_name,
          course_section.section_id, course_section.person_id_professor, course_section.section_number, course_section.placeholder_professor_name, course_section.capacity_peer_teachers, course_section.capacity_teaching_assistants,
          section_meeting.weekday, section_meeting.start_time, section_meeting.end_time, section_meeting.place, section_meeting.meeting_type
        FROM course
        LEFT OUTER JOIN course_section
          ON (course.course_id = course_section.course_id)
        LEFT OUTER JOIN section_meeting
          ON (course_section.section_id = section_meeting.section_id)
        ORDER BY
          course.department,
          course.course_number,
          course_section.section_number,
          section_meeting.weekday
      `
    )
      .then((res) => (course_sections = res.rows))
      .then(() => processFile(`Spring_2022.csv`))
      .then(async (records) => {
        let modifications = [];
        for (let line of records.slice(1)) {
          const Term = 0;
          const CourseSection = 1;
          const CourseOfferingId = 2;
          const DaysMet = 3;
          const StartDate = 4;
          const EndDate = 5;
          const StartTime = 6;
          const EndTime = 7;
          const Room = 8;
          const Instructor = 9;

          const time_zone = -6;

          let course_section_first_space = line[CourseSection].indexOf(" ");
          let course_section_slash = line[CourseSection].indexOf("/");
          let course_section_second_space = line[CourseSection].indexOf(
            " ",
            course_section_first_space + 1
          );

          let department = line[CourseSection].slice(
            0,
            course_section_first_space
          );
          let course_number = line[CourseSection].slice(
            course_section_first_space + 1,
            course_section_slash
          );
          let section_number = line[CourseSection].slice(
            course_section_slash + 1,
            course_section_second_space
          );
          let course_type = line[CourseSection].slice(
            course_section_second_space + 1
          );
          let weekdays = line[DaysMet];
          let start_time = `${line[StartTime]}`;
          let end_time = `${line[EndTime]}`;
          let place = line[Room];

          let instructor = line[Instructor];

          start_time = parse_time(start_time, time_zone);
          end_time = parse_time(end_time, time_zone);

          let filtered_sections = course_sections.filter(
            (course_section) =>
              department === course_section.department &&
              course_number === course_section.course_number
          );
          if (filtered_sections.length === 0) continue;

          let sections = filtered_sections.filter(
            (course_section) => course_section.section_number === section_number
          );

          if (sections.length === 0) {
            // Option 1 - The section does not Exist
            if (filtered_sections[0].course_id == null) {
              console.error(filtered_sections[0]);
            }
            let section_id = (
              await loader(
                `
                  INSERT INTO course_section (course_id, section_number, placeholder_professor_name)
                  VALUES ($1, $2, $3)
                  RETURNING section_id
                `,
                [filtered_sections[0].course_id, section_number, instructor]
              )
            ).rows[0].section_id;
            add_section_meetings(
              modifications,
              weekdays,
              section_id,
              start_time,
              end_time,
              place,
              course_type,
              filtered_sections[0],
              section_number
            );
          } else {
            sections = sections.filter(
              (course_section) =>
                course_section.meeting_type === course_type_map[course_type]
            );
            // Option 2 - The section Exists
            //  Suboption a - The section meetings are fine
            //  Suboption b - The section meetings require an update
            //    Subsuboption i - The section meetings require full reset
            //    Subsuboption ii - The section meetings require small update
            const min_length = Math.min(sections.length, weekdays.length);
            if (min_length !== sections.length) {
              // Drop all section_meetings that match
              // Then add all section_meetings from CSV data
              loader(
                `
                  DELETE FROM section_meeting
                  WHERE section_id = $1
                `,
                [sections[0].section_id]
              ).then(() => {
                add_section_meetings(
                  modifications,
                  weekdays,
                  sections[0].section_id,
                  start_time,
                  end_time,
                  place,
                  course_type,
                  sections[0],
                  sections[0].section_number
                );
              });
            } else {
              // Check the data entries all match
              for (let i = 0; i < min_length; ++i) {
                let weekday_match =
                  sections[i].weekday === weekday_map[weekdays[i]];
                let start_time_match = compare_time(
                  sections[i].start_time,
                  start_time
                );
                let end_time_match = compare_time(
                  sections[i].end_time,
                  end_time
                );
                let place_match = sections[i].place === place;
                if (
                  !weekday_match ||
                  !start_time_match ||
                  !end_time_match ||
                  !place_match
                ) {
                  modifications.push(
                    loader(
                      `
                        UPDATE section_meeting
                        SET
                          weekday = $1,
                          start_time = $2,
                          end_time = $3,
                          place = $4
                        WHERE
                          weekday = $5 AND
                          start_time = $6 AND
                          end_time = $7 AND
                          place = $8 AND
                      `,
                      [
                        weekday_map[weekdays[i]],
                        start_time,
                        end_time,
                        place,
                        sections[i].weekday,
                        sections[i].start_time,
                        sections[i].end_time,
                        sections[i].place,
                      ]
                    )
                  );
                }
              }
            }
          }
        }
        return modifications;
      })
      .then((modifications) => Promise.all(modifications))
      .then(() => {
        if (DEBUG) console.log("Finished All Loads.");
      })
      .then(() => client.end())
  )
  .catch((err) => console.error(err));
