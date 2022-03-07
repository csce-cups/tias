DROP TYPE IF EXISTS preference CASCADE;
CREATE TYPE preference AS ENUM
    ('Can''t Do', 'Prefer Not To Do', 'Indifferent', 'Prefer To Do');

DROP TYPE IF EXISTS request_status CASCADE;
CREATE TYPE request_status AS ENUM
    ('Pending', 'Accepted', 'Rejected');

DROP TYPE IF EXISTS weekday CASCADE;
CREATE TYPE weekday AS ENUM
    ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

DROP TYPE IF EXISTS meeting_type CASCADE;
CREATE TYPE meeting_type AS ENUM
    ('Laboratory', 'Lecture', 'Examination', 'Seminar', 'Recitation', 'Research', 'Practicum', 'Independent Study', 'Internship', 'Competition', 'Private Lesson', 'Clinic');

DROP TABLE IF EXISTS person CASCADE;
CREATE TABLE person (
	person_id SERIAL PRIMARY KEY,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	peer_teacher BOOLEAN,
	teaching_assistant BOOLEAN,
	administrator BOOLEAN,
	professor BOOLEAN
);

DROP TABLE IF EXISTS person_availability CASCADE;
CREATE TABLE person_availability (
	person_id INTEGER REFERENCES person(person_id),
	weekday WEEKDAY,
	start_time TIME,
	end_time TIME,
	PRIMARY KEY(person_id, weekday, start_time, end_time)
);

DROP TABLE IF EXISTS office_hours CASCADE;
CREATE TABLE office_hours (
	person_id INTEGER REFERENCES person(person_id),
	weekday WEEKDAY,
	start_time TIME,
	end_time TIME,
	place VARCHAR,
	PRIMARY KEY(person_id, weekday, start_time, end_time)
);

DROP TABLE IF EXISTS professor_staff CASCADE;
CREATE TABLE professor_staff (
	person_id_professor INTEGER REFERENCES person(person_id),
	person_id_teaching_assistant INTEGER REFERENCES person(person_id),
	PRIMARY KEY(person_id_professor, person_id_teaching_assistant)
);

DROP TABLE IF EXISTS course CASCADE;
CREATE TABLE course (
	course_id SERIAL PRIMARY KEY,
	department VARCHAR(4) NOT NULL,
	course_number VARCHAR(5) NOT NULL,
	course_name VARCHAR
);

DROP TABLE IF EXISTS qualification CASCADE;
CREATE TABLE qualification (
	person_id INTEGER REFERENCES person(person_id),
	course_id INTEGER REFERENCES course(course_id),
	grade CHAR NOT NULL DEFAULT 'X',
	PRIMARY KEY(person_id, course_id)
);

DROP TABLE IF EXISTS course_section CASCADE;
CREATE TABLE course_section (
	section_id SERIAL PRIMARY KEY,
	course_id INTEGER REFERENCES course(course_id) NOT NULL,
    person_id_professor INTEGER REFERENCES course(course_id),
	section_number CHAR(3) NOT NULL,
    peer_teachable BOOLEAN
);

DROP TABLE IF EXISTS section_meeting CASCADE;
CREATE TABLE section_meeting (
	section_id INTEGER REFERENCES course_section(section_id),
	weekday WEEKDAY,
	start_time TIME,
	end_time TIME,
	place VARCHAR,
    meeting_type MEETING_TYPE,
	PRIMARY KEY(section_id, weekday, start_time, end_time)
);

DROP TABLE IF EXISTS section_assignment_preference CASCADE;
CREATE TABLE section_assignment_preference (
	person_id INTEGER REFERENCES person(person_id),
	section_id INTEGER REFERENCES course_section(section_id),
	preference PREFERENCE NOT NULL DEFAULT 'Indifferent',
	PRIMARY KEY(person_id, section_id)
);

DROP TABLE IF EXISTS section_assignment CASCADE;
CREATE TABLE section_assignment (
	person_id INTEGER REFERENCES person(person_id),
	section_id INTEGER REFERENCES course_section(section_id),
	PRIMARY KEY(person_id, section_id)
);

DROP TABLE IF EXISTS trade_request CASCADE;
CREATE TABLE trade_request (
	person_id_sender INTEGER REFERENCES person(person_id),
	section_id_sender INTEGER REFERENCES course_section(section_id),
	person_id_receiver INTEGER REFERENCES person(person_id),
	section_id_receiver INTEGER REFERENCES course_section(section_id),
	request_status REQUEST_STATUS NOT NULL DEFAULT 'Pending',
	PRIMARY KEY(person_id_sender, section_id_sender, person_id_receiver, section_id_receiver)
);

INSERT INTO course (department, course_number, course_name)
VALUES
('CSCE', '110', 'Programming I'),
('CSCE', '111', 'Introduction to Computer Science Concepts and Programming'),
('CSCE', '120', 'Program Design and Concepts'),
('CSCE', '121', 'Introduction to Program Design and Concepts'),
('CSCE', '206', 'Structured Programming in C'),
('CSCE', '221', 'Data Structures and Algorithms'),
('CSCE', '222', 'Discrete Structures for Computing'),
('CSCE', '312', 'Computer Organization'),
('CSCE', '313', 'Introduction to Computer Systems'),
('CSCE', '314', 'Programming Languages'),
('CSCE', '315', 'Programming Studio'),
('CSCE', '331', 'Foundations of Software Engineering');