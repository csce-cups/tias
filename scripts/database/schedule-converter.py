#!/usr/bin/python3

import csv
import sys, getopt
from time import time

def convert_to_subfiles(inputfp: str, coursefp: str, sectionfp: str, meetingfp: str, time_zone: str):
    courses: set[str] = set()
    sections: set[str] = set()
    with open(inputfp) as inputf, open(coursefp, 'w') as coursef, open(sectionfp, 'w') as sectionf, open(meetingfp, 'w') as meetingf:
        coursef.write(f'department,course_number,course_name\n')
        sectionf.write(f'department,course_number,section_number\n')
        meetingf.write(f'department,course_number,section_number,weekday,start_time,end_time,place\n')
        csvreader = csv.DictReader(inputf)
        _headers = csvreader.fieldnames
        for line in csvreader:
            course_section_first_space: int = line['Course/Section'].find(' ')
            course_section_slash: int = line['Course/Section'].find('/')
            course_section_second_space: int = line['Course/Section'].find(' ', course_section_first_space + 1)
            department = line['Course/Section'][:course_section_first_space]
            course_number = line['Course/Section'][course_section_first_space + 1:course_section_slash]
            section_number = line['Course/Section'][course_section_slash + 1:course_section_second_space]
            weekday = line['Days Met']
            start_time = f"{line['Start Time']} {time_zone}"
            end_time = f"{line['End Time']} {time_zone}"
            place = line['Room']
            if f'{department} {course_number}' not in courses:
                coursef.write(f'{department},{course_number},\n')
                courses.add(f'{department} {course_number}')
            if f'{department} {course_number} {section_number}' not in sections:
                sectionf.write(f'{department},{course_number},{section_number}')
                sections.add(f'{department} {course_number} {section_number}')
            for day in weekday:
                if day == 'M':
                    meetingf.write(f'{department},{course_number},{section_number},Monday,{start_time},{end_time},{place}\n')
                elif day == 'T':
                    meetingf.write(f'{department},{course_number},{section_number},Tuesday,{start_time},{end_time},{place}\n')
                elif day == 'W':
                    meetingf.write(f'{department},{course_number},{section_number},Wednesday,{start_time},{end_time},{place}\n')
                elif day == 'R':
                    meetingf.write(f'{department},{course_number},{section_number},Thursday,{start_time},{end_time},{place}\n')
                elif day == 'F':
                    meetingf.write(f'{department},{course_number},{section_number},Friday,{start_time},{end_time},{place}\n')
                elif day == 'S':
                    meetingf.write(f'{department},{course_number},{section_number},Saturday,{start_time},{end_time},{place}\n')
                elif day == 'U':
                    meetingf.write(f'{department},{course_number},{section_number},Sunday,{start_time},{end_time},{place}\n')

def main(argv: list[str]) -> None:
    inputfile: str = ""
    coursefile: str = ""
    sectionfile: str = ""
    meetingfile: str = ""
    time_zone: str
    try:
        opts, args = getopt.getopt(argv[1:], "hi:c:s:m:t:", ["help", "input=", "course=", "section=", "meeting=", "time-zone="])
    except getopt.GetoptError:
        print(f'{argv[0]} -i <inputfile> -c <coursefile> -s <sectionfile> -m <meetingfile>')
        sys.exit(2)
    for opt, arg in opts:
        if opt in ('-h', '--help'):
            print(f'{argv[0]} -i <inputfile> -c <coursefile> -s <sectionfile> -m <meetingfile>')
            sys.exit()
        elif opt in ('-i', '--input'):
            inputfile = arg
        elif opt in ('-c', '--course'):
            coursefile = arg
        elif opt in ('-s', '--section'):
            sectionfile = arg
        elif opt in ('-m', '--meeting'):
            meetingfile = arg
        elif opt in ('-t', '--time-zone'):
            time_zone = arg
    if inputfile.strip() == "":
        print(f'{argv[0]} -i <inputfile> -c <coursefile> -s <sectionfile> -m <meetingfile>')
        print('Error, missing input file.')
        sys.exit(3)
    csvindex: int = inputfile.rfind(".csv")
    if coursefile.strip() == "":
        coursefile = inputfile[:csvindex] + '-course' + inputfile[csvindex:]
    if sectionfile.strip() == "":
        sectionfile = inputfile[:csvindex] + '-section' + inputfile[csvindex:]
    if meetingfile.strip() == "":
        meetingfile = inputfile[:csvindex] + '-meeting' + inputfile[csvindex:]
    convert_to_subfiles(inputfile, coursefile, sectionfile, meetingfile, time_zone)

if __name__ == "__main__":
    main(sys.argv)
