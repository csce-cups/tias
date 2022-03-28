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

const float_hours_to_db_time = (time) => {
  let hours = Math.floor(time);

  let minutes = Math.floor((time - hours) * 60);

  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
};

let num_courses, num_sections

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
        person_id
        FROM person
      `
    )
      .then((res) => res.rows)
      .then((people) => {
        let modifications = [];
        for (let person of people) {
          let num_qualifications = Math.floor(Math.random() * num_courses / 2) + 3;
          if (num_qualifications > 0) {
            let qualifications = new Set();
            while (qualifications.size < num_qualifications) {
              qualifications.add(Math.floor(Math.random() * num_courses) + 1);
            }
            let qualString = `
              INSERT INTO qualification
              VALUES\n
            `;
            let acc = 1;
            let qualList = [];
            let tempList = [];
            for (let courseId of qualifications.values()) {
              tempList.push(`($${acc++}, $${acc++}, $${acc++})`);
              qualList.push(person.person_id);
              qualList.push(courseId);
              qualList.push(Math.random() < 0.9);
            }
            qualString += tempList.join(",\n");
            qualString += "\nON CONFLICT DO NOTHING";
            modifications.push(loader(qualString, qualList));
          }

          for (let weekday of Math.random() < 0.1
            ? Object.values(weekday_map)
            : [
                ["Monday", "Wednesday", "Friday"],
                ["Tuesday", "Thursday"],
              ]) {
            console.log(weekday);
            let num_availabilities = Math.floor(Math.random() * 5);

            let window_size = 13 / num_availabilities;
            for (let i = 0; i < num_availabilities; ++i) {
              let window_start = i * window_size + 2;

              let time1 = Math.random() * window_size + window_start;
              let time2 = Math.random() * window_size + window_start;

              let start_time = Math.min(time1, time2);
              let end_time = Math.max(time1, time2);

              if (typeof weekday === "string") {
                console.table([
                  person.person_id,
                  weekday,
                  float_hours_to_db_time(start_time),
                  float_hours_to_db_time(end_time),
                ]);
                modifications.push(
                  loader(
                    `
                      INSERT INTO person_availability
                      VALUES
                      ($1, $2, $3, $4)
                      ON CONFLICT DO NOTHING
                    `,
                    [
                      person.person_id,
                      weekday,
                      float_hours_to_db_time(start_time),
                      float_hours_to_db_time(end_time),
                    ]
                  )
                );
              } else {
                for (let day of weekday) {
                  console.table([
                    person.person_id,
                    day,
                    float_hours_to_db_time(start_time),
                    float_hours_to_db_time(end_time),
                  ]);
                  modifications.push(
                    loader(
                      `
                        INSERT INTO
                        person_availability
                        VALUES
                        ($1, $2, $3, $4)
                        ON CONFLICT DO NOTHING
                      `,
                      [
                        person.person_id,
                        day,
                        float_hours_to_db_time(start_time),
                        float_hours_to_db_time(end_time),
                      ]
                    )
                  )
                }
              }
            }
          }

          let num_preferences = Math.random() * 20;
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
