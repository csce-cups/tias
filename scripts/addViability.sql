CREATE VIEW Viability
 AS
 SELECT DISTINCT person_unavailability.person_id,
    course.course_id,
    course.department,
    course.course_number,
    course.course_name,
    course_section.section_id,
    course_section.section_number,
    course_section.placeholder_professor_name,
    section_assignment_preference.preference,
    section_meeting.weekday,
    section_meeting.start_time,
    section_meeting.end_time,
    section_meeting.place,
    section_meeting.end_time - section_meeting.start_time AS duration
   FROM person_unavailability
     JOIN section_meeting ON section_meeting.meeting_type = 'Laboratory'::meeting_type AND (( SELECT count(*) AS count
           FROM person_unavailability pb
          WHERE pb.person_id = person_unavailability.person_id AND pb.weekday = section_meeting.weekday AND NOT (pb.end_time < section_meeting.start_time OR pb.start_time > section_meeting.end_time))) = 0
     JOIN course_section ON course_section.section_id = section_meeting.section_id
     JOIN qualification ON qualification.qualified = true AND qualification.person_id = person_unavailability.person_id AND qualification.course_id = course_section.course_id
     JOIN course ON course.course_id = qualification.course_id
     LEFT JOIN section_assignment_preference ON section_assignment_preference.person_id = person_unavailability.person_id AND section_assignment_preference.section_id = section_meeting.section_id
  ORDER BY section_meeting.weekday, section_meeting.start_time, (section_meeting.end_time - section_meeting.start_time), course.department, course.course_number, course_section.section_number, person_unavailability.person_id;
