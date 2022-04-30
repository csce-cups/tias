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
	professor: "",
	capacity_peer_teachers: 1,
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

	static fetchExportedSchedule = async (instant?: boolean): Promise<Object> => new Promise(r => setTimeout(() => { r(APINoAsync.fetchExportedSchedule()) }, instant? 0 : 100));
	static sendUserQualifications = async (qualObj: any, user_id?: number): Promise<any> => new Promise(resolve => resolve({}));
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

const users = 50;
let lastGeneratedEveryone: Person[] = [];
let lastGeneratedCourseBlocks: CourseBlockWeek = {
	Monday: [],
	Tuesday: [],
	Wednesday: [],
	Thursday: [],
	Friday: []
}
let allViable: Map<number, CourseBlockWeek>;
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
		if (lastGeneratedEveryone.length !== 0) return lastGeneratedEveryone;

		const names = "abcdefghijklmnopqrstuvwxyz".split("").map((c, i, arr) => {
			const char1 = c.toUpperCase();
			const char2 = arr[arr.length - i - 1].toUpperCase();
			return `${char1}-Test ${char2}-User ${i}`;
		});

		lastGeneratedEveryone = names.map((e, i) => ({
			person_id: i, 
			email: e.replace(/ /g, '_').toLowerCase() + '@tamu.edu',
			first_name: e.substring(0, e.indexOf(' ')), 
			last_name: e.substring(e.indexOf(' ') + 1),
			profile_photo_url: "",
			peer_teacher: i % 7 !== 0,
			teaching_assistant: i % 12 === 0,
			administrator: i === 5 || i === 14,
			professor: i === 10 || i === 11 || i === 12,
			isScheduled: null,
			isChecked: i % 4 !== 1,
			desired_number_assignments: 2
		}))

		return lastGeneratedEveryone;
	}

	static fetchCourseBlocks = (): CourseBlockWeek => {
		if (!(lastGeneratedCourseBlocks.Monday && lastGeneratedCourseBlocks.Monday.length === 0)) return lastGeneratedCourseBlocks;

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
			let startTime = new Date((8+6)*60*60*1000);
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
		lastGeneratedCourseBlocks = {
			Monday: genDay(50, "Monday"),
			Tuesday: genDay(75, "Tuesday"),
			Wednesday: genDay(50, "Wednesday"),
			Thursday: genDay(75, "Thursday"),
			Friday: genDay(50, "Friday")
		}
		return lastGeneratedCourseBlocks;
	}

	static fetchUserPreferences = (user_id?: number): APIUserPreferences => {

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

	static fetchUserViableCourses = (user_id?: number): CourseBlockWeek => {
		const week = APINoAsync.fetchCourseBlocks()
		const prefs = APINoAsync.fetchUserPreferences();
		return {
			Monday: week?.Monday?.filter(() => Math.random() > 0.5)?.map(b => ({...b, preference: prefs.get(b.section_id)})) || null,
			Tuesday: week?.Tuesday?.filter(() => Math.random() > 0.5)?.map(b => ({...b, preference: prefs.get(b.section_id)})) || null,
			Wednesday: week?.Wednesday?.filter(() => Math.random() > 0.5)?.map(b => ({...b, preference: prefs.get(b.section_id)})) || null,
			Thursday: week?.Thursday?.filter(() => Math.random() > 0.5)?.map(b => ({...b, preference: prefs.get(b.section_id)})) || null,
			Friday: week?.Friday?.filter(() => Math.random() > 0.5)?.map(b => ({...b, preference: prefs.get(b.section_id)})) || null
		}
	}

	static fetchAllViableCourses = (): Map<number, CourseBlockWeek> => {
		const blocks = APINoAsync.fetchCourseBlocks();
		const employees = APINoAsync.fetchPTList();
		if (allViable) return allViable;
		allViable = new Map<number, CourseBlockWeek>(
			employees.map(e => {
				const prefs = APINoAsync.fetchUserPreferences();
				return [e.person_id, {
					Monday: blocks.Monday?.filter(b => Math.random() > 0.4)?.map(b => ({...b, preference: prefs.get(b.section_id)})),
					Tuesday: blocks.Tuesday?.filter(b => Math.random() > 0.4)?.map(b => ({...b, preference: prefs.get(b.section_id)})),
					Wednesday: blocks.Wednesday?.filter(b => Math.random() > 0.4)?.map(b => ({...b, preference: prefs.get(b.section_id)})),
					Thursday: blocks.Thursday?.filter(b => Math.random() > 0.4)?.map(b => ({...b, preference: prefs.get(b.section_id)})),
					Friday: blocks.Friday?.filter(b => Math.random() > 0.4)?.map(b => ({...b, preference: prefs.get(b.section_id)}))
				}] as [number, CourseBlockWeek]
			})
		)
		return allViable;
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

	static fetchExportedSchedule = (): Object => {
		return {"people":[{"first":"Sabrina","last":"Ahmed","classes":["331"],"labs":{"331":["902","903"]},"number_lab_hours":4},{"first":"Monica","last":"Arrambide Valdes","classes":["110"],"labs":{"110":["500","501","506"]},"number_lab_hours":6},{"first":"Reed","last":"Billedo","classes":["110"],"labs":{"110":["507"]},"number_lab_hours":2},{"first":"Mohona","last":"Ghosh","classes":["313"],"labs":{"313":["593"]},"number_lab_hours":2},{"first":"Senhe","last":"Hao","classes":["331"],"labs":{"331":["906","907"]},"number_lab_hours":4},{"first":"Seth","last":"Keylon","classes":["120"],"labs":{"120":["501"]},"number_lab_hours":1},{"first":"Shreeman","last":"Kuppa Jayaram","classes":["111"],"labs":{"111":["505"]},"number_lab_hours":2},{"first":"Anthony","last":"Matl","classes":["120"],"labs":{"120":["504","505"]},"number_lab_hours":2},{"first":"Anthony","last":"Noyes","classes":["121"],"labs":{"121":["597"]},"number_lab_hours":1},{"first":"Eric","last":"Nunes","classes":["312"],"labs":{"312":["504","505"]},"number_lab_hours":4},{"first":"Adarsh","last":"Patel","classes":["120"],"labs":{"120":["503","510","512","513"]},"number_lab_hours":4},{"first":"Reagan","last":"Reitmeyer","classes":["121"],"labs":{"121":["501","502"]},"number_lab_hours":2},{"first":"Yazad","last":"Sidhwa","classes":["315"],"labs":{"315":["902"]},"number_lab_hours":2},{"first":"Valerie","last":"Villafana","classes":["121"],"labs":{"121":["500","520"]},"number_lab_hours":2},{"first":"Seth","last":"Webb","classes":["121"],"labs":{"121":["521","522","599"]},"number_lab_hours":3},{"first":"Ian","last":"Wilkinson","classes":["120"],"labs":{"120":["508","517","519"]},"number_lab_hours":3},{"first":"Rohit","last":"Sandur","classes":["315"],"labs":{"315":["911"]},"number_lab_hours":2},{"first":"Nicholus","last":"Campbell","classes":["312"],"labs":{"312":["502"]},"number_lab_hours":2},{"first":"Jack","last":"Ethridge","classes":["120"],"labs":{"120":["506","507"]},"number_lab_hours":2},{"first":"Joshua","last":"Clapp","classes":["120"],"labs":{"120":["511","518"]},"number_lab_hours":2},{"first":"Samuel","last":"Prewett","classes":["120"],"labs":{"120":["500","509"]},"number_lab_hours":2},{"first":"Nebiyou","last":"Ersabo","classes":["120"],"labs":{"120":["514","515","599"]},"number_lab_hours":3},{"first":"Eren","last":"Akleman","classes":["121"],"labs":{"121":["596","598"]},"number_lab_hours":2},{"first":"Weston","last":"Cadena","classes":["120"],"labs":{"120":["502","516"]},"number_lab_hours":2}],"courses":[{"course_id":"110","sec":"500","lab_days":["T","R"],"begin":"12:45:00","end":"13:35:00","instructor":"Ki Hwan K. Yum","lab_room":"ZACH 596","peer_teachers":["Monica Arrambide Valdes"]},{"course_id":"110","sec":"501","lab_days":["T","R"],"begin":"14:35:00","end":"15:25:00","instructor":"Ki Hwan K. Yum","lab_room":"ZACH 596","peer_teachers":["Monica Arrambide Valdes"]},{"course_id":"110","sec":"506","lab_days":["T","R"],"begin":"11:35:00","end":"12:25:00","instructor":"Ki Hwan K. Yum","lab_room":"ZACH 598","peer_teachers":["Monica Arrambide Valdes"]},{"course_id":"110","sec":"507","lab_days":["T","R"],"begin":"12:45:00","end":"13:35:00","instructor":"Ki Hwan K. Yum","lab_room":"ZACH 598","peer_teachers":["Reed Billedo"]},{"course_id":"111","sec":"505","lab_days":["T","R"],"begin":"09:35:00","end":"10:25:00","instructor":"Paul P. Taele","lab_room":"ZACH 592","peer_teachers":["Shreeman Kuppa Jayaram"]},{"course_id":"120","sec":"500","lab_days":["M"],"begin":"08:00:00","end":"08:50:00","instructor":null,"lab_room":"ZACH 582","peer_teachers":["Samuel Prewett"]},{"course_id":"120","sec":"501","lab_days":["W"],"begin":"08:00:00","end":"08:50:00","instructor":null,"lab_room":"ZACH 582","peer_teachers":["Seth Keylon"]},{"course_id":"120","sec":"502","lab_days":["M"],"begin":"09:10:00","end":"10:00:00","instructor":null,"lab_room":"ZACH 582","peer_teachers":["Weston Cadena"]},{"course_id":"120","sec":"503","lab_days":["W"],"begin":"09:10:00","end":"10:00:00","instructor":null,"lab_room":"ZACH 582","peer_teachers":["Adarsh Patel"]},{"course_id":"120","sec":"504","lab_days":["M"],"begin":"10:20:00","end":"11:10:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 582","peer_teachers":["Anthony Matl"]},{"course_id":"120","sec":"505","lab_days":["W"],"begin":"10:20:00","end":"11:10:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 582","peer_teachers":["Anthony Matl"]},{"course_id":"120","sec":"506","lab_days":["M"],"begin":"11:30:00","end":"12:20:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 582","peer_teachers":["Jack Ethridge"]},{"course_id":"120","sec":"507","lab_days":["W"],"begin":"11:30:00","end":"12:20:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 582","peer_teachers":["Jack Ethridge"]},{"course_id":"120","sec":"508","lab_days":["M"],"begin":"08:00:00","end":"08:50:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Ian Wilkinson"]},{"course_id":"120","sec":"509","lab_days":["W"],"begin":"08:00:00","end":"08:50:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Samuel Prewett"]},{"course_id":"120","sec":"510","lab_days":["M"],"begin":"09:10:00","end":"10:00:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Adarsh Patel"]},{"course_id":"120","sec":"511","lab_days":["W"],"begin":"09:10:00","end":"10:00:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Joshua Clapp"]},{"course_id":"120","sec":"512","lab_days":["M"],"begin":"10:20:00","end":"11:10:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Adarsh Patel"]},{"course_id":"120","sec":"513","lab_days":["W"],"begin":"10:20:00","end":"11:10:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Adarsh Patel"]},{"course_id":"120","sec":"514","lab_days":["M"],"begin":"11:30:00","end":"12:20:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Nebiyou Ersabo"]},{"course_id":"120","sec":"515","lab_days":["W"],"begin":"11:30:00","end":"12:20:00","instructor":"Timothy J. McGuire","lab_room":"ZACH 584","peer_teachers":["Nebiyou Ersabo"]},{"course_id":"120","sec":"516","lab_days":["M"],"begin":"08:00:00","end":"08:50:00","instructor":null,"lab_room":"ZACH 596","peer_teachers":["Weston Cadena"]},{"course_id":"120","sec":"517","lab_days":["W"],"begin":"08:00:00","end":"08:50:00","instructor":null,"lab_room":"ZACH 596","peer_teachers":["Ian Wilkinson"]},{"course_id":"120","sec":"518","lab_days":["M"],"begin":"09:10:00","end":"10:00:00","instructor":null,"lab_room":"ZACH 596","peer_teachers":["Joshua Clapp"]},{"course_id":"120","sec":"519","lab_days":["W"],"begin":"09:10:00","end":"10:00:00","instructor":null,"lab_room":"ZACH 596","peer_teachers":["Ian Wilkinson"]},{"course_id":"120","sec":"599","lab_days":["W"],"begin":"12:40:00","end":"13:30:00","instructor":"Michael Moore","lab_room":null,"peer_teachers":["Nebiyou Ersabo"]},{"course_id":"121","sec":"500","lab_days":["W"],"begin":"09:10:00","end":"10:00:00","instructor":"Philip C. Ritchey","lab_room":"ZACH 590","peer_teachers":["Valerie Villafana"]},{"course_id":"121","sec":"501","lab_days":["M"],"begin":"10:20:00","end":"11:10:00","instructor":"Philip C. Ritchey","lab_room":"ZACH 590","peer_teachers":["Reagan Reitmeyer"]},{"course_id":"121","sec":"502","lab_days":["W"],"begin":"10:20:00","end":"11:10:00","instructor":"Philip C. Ritchey","lab_room":"ZACH 590","peer_teachers":["Reagan Reitmeyer"]},{"course_id":"121","sec":"520","lab_days":["M"],"begin":"11:30:00","end":"12:20:00","instructor":"Philip C. Ritchey","lab_room":"ZACH 590","peer_teachers":["Valerie Villafana"]},{"course_id":"121","sec":"521","lab_days":["W"],"begin":"11:30:00","end":"12:20:00","instructor":"Philip C. Ritchey","lab_room":"ZACH 590","peer_teachers":["Seth Webb"]},{"course_id":"121","sec":"522","lab_days":["M"],"begin":"12:40:00","end":"13:30:00","instructor":"Philip C. Ritchey","lab_room":"ZACH 590","peer_teachers":["Seth Webb"]},{"course_id":"121","sec":"596","lab_days":["M"],"begin":"09:10:00","end":"10:00:00","instructor":"Michael Moore","lab_room":"ZACH 590","peer_teachers":["Eren Akleman"]},{"course_id":"121","sec":"597","lab_days":["W"],"begin":"08:00:00","end":"08:50:00","instructor":"Michael Moore","lab_room":"ZACH 590","peer_teachers":["Anthony Noyes"]},{"course_id":"121","sec":"598","lab_days":["M"],"begin":"08:00:00","end":"08:50:00","instructor":"Michael Moore","lab_room":"ZACH 590","peer_teachers":["Eren Akleman"]},{"course_id":"121","sec":"599","lab_days":["W"],"begin":"12:40:00","end":"13:30:00","instructor":"Michael Moore","lab_room":null,"peer_teachers":["Seth Webb"]},{"course_id":"312","sec":"502","lab_days":["T","R"],"begin":"12:45:00","end":"13:35:00","instructor":"Abdullah Muzahid","lab_room":"ZACH 590","peer_teachers":["Nicholus Campbell"]},{"course_id":"312","sec":"504","lab_days":["T","R"],"begin":"15:55:00","end":"16:45:00","instructor":"Eun Kim","lab_room":"ZACH 590","peer_teachers":["Eric Nunes"]},{"course_id":"312","sec":"505","lab_days":["T","R"],"begin":"17:30:00","end":"18:20:00","instructor":"Eun Kim","lab_room":"ZACH 590","peer_teachers":["Eric Nunes"]},{"course_id":"313","sec":"593","lab_days":["T","R"],"begin":"15:55:00","end":"16:45:00","instructor":"Aakash Tyagi","lab_room":"ZACH 584","peer_teachers":["Mohona Ghosh"]},{"course_id":"315","sec":"902","lab_days":["M","W"],"begin":"17:45:00","end":"18:35:00","instructor":"Shawna Thomas","lab_room":"ZACH 584","peer_teachers":["Yazad Sidhwa"]},{"course_id":"315","sec":"911","lab_days":["M","W"],"begin":"19:00:00","end":"19:50:00","instructor":"Robert H. Lightfoot","lab_room":"ZACH 596","peer_teachers":["Rohit Sandur"]},{"course_id":"331","sec":"902","lab_days":["M","W"],"begin":"12:40:00","end":"13:30:00","instructor":"Paul P. Taele","lab_room":"ZACH 598","peer_teachers":["Sabrina Ahmed"]},{"course_id":"331","sec":"903","lab_days":["M","W"],"begin":"13:50:00","end":"14:40:00","instructor":"Paul P. Taele","lab_room":"ZACH 598","peer_teachers":["Sabrina Ahmed"]},{"course_id":"331","sec":"906","lab_days":["M","W"],"begin":"17:45:00","end":"18:35:00","instructor":"Paul P. Taele","lab_room":"ZACH 598","peer_teachers":["Senhe Hao"]},{"course_id":"331","sec":"907","lab_days":["M","W"],"begin":"19:00:00","end":"19:50:00","instructor":"Paul P. Taele","lab_room":"ZACH 598","peer_teachers":["Senhe Hao"]}]}
	}

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

	static sendUserQualifications = async (qualObj: any, user_id?: number): Promise<any> => {};
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