"use strict";

const { Client } = require("pg");

const client = new Client();

const DEBUG = true;
let query_count = 0;

const loader = DEBUG
  ? async (query, values) => {
      let this_query = query_count++;
      if (DEBUG) {
        console.log(`Query ${this_query} Started`);
        console.log(query);
        console.log(values);
      }
      let res = await client.query(query, values);
      if (DEBUG) {
        console.log(`Query ${this_query} Completed`);
      }
      return res;
    }
  : async (query, values) => client.query(query, values);

const weekday_map = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  R: "Thursday",
  F: "Friday",
  S: "Saturday",
  U: "Sunday",
};

const preference_list = [
  "Can't Do",
  "Prefer Not To Do",
  "Indifferent",
  "Prefer To Do"
]

const qualified_probability = {
  "CSCE 110": 1.0,
  "CSCE 111": 0.4,
  "CSCE 120": 0.95,
  "CSCE 121": 0.95,
  "CSCE 206": 0.3,
  "CSCE 221": 0.65,
  "CSCE 222": 0.2,
  "CSCE 312": 0.4,
  "CSCE 313": 0.35,
  "CSCE 314": 0.2,
  "CSCE 315": 0.35,
  "CSCE 331": 0.35
}


const date_to_db_time = (time) => {
  let hours = Math.floor(time.getHours());

  let minutes = Math.floor(time.getMinutes());

  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
};

let num_courses, num_sections
const sections_to_be_busy = {}

client
  .connect()
  .then(() =>
    loader(
      `
        SELECT
        count(course_id) as count
        FROM course
      `
    )
  )
  .then((res) => (num_courses = res.rows[0].count))
  .then(() =>
    loader(
      `
        SELECT
        count(section_id) as count
        FROM course_section
      `
    )
  )
  .then((res) => (num_sections = res.rows[0].count))
  .then(() => 
    loader(
      `
        SELECT
          course_section.section_id,
          section_meeting.weekday, section_meeting.start_time, section_meeting.end_time
        FROM course_section
        JOIN section_meeting ON
          course_section.section_id = section_meeting.section_id
      `
    ))
  .then(res => {
    for (let row of res.rows) {
      if (sections_to_be_busy[row.section_id] === undefined) {
        sections_to_be_busy[row.section_id] = []
      }
      let start_time = new Date(0);
      let end_time = new Date(0);
      let colon_index = row.start_time.indexOf(':')
      start_time.setHours(+row.start_time.substring(0, colon_index))
      start_time.setMinutes(+row.start_time.substring(colon_index + 1, row.start_time.indexOf(':', colon_index + 1)))
      colon_index = row.end_time.indexOf(':')
      end_time.setHours(+row.end_time.substring(0, colon_index))
      end_time.setMinutes(+row.end_time.substring(colon_index + 1, row.end_time.indexOf(':', colon_index + 1)))
      sections_to_be_busy[row.section_id].push({weekday: row.weekday, start_time, end_time})
    }
  })
  .then(() =>
    loader(
      `
        SELECT
        person_id
        FROM person
      `
    )
      .then((res) => res.rows)
      .then((people) => {
        console.log(sections_to_be_busy)
        let modifications = [];
        for (let person of people) {
          let qualString = `
            INSERT INTO qualification
            VALUES\n
          `;
          let courseId = 0, acc = 1;
          let qualList = [];
          let tempList = [];

          for (let odds of Object.values(qualified_probability)) {
            tempList.push(`($${acc++}, $${acc++}, $${acc++})`);
            qualList.push(person.person_id);
            qualList.push(++courseId);
            qualList.push(Math.random() < odds);            
          }
          qualString += tempList.join(",\n");
          qualString += "\nON CONFLICT DO NOTHING";
          modifications.push(loader(qualString, qualList));

          let person_courses = []
          for (let i = 0; i < 5; ++i) {
            let section_id = Math.floor(Math.random() * num_sections) + 1
            let section = sections_to_be_busy[section_id]
            if (section === undefined) {
              --i;
              continue;
            }
            let intersects = false
            for (let course of person_courses) {
              for (let meeting of course) {
                if (section.weekday == meeting.weekday && !(section.end_time < meeting.start_time || section.start_time > meeting.end_time)) {
                  intersects = true
                  break
                }
              }
              if (intersects) break
            }
            if (!intersects) {
              person_courses.push(section)
            } else {
              --i; // bad, very very bad
            }
          }
          for (let course of person_courses) {
            for (let meeting of course) {
              loader(
                `
                  INSERT INTO person_unavailability
                  VALUES
                  ($1, $2, $3, $4)
                  ON CONFLICT DO NOTHING
                `,
                [
                  person.person_id,
                  meeting.weekday,
                  date_to_db_time(meeting.start_time),
                  date_to_db_time(meeting.end_time)
                ]
              )
            }
          }

          let num_preferences = Math.random() * 35;
          if (num_preferences > 0) {
            let preferences = new Set();
            while (preferences.size < num_preferences) {
              preferences.add(Math.floor(Math.random() * num_sections) + 1);
            }
            let prefString = `
              INSERT INTO section_assignment_preference
              VALUES\n
            `;
            let acc = 1;
            let prefList = [];
            let tempList = [];
            for (let sectionId of preferences.values()) {
              tempList.push(`($${acc++}, $${acc++}, $${acc++})`);
              prefList.push(person.person_id);
              prefList.push(sectionId);
              prefList.push(preference_list[Math.floor(Math.random() * preference_list.length)]);
            }
            prefString += tempList.join(",\n");
            prefString += "\nON CONFLICT DO NOTHING";
            modifications.push(loader(prefString, prefList));
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
