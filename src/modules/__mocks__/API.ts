import { APIAlgoResponse, APIStudentUnavailability, APIUserPreferenceEnum, APIUserPreferences, APIUserQualification, Course, CourseBlock, CourseBlockWeek, CourseBlockWeekKey, EditableSection, Meeting, Person, Person_INIT, Submission, TradeRequest } from '../API';

export const parseCookie: any = () => ({tias_user_id: '1'});

const generateBlock = (course: number, section: string, start: Date, end: Date, day: string, place: string, id: number): CourseBlock => ({
	department: "CSCE",
	course_number: course,
	section_number: section,
	start_time: start,
	section_id: id,
	end_time: end,
	weekday: day,
	place: place,
	scheduled: null,
	professor: ""
});

class API {
	private static promiseVoid = (instant?: boolean): Promise<void> => new Promise(res => {
		// console.error("API send call not mocked, promiseVoid called");
		setTimeout(() => res(), instant ? 0 : 100)
	});

	static fetchAllStatic = (instant?: boolean) => {
		// console.log("MOCK API: fetchAllStatic");
		return {
			employees: API.fetchPTList(instant),
			blocks: API.fetchCourseBlocks(instant)
		}
	}

	static fetchAllUser = (user_id: number | undefined) => {
		// console.log("MOCK API: fetchAllUser");
		return {
			userQuals: API.fetchUserQualifications(user_id),
			userPrefs: API.fetchUserPreferences(user_id),
			userViableCourses: API.fetchUserViableCourses(user_id)
		}
	}

	static fetchPTList = async (instant?: boolean): Promise<Person[]> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchPTList()) }, instant? 0 : 100));
	}

	static fetchEveryone = async (instant?: boolean): Promise<Person[]> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchEveryone()) }, instant? 0 : 100));
	}

	static fetchCourseBlocks = async (instant?: boolean): Promise<CourseBlockWeek> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchCourseBlocks()) }, instant? 0 : 100));
	}

	static fetchUserPreferences = async (user_id?: number, instant?: boolean): Promise<APIUserPreferences> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchUserPreferences()) }, instant? 0 : 100));
	}

	static fetchUserViableCourses = async (user_id?: number, instant?: boolean): Promise<CourseBlockWeek> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchUserViableCourses()) }, instant? 0 : 100));
	}

	static fetchAllViableCourses = async (instant?: boolean): Promise<Map<number, CourseBlockWeek>> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchAllViableCourses()) }, instant? 0 : 100));
	}

	static fetchUserTrades = async (user_id?: number, instant?: boolean): Promise<TradeRequest[]> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchUserTrades()) }, instant? 0 : 100));
	}

	// static fetchExportedSchedule = async (): Promise<ExportedSchedule> => {} // TODO: implement

	static runScheduler = async (peer_teachers: number[], instant?: boolean): Promise<APIAlgoResponse> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.runScheduler(peer_teachers)) }, instant? 0 : 100));
	}

	static fetchUserQualifications = async (user_id?: number, instant?: boolean): Promise<APIUserQualification[]> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.fetchUserQualifications()) }, instant? 0 : 100));
	}

	static getSavedSchedule = async (instant?: boolean): Promise<Map<string, number[]>> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.getSavedSchedule()) }, instant? 0 : 100));
	}

	static getCourses = async (instant?: boolean): Promise<Course[]> => {
		return new Promise(r => setTimeout(() => { r(APINoAsync.getCourses()) }, instant? 0 : 100));
	}

	static sendUserPreferences = async (user_id: number | undefined, prefs: Map<number, APIUserPreferenceEnum>, pref_num?: number, instant?: boolean): Promise<void> => this.promiseVoid(instant)
	static submitTrade = async (data: Submission, userId: number | undefined, instant?: boolean): Promise<any> => this.promiseVoid(instant);
	static updateTrade = async (data: TradeRequest, userId: number | undefined, instant?: boolean): Promise<void> => this.promiseVoid(instant);
	static sendSavedSchedule = async (scheduled: Map<string, number[]>, instant?: boolean): Promise<void> => this.promiseVoid(instant);
	static saveUserUnavailability = async (uid: number | undefined, user_unavailability_arr: APIStudentUnavailability[], instant?: boolean) => this.promiseVoid(instant);
	static sendNewMeetings = async (meetings: Meeting[], instant?: boolean) => this.promiseVoid(instant);
	static updateUser = async (user: Person, instant?: boolean) => this.promiseVoid(instant);
	static registerNewUser = async (user_init: Person_INIT, instant?: boolean) => this.promiseVoid(instant);
	static deleteUser = async (uid: number, instant?: boolean) => this.promiseVoid(instant);
	static addCourse = async (course: Course, instant?: boolean) => this.promiseVoid(instant)
	static deleteCourse = async (course_id: number, instant?: boolean) => this.promiseVoid(instant)
	static updateSections = async (sections: EditableSection[], instant?: boolean) => this.promiseVoid(instant)
}

export class APINoAsync {
	static fetchAllStatic = () => {
		// console.log("MOCK API: fetchAllStatic");
		return {
			employees: APINoAsync.fetchPTList(),
			blocks: APINoAsync.fetchCourseBlocks()
		}
	}

	static fetchAllUser = (user_id: number | undefined) => {
		// console.log("MOCK API: fetchAllUser");
		return {
			userQuals: APINoAsync.fetchUserQualifications(),
			userPrefs: APINoAsync.fetchUserPreferences(user_id),
			userViableCourses: APINoAsync.fetchUserViableCourses(user_id)
		}
	}

	static fetchPTList = (): Person[] => {
		// console.log("MOCK API: static");
		return this.fetchEveryone().filter(p => p.peer_teacher);
	}

	static fetchEveryone = (): Person[] => {
		return Array.from(Array(30).keys()).map(i => `Test User ${i}`)
			.map((e, i) => ({
				person_id: i, 
				email: "",
				first_name: e.substring(0, e.indexOf(' ')), 
				last_name: e.substring(e.indexOf(' ')),
				profile_photo_url: "",
				peer_teacher: i % 5 !== 0,
				teaching_assistant: false,
				administrator: i === 5,
				professor: false,
				isScheduled: null,
				isChecked: i % 4 !== 1,
				desired_number_assignments: 2
			}))
	}

	static fetchCourseBlocks = (): CourseBlockWeek => {
		// console.log("MOCK API: static");
		const buildings = ["BUILDING A", "BUILDING B", "BUILDING C", "BUILDING D", "BUILDING E"];
		const courses = [110, 111, 121, 221, 312, 313, 314, 315];
		const modi = {
			"Monday": 1,
			"Tuesday": 2,
			"Wednesday": 1,
			"Thursday": 2,
			"Friday": 3,
		}
		const genDay = (length: number, day: CourseBlockWeekKey) => {
			let ret: CourseBlock[] = [];
			let startTime = new Date(8*60*60*1000);
			Array.from(Array(Math.floor(Math.random() * 60 + 20)).keys()).forEach(i => {
				if (Math.random() > 0.7) {
					ret.push(
						generateBlock(
							courses[Math.floor(Math.random() * courses.length)],
							`${modi[day]*100 + i}`,
							startTime,
							new Date(startTime.getTime() + (length * 60 * 1000)),
							day,
							buildings[Math.floor(Math.random() * buildings.length)],
							modi[day]*100 + i
						)
					)
					if (Math.random() > 0.7) {
						let newStartTime = new Date(startTime.getTime() + length*60*1000 + 20*60*1000);
						if (newStartTime.getTime() < 12*60*60*1000) startTime = newStartTime
					}
				}
			})
			return ret;
		}
		return {
			Monday: genDay(50, "Monday"),
			Tuesday: genDay(75, "Tuesday"),
			Wednesday: genDay(50, "Wednesday"),
			Thursday: genDay(75, "Thursday"),
			Friday: genDay(50, "Friday")
		}
	}

	static fetchUserPreferences = (user_id?: number, ): APIUserPreferences => {

		const pref = () => {
			const r = Math.random();
			if (r < 0.2) return "Can't Do";
			if (r < 0.4) return "Prefer Not To Do";
			if (r < 0.8) return "Indifferent";
			else return "Prefer To Do";
		}
		const blocks = APINoAsync.fetchCourseBlocks()
		const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday];
		let resp = new Map<number, APIUserPreferenceEnum>();

		allBlocks.forEach(day => {
			day?.forEach(block => {
				resp.set(block.section_id, pref());
			});
		});

		return resp;
	}

	static fetchUserViableCourses = (user_id?: number, ): CourseBlockWeek => {
		const week = APINoAsync.fetchCourseBlocks()
		return {
			Monday: week?.Monday?.filter(() => Math.random() > 0.5) || null,
			Tuesday: week?.Tuesday?.filter(() => Math.random() > 0.5) || null,
			Wednesday: week?.Wednesday?.filter(() => Math.random() > 0.5) || null,
			Thursday: week?.Thursday?.filter(() => Math.random() > 0.5) || null,
			Friday: week?.Friday?.filter(() => Math.random() > 0.5) || null
		}
	}

	static fetchAllViableCourses = (): Map<number, CourseBlockWeek> => {
		const blocks = APINoAsync.fetchCourseBlocks();
		return new Map<number, CourseBlockWeek>(
			Array.from(Array(30).keys()).map(i => [i, {
				Monday: blocks.Monday?.filter(b => Math.random() > 0.4),
				Tuesday: blocks.Tuesday?.filter(b => Math.random() > 0.4),
				Wednesday: blocks.Wednesday?.filter(b => Math.random() > 0.4),
				Thursday: blocks.Thursday?.filter(b => Math.random() > 0.4),
				Friday: blocks.Friday?.filter(b => Math.random() > 0.4)
			}] as [number, CourseBlockWeek]))
	}

	static fetchUserTrades = (user_id?: number, ): TradeRequest[] => {
		const PTids = this.fetchPTList().map(p => p.person_id);
		return Array.from(Array(20).keys()).map(i => (
			{
				person_id_sender: (i % 2)? PTids[Math.floor(Math.random() * PTids.length)] : user_id,
				person_id_receiver: (!(i % 2))? PTids[Math.floor(Math.random() * PTids.length)] : user_id,
				section_id_receiver: Math.floor(Math.random() * 20),
				section_id_sender: Math.floor(Math.random() * 20),
				request_status: ["Rejected", "Accepted", "Pending", "Cancelled"][Math.floor(Math.random() * 4)]
			} as TradeRequest))
	}

	// static fetchExportedSchedule = (): ExportedSchedule> => {} // TODO: impement

	static runScheduler = (peer_teachers: number[], ): APIAlgoResponse => {
		let resp = JSON.parse(`{"scheduled": {"1":[1],"2":[1, 2],"3":[2]}, "unscheduled": [3]}`)
		let map = new Map<string, number[]>();
		Object.keys(resp.scheduled).map(key => map.set(key, resp.scheduled[key]));
		resp.scheduled = map;
		return resp;
	}

	static fetchUserQualifications = (): APIUserQualification[] => {
		return this.getCourses().map(course => ({
			course_id: course.course_id,
			course_number: course.course_number,
			qualified: Math.random() > 0.5
		}))
	}

	static getSavedSchedule = (): Map<string, number[]> => {
		// console.log("MOCK API: getSavedSchedule");
		return APINoAsync.runScheduler([]).scheduled;
	}

	static getCourses = (): Course[] => {
		return [110, 111, 121, 221, 312, 313, 314, 315].map((cn, i) => ({
			course_id: i,
			course_number: cn.toString(),
			course_name: `Course ${cn}`,
			department: "CSCE"
		}))
	}

	static sendUserPreferences = (user_id: number | undefined, prefs: Map<number, APIUserPreferenceEnum>, pref_num?: number) => {}
	static submitTrade = (data: Submission, userId: number | undefined) => {};
	static updateTrade = (data: TradeRequest, userId: number | undefined) => {};
	static sendSavedSchedule = (scheduled: Map<string, number[]>) => {};
	static saveUserUnavailability = (uid: number | undefined, user_unavailability_arr: APIStudentUnavailability[]) => {};
	static sendNewMeetings = (meetings: Meeting[]) => {};
	static updateUser = (user: Person) => {};
	static registerNewUser = (user_init: Person_INIT) => {};
	static deleteUser = (uid: number) => {};
	static addCourse = (course: Course) => {}
	static deleteCourse = (course_id: number) => {}
	static updateSections = (sections: EditableSection[]) => {}
}

export default API;