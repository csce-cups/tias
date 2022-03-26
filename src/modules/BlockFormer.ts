import { APICourseBlock } from './API'

const start = 1000 * 60 * 60 * 10;
const timezone_offset = 6;
export const createDate = (datestring: string): Date => {
    let d = new Date(0);
    d.setHours(timezone_offset + parseInt(datestring.substring(0, 2))); // First two digits are the hours
    d.setMinutes(parseInt(datestring.substring(3, 5))); // Next two digits are the minutes
    return d;
}

class BlockFormer {
    static MW_classlength = 50;
    static TH_classlength = 75;
    static breaklength = 20;

    static generateBlock = (course: number, section: number, start: Date, end: Date, day: string, place: string): APICourseBlock => ({
        department: "CSCE",
        course_number: course,
        section_number: section,
        start_time: start,
        end_time: end,
        weekday: day,
        place: place
    })

    static starts = {
        MW_A: new Date(-start),
        MW_B: new Date(-start + 1000 * 60 * 1 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),
        MW_C: new Date(-start + 1000 * 60 * 2 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),

        MW_A2: new Date(-start + 1000 * 60 * 3 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),
        MW_B2: new Date(-start + 1000 * 60 * 4 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),
        MW_C2: new Date(-start + 1000 * 60 * 5 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),

        MW_A3: new Date(-start + 1000 * 60 * 6 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),
        MW_B3: new Date(-start + 1000 * 60 * 7 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),
        MW_C3: new Date(-start + 1000 * 60 * 8 * (BlockFormer.MW_classlength + BlockFormer.breaklength)),

        TH_A: new Date(-start),
        TH_B: new Date(-start + 1000 * 60 * 1 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),
        TH_C: new Date(-start + 1000 * 60 * 2 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),

        TH_A2: new Date(-start + 1000 * 60 * 3 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),
        TH_B2: new Date(-start + 1000 * 60 * 4 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),
        TH_C2: new Date(-start + 1000 * 60 * 5 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),

        TH_A3: new Date(-start + 1000 * 60 * 6 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),
        TH_B3: new Date(-start + 1000 * 60 * 7 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),
        TH_C3: new Date(-start + 1000 * 60 * 8 * (BlockFormer.TH_classlength + BlockFormer.breaklength)),
    }

    static setTimes = {
        MW_A_short: new Date(BlockFormer.starts.MW_A.getTime() + 1000 * 60 * BlockFormer.MW_classlength),
        MW_A_long: new Date(BlockFormer.starts.MW_A.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 2 + BlockFormer.breaklength)),
        MW_A_extralong: new Date(BlockFormer.starts.MW_A.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 3 + BlockFormer.breaklength * 2)),

        MW_B_short: new Date(BlockFormer.starts.MW_B.getTime() + 1000 * 60 * BlockFormer.MW_classlength),
        MW_B_long: new Date(BlockFormer.starts.MW_B.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 2 + BlockFormer.breaklength)),

        MW_C_short: new Date(BlockFormer.starts.MW_C.getTime() + 1000 * 60 * BlockFormer.MW_classlength),

        MW_A2_short: new Date(BlockFormer.starts.MW_A2.getTime() + 1000 * 60 * BlockFormer.MW_classlength),
        MW_A2_long: new Date(BlockFormer.starts.MW_A2.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 2 + BlockFormer.breaklength)),
        MW_A2_extralong: new Date(BlockFormer.starts.MW_A2.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 3 + BlockFormer.breaklength * 2)),

        MW_B2_short: new Date(BlockFormer.starts.MW_B2.getTime() + 1000 * 60 * BlockFormer.MW_classlength),
        MW_B2_long: new Date(BlockFormer.starts.MW_B2.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 2 + BlockFormer.breaklength)),

        MW_C2_short: new Date(BlockFormer.starts.MW_C2.getTime() + 1000 * 60 * BlockFormer.MW_classlength),

        MW_A3_short: new Date(BlockFormer.starts.MW_A3.getTime() + 1000 * 60 * BlockFormer.MW_classlength),
        MW_A3_long: new Date(BlockFormer.starts.MW_A3.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 2 + BlockFormer.breaklength)),
        MW_A3_extralong: new Date(BlockFormer.starts.MW_A3.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 3 + BlockFormer.breaklength * 2)),

        MW_B3_short: new Date(BlockFormer.starts.MW_B3.getTime() + 1000 * 60 * BlockFormer.MW_classlength),
        MW_B3_long: new Date(BlockFormer.starts.MW_B3.getTime() + 1000 * 60 * (BlockFormer.MW_classlength * 2 + BlockFormer.breaklength)),

        MW_C3_short: new Date(BlockFormer.starts.MW_C3.getTime() + 1000 * 60 * BlockFormer.MW_classlength),


        TH_A_short: new Date(BlockFormer.starts.TH_A.getTime() + 1000 * 60 * BlockFormer.TH_classlength),
        TH_A_long: new Date(BlockFormer.starts.TH_A.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 2 + BlockFormer.breaklength)),
        TH_A_extralong: new Date(BlockFormer.starts.TH_A.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 3 + BlockFormer.breaklength * 2)),

        TH_B_short: new Date(BlockFormer.starts.TH_B.getTime() + 1000 * 60 * BlockFormer.TH_classlength),
        TH_B_long: new Date(BlockFormer.starts.TH_B.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 2 + BlockFormer.breaklength)),

        TH_C_short: new Date(BlockFormer.starts.TH_C.getTime() + 1000 * 60 * BlockFormer.TH_classlength),

        TH_A2_short: new Date(BlockFormer.starts.TH_A2.getTime() + 1000 * 60 * BlockFormer.TH_classlength),
        TH_A2_long: new Date(BlockFormer.starts.TH_A2.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 2 + BlockFormer.breaklength)),
        TH_A2_extralong: new Date(BlockFormer.starts.TH_A2.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 3 + BlockFormer.breaklength * 2)),

        TH_B2_short: new Date(BlockFormer.starts.TH_B2.getTime() + 1000 * 60 * BlockFormer.TH_classlength),
        TH_B2_long: new Date(BlockFormer.starts.TH_B2.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 2 + BlockFormer.breaklength)),

        TH_C2_short: new Date(BlockFormer.starts.TH_C2.getTime() + 1000 * 60 * BlockFormer.TH_classlength),

        TH_A3_short: new Date(BlockFormer.starts.TH_A3.getTime() + 1000 * 60 * BlockFormer.TH_classlength),
        TH_A3_long: new Date(BlockFormer.starts.TH_A3.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 2 + BlockFormer.breaklength)),
        TH_A3_extralong: new Date(BlockFormer.starts.TH_A3.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 3 + BlockFormer.breaklength * 2)),

        TH_B3_short: new Date(BlockFormer.starts.TH_B3.getTime() + 1000 * 60 * BlockFormer.TH_classlength),
        TH_B3_long: new Date(BlockFormer.starts.TH_B3.getTime() + 1000 * 60 * (BlockFormer.TH_classlength * 2 + BlockFormer.breaklength)),

        TH_C3_short: new Date(BlockFormer.starts.TH_C3.getTime() + 1000 * 60 * BlockFormer.TH_classlength),
    }

    static samples = {
        Empty_schedule: [],
        Test_schedule: [
            BlockFormer.generateBlock(121, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(121, 106, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(121, 107, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),

            BlockFormer.generateBlock(221, 102, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "none", "nowhere"),
            BlockFormer.generateBlock(313, 103, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "none", "nowhere"),

            BlockFormer.generateBlock(315, 104, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_B_short, "none", "nowhere"),

            {
                department: "CSCE",
                course_number: 121,
                section_number: 500,
                start_time: BlockFormer.starts.MW_A2,
                end_time: BlockFormer.setTimes.MW_A2_short,
                weekday: "none",
                place: "nowhere"
            },

            {
                department: "CSCE",
                course_number: 221,
                section_number: 501,
                start_time: new Date(BlockFormer.starts.MW_A2.getTime() + 5 * 60 * 1000),
                end_time: new Date(BlockFormer.setTimes.MW_A2_short.getTime() + 5 * 60 * 1000),
                weekday: "none",
                place: "nowhere"
            },

            BlockFormer.generateBlock(315, 104, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_extralong, "none", "nowhere"),
        ],
        Test_schedule2: [
            // { department: "CSCE", course_number: 313, section_number: 200, start_time: createDate("02:00:00"), end_time: createDate("04:00:00"), weekday: "Friday", place: "ZACH 590" },
            // { department: "CSCE", course_number: 314, section_number: 501, start_time: createDate("03:10:00"), end_time: createDate("04:00:00"), weekday: "Friday", place: "HRBB 124" },
            // { department: "CSCE", course_number: 121, section_number: 502, start_time: createDate("04:20:00"), end_time: createDate("05:10:00"), weekday: "Friday", place: "HRBB 124" },
            // { department: "CSCE", course_number: 221, section_number: 597, start_time: createDate("04:20:00"), end_time: createDate("06:00:00"), weekday: "Friday", place: "ZACH 590" },
            // { department: "CSCE", course_number: 221, section_number: 598, start_time: createDate("04:20:00"), end_time: createDate("06:00:00"), weekday: "Friday", place: "ZACH 590" },
            // { department: "CSCE", course_number: 313, section_number: 203, start_time: createDate("05:30:00"), end_time: createDate("06:20:00"), weekday: "Friday", place: "ZACH 350" },
            // { department: "CSCE", course_number: 315, section_number: 503, start_time: createDate("05:30:00"), end_time: createDate("06:20:00"), weekday: "Friday", place: "ZACH 350" },

            // { department: "CSCE", course_number: 222, section_number: 502, start_time: createDate("07:20:00"), end_time: createDate("08:10:00"), weekday: "Friday", place: "HRBB 124" },
            { department: "CSCE", course_number: 312, section_number: 597, start_time: createDate("07:20:00"), end_time: createDate("09:00:00"), weekday: "Friday", place: "ZACH 590" },
            { department: "CSCE", course_number: 221, section_number: 203, start_time: createDate("08:30:00"), end_time: createDate("09:20:00"), weekday: "Friday", place: "ZACH 350" },
            // { department: "CSCE", course_number: 315, section_number: 503, start_time: createDate("08:30:00"), end_time: createDate("09:20:00"), weekday: "Friday", place: "ZACH 350" },
            { department: "CSCE", course_number: 314, section_number: 500, start_time: createDate("06:40:00"), end_time: createDate("07:30:00"), weekday: "Friday", place: "HRBB 124" },
            // { department: "CSCE", course_number: 221, section_number: 200, start_time: createDate("06:40:00"), end_time: createDate("08:20:00"), weekday: "Friday", place: "EABA 118" },
            // { department: "CSCE", course_number: 313, section_number: 598, start_time: createDate("06:40:00"), end_time: createDate("08:20:00"), weekday: "Friday", place: "ZACH 590" },
            // { department: "CSCE", course_number: 206, section_number: 600, start_time: createDate("07:50:00"), end_time: createDate("08:40:00"), weekday: "Friday", place: "HECM 115" },
            // { department: "CSCE", course_number: 222, section_number: 501, start_time: createDate("07:50:00"), end_time: createDate("08:40:00"), weekday: "Friday", place: "ZACH 350" },
            // { department: "CSCE", course_number: 222, section_number: 599, start_time: createDate("07:50:00"), end_time: createDate("08:40:00"), weekday: "Friday", place: "ONLINE ONLINE" },
            // { department: "CSCE", course_number: 222, section_number: 502, start_time: createDate("09:00:00"), end_time: createDate("09:50:00"), weekday: "Friday", place: "ZACH 350" },
            // { department: "CSCE", course_number: 313, section_number: 599, start_time: createDate("09:00:00"), end_time: createDate("10:40:00"), weekday: "Friday", place: "ZACH 590" }
        ],
        Test_schedule3: [
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(222, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(312, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(314, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(315, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
        ],
        Test_schedule4: [
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "none", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, "none", "nowhere"),
        ],
        M_schedule: [
            // MONDAYS //
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Monday", "nowhere"),

            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Monday", "nowhere"),

            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Monday", "nowhere"),


            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Monday", "nowhere"),

            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(315, 100, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Monday", "nowhere"),

            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Monday", "nowhere"),


            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Monday", "nowhere"),

            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Monday", "nowhere"),

            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(121, 100, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(221, 100, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Monday", "nowhere"),
            BlockFormer.generateBlock(313, 100, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Monday", "nowhere")
        ].map((e, i) => {
            e.section_number = 100 + i;
            return e;
        }),

        TH_schedule: [
            BlockFormer.generateBlock(121, 101, BlockFormer.starts.TH_A, BlockFormer.setTimes.TH_A_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(121, 101, BlockFormer.starts.TH_A, BlockFormer.setTimes.TH_A_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(121, 101, BlockFormer.starts.TH_A, BlockFormer.setTimes.TH_A_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 101, BlockFormer.starts.TH_A, BlockFormer.setTimes.TH_A_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 101, BlockFormer.starts.TH_A, BlockFormer.setTimes.TH_A_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(313, 101, BlockFormer.starts.TH_A, BlockFormer.setTimes.TH_A_short, "Tuesday/Thursday", "nowhere"),

            BlockFormer.generateBlock(121, 102, BlockFormer.starts.TH_B, BlockFormer.setTimes.TH_B_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(121, 102, BlockFormer.starts.TH_B, BlockFormer.setTimes.TH_B_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(121, 102, BlockFormer.starts.TH_B, BlockFormer.setTimes.TH_B_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 102, BlockFormer.starts.TH_B, BlockFormer.setTimes.TH_B_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 102, BlockFormer.starts.TH_B, BlockFormer.setTimes.TH_B_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(313, 102, BlockFormer.starts.TH_B, BlockFormer.setTimes.TH_B_short, "Tuesday/Thursday", "nowhere"),

            BlockFormer.generateBlock(121, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(121, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(121, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(313, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(313, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(313, 103, BlockFormer.starts.TH_C, BlockFormer.setTimes.TH_C_short, "Tuesday/Thursday", "nowhere"),

            BlockFormer.generateBlock(121, 104, BlockFormer.starts.TH_B2, BlockFormer.setTimes.TH_B2_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 104, BlockFormer.starts.TH_B2, BlockFormer.setTimes.TH_B2_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(313, 104, BlockFormer.starts.TH_B2, BlockFormer.setTimes.TH_B2_short, "Tuesday/Thursday", "nowhere"),

            BlockFormer.generateBlock(121, 105, BlockFormer.starts.TH_C2, BlockFormer.setTimes.TH_C2_short, "Tuesday/Thursday", "nowhere"),
            BlockFormer.generateBlock(221, 105, BlockFormer.starts.TH_C2, BlockFormer.setTimes.TH_C2_short, "Tuesday/Thursday", "nowhere"),

            BlockFormer.generateBlock(121, 106, BlockFormer.starts.TH_A3, BlockFormer.setTimes.TH_A3_short, "Tuesday/Thursday", "nowhere")
        ].map((e, i) => {
            e.section_number = 100 + i;
            return e;
        }),

        W_schedule: [
            BlockFormer.generateBlock(121, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(121, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(314, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(222, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 102, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(222, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(314, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(222, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(121, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 103, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(121, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(222, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(222, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(314, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(314, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(314, 104, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(312, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 105, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(121, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(121, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 106, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(121, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 107, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 108, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 108, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 108, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Wednesday", "nowhere"),

            BlockFormer.generateBlock(121, 108, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(121, 108, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 108, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(221, 108, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(313, 108, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Wednesday", "nowhere"),
            BlockFormer.generateBlock(315, 108, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Wednesday", "nowhere")
        ].map((e, i) => {
            e.section_number = 100 + i;
            return e;
        }),

        F_schedule: [
            BlockFormer.generateBlock(121, 101, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_extralong, "Friday", "nowhere"),
            BlockFormer.generateBlock(121, 102, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(121, 103, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 104, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 105, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(313, 106, BlockFormer.starts.MW_A, BlockFormer.setTimes.MW_A_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 107, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(313, 108, BlockFormer.starts.MW_B, BlockFormer.setTimes.MW_B_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(121, 109, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 110, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(313, 111, BlockFormer.starts.MW_C, BlockFormer.setTimes.MW_C_short, "Friday", "nowhere"),

            BlockFormer.generateBlock(121, 112, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, "Friday", "nowhere"),
            BlockFormer.generateBlock(121, 113, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 114, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, "Friday", "nowhere"),
            BlockFormer.generateBlock(313, 115, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(313, 116, BlockFormer.starts.MW_B2, BlockFormer.setTimes.MW_B2_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 117, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(315, 118, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_extralong, "Friday", "nowhere"),
            BlockFormer.generateBlock(315, 119, BlockFormer.starts.MW_A2, BlockFormer.setTimes.MW_A2_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(315, 120, BlockFormer.starts.MW_C2, BlockFormer.setTimes.MW_C2_short, "Friday", "nowhere"),

            BlockFormer.generateBlock(121, 121, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(121, 122, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(121, 123, BlockFormer.starts.MW_B3, BlockFormer.setTimes.MW_B3_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 124, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_extralong, "Friday", "nowhere"),
            BlockFormer.generateBlock(221, 125, BlockFormer.starts.MW_C3, BlockFormer.setTimes.MW_C3_short, "Friday", "nowhere"),
            BlockFormer.generateBlock(313, 126, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_extralong, "Friday", "nowhere"),
            BlockFormer.generateBlock(315, 127, BlockFormer.starts.MW_A3, BlockFormer.setTimes.MW_A3_extralong, "Friday", "nowhere")
        ].map((e, i) => {
            e.section_number = 100 + i;
            return e;
        }),
    }
}

export default BlockFormer;