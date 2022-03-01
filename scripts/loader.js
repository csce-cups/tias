'use strict';

const { Client } = require('pg')
const fs = require('fs')
const { parse } = require('csv-parse')
const { finished } = require('stream/promises');
const { start } = require('repl');

const client = new Client()

let course_sections = []

const loader = async (query, values) => {
    await client.connect()
    const res = await client.query(query, values)
    await client.end()
    return res
}

const processFile = async (filepath) => {
    const records = []
    const parser = fs
        .createReadStream(filepath)
        .pipe(parse({
        // CSV options if any
        }))
    parser.on('readable', function(){
        let record; while ((record = parser.read()) !== null) {
        // Work with each record
        records.push(record)
        }
    })
    await finished(parser)
    return records
}

loader(`
    SELECT * FROM course
    LEFT OUTER JOIN course_section
    ON (course.course_id = course_section.course_id)
    LEFT OUTER JOIN section_meeting
    ON (course_section.section_id = section_meeting.section_id)
`)
    .then(res => course_sections = res.rows)
    .then(() => console.table(course_sections.slice(0,5)))
    .then(() => processFile(`Spring_2022.csv`)
        .then(records => {console.table(records.slice(0,6)); return records})
        .then(records => {
            let modifications = []
            for (let line of records.slice(1)) {
                const Term = 0
                const CourseSection = 1
                const CourseOfferingId = 2
                const DaysMet = 3
                const StartDate = 4
                const EndDate = 5
                const StartTime = 6
                const EndTime = 7
                const Room = 8
                const Instructor = 9

                const time_zone = 'CST'

                const weekday_map = {
                    'M': 'Monday',
                    'T': 'Tuesday',
                    'W': 'Wednesday',
                    'R': 'Thursday',
                    'F': 'Friday',
                    'S': 'Saturday',
                    'U': 'Sunday'
                }

                const course_type_map = {
                    'INT': 'Internship',
                    'INS': 'Independent Study',
                    'CMP': 'Competition',
                    'LEC': 'Lecture',
                    'LAB': 'Laboratory',
                    'PRAC': 'Practicum',
                    'CLD': 'Clinic',
                    'REC': 'Recitation',
                    'EXAM': 'Examination',
                    'SEM': 'Seminar',
                    'RES': 'Research',
                    'PRL': 'Private Lesson'
                }

                let course_section_first_space = line[CourseSection].indexOf(' ')
                let course_section_slash = line[CourseSection].indexOf('/')
                let course_section_second_space = line[CourseSection].indexOf(' ', course_section_first_space + 1)

                let department = line[CourseSection].slice(0, course_section_first_space)
                let course_number = line[CourseSection].slice(course_section_first_space + 1, course_section_slash);
                let section_number = line[CourseSection].slice(course_section_slash + 1, course_section_second_space);
                let course_type = line[CourseSection].slice(course_section_second_space + 1)
                let weekdays = line[DaysMet]
                let start_time = `${line[StartTime]} ${time_zone}`
                let end_time = `${line[EndTime]} ${time_zone}`
                let place = line[Room]

                let filtered_sections = course_sections.filter((course_section) => department === course_section.department && course_number === course_section.course_number)
                if (filtered_sections.length === 0) continue;

                let sections = filtered_sections.filter((course_section) => course_section.section_number === section_number && course_section.meeting_type === course_type)

                if (sections.length === 0) {
                    // Option 1 - The section does not Exist
                    let section_id = await loader(`
                        INSERT INTO course_section (course_id, section_number)
                        VALUES ($1, $2)
                        RETURNING section_id
                    `,
                    [filtered_sections[0].course_id, section_number])
                    for (let day of weekdays) {
                        modifications.push(new Promise(() => loader(`
                            INSERT INTO section_meeting (section_id, weekday, start_time, end_time, place, course_type)
                            VALUES ($1, $2, $3, $4, $5, $6)
                        `,
                        [section_id, weekday_map[day], start_time, end_time, place, course_type_map[course_type]])))
                    }
                } else {
                    console.log('Option 2')
                    let real_sections = sections.filter((course_section) => )
                    // Option 2 - The section Exists
                        // Suboption a - The section is fine
                        // Suboption b - The section requires an update
                }
            }
            return modifications;
        }).then((modifications) => Promise.all(modifications))
    )


