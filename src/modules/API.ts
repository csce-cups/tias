import axios from 'axios';
import BlockFormer from './BlockFormer';

const timezone_offset = 0;

export interface TradeRequest {
	person_id_sender: number
	section_id_sender: number
	person_id_receiver: number
	section_id_receiver: number
	request_status: "Rejected" | "Accepted" | "Pending" | "Cancelled"
}

export type Weekday = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

export interface Meeting {
	course_id: number
	department: string
	course_number: string
	section_number: string
	meeting_type: string
	days_met: Weekday[]
	start_time: string
	end_time: string
	room?: string
	instructor?: string
}

export interface Course {
	course_id: number
	course_name: string
	course_number: string
	department: string
}

export interface Person {
	person_id: number
	email: string
	first_name: string
	last_name: string
	profile_photo_url: string
	peer_teacher: boolean
	teaching_assistant: boolean
	administrator: boolean
	professor: boolean
	isScheduled: null | boolean
	isChecked: boolean
	desired_number_assignments: number
}

interface AssignedCourse {
	course_id: string
	sec: string
	lab_days: string[]
	begin: string
	end: string
	instructor: string
	lab_room: string
	peer_teachers: string[]
}

interface AssignedPerson {
	first: string
	last: string
	classes: string[]
	labs: any
	number_lab_hours: number
}

interface ExportedSchedule {
	courses: AssignedCourse[]
	people: AssignedPerson[]
}

export interface CourseBlock {
	department: string
	course_number: number
	section_number: string
	section_id: number
	start_time: Date
	end_time: Date
	weekday: string
	place: string
	scheduled: number[] | null
	ronly_scheduled?: number[] | null
	professor: string
	capacity_peer_teachers?: number
	updated?: boolean
	opened?: boolean
	forbidden?: number[]
}

export type CourseBlockWeekKey = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
export type CourseBlockWeek = {
	[key in CourseBlockWeekKey]: CourseBlock[] | null
}

export interface Person_INIT {
	email: string
	firstName: string
	lastName: string
	isPeerTeacher: boolean
	isTeachingAssistant: boolean
	isProfessor: boolean
	isAdministrator: boolean
}

interface raw_APICourseBlock {
	department: string
	course_number: string
	section_number: string
	section_id: number
	start_time: string
	end_time: string
	weekday: string
	place: string
	placeholder_professor_name: string
	capacity_peer_teachers: number
}

interface raw_APICourseBlockWeek {
	Monday: raw_APICourseBlock[]
	Tuesday: raw_APICourseBlock[]
	Wednesday: raw_APICourseBlock[]
	Thursday: raw_APICourseBlock[]
	Friday: raw_APICourseBlock[]
}

export interface APIUserQualification {
	course_id: number
	course_number: string
	qualified: boolean
}

export type APIUserPreferenceEnum = "Can't Do" | "Prefer Not To Do" | "Indifferent" | "Prefer To Do"
export type APIUserPreferences = Map<number, APIUserPreferenceEnum>

export interface APIAlgoResponse {
	scheduled: Map<string, number[]>
	unscheduled: number[]
}

export interface APIStudentUnavailability {
	DTSTART: string,
	DTEND: string,
	BYDAY: string,
}

export interface Submission {
	offered_id: number,
	requested_id: number
}

export interface EditableSection {
	section_id: number
	placeholder_professor_name: string
	capacity_peer_teachers: number
}

export interface APIReturn {
	employees: Promise<Person[]>
	blocks: Promise<CourseBlockWeek>,
	userQuals: Promise<APIUserQualification[]>
	userPrefs: Promise<APIUserPreferences>
	userTrades: Promise<TradeRequest[]>
}

// https://www.geekstrick.com/snippets/how-to-parse-cookies-in-javascript/
export const parseCookie: any = () => {
	try {
		return (
			document.cookie
				.split(';')
				.map(v => v.split('='))
				.reduce((acc: any, v) => {
					acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
					return acc;
				}, {})
		)
	} catch (e) {
		return ({})
	}
}

class API {
	static fetchAllStatic = () => {
		return {
			employees: API.fetchEveryone(),
			blocks: API.fetchCourseBlocks()
		}
	}

	static fetchAllUser = (user_id: number | undefined) => {
		return {
			userQuals: API.fetchUserQualifications(user_id),
			userPrefs: API.fetchUserPreferences(user_id),
			userViableCourses: API.fetchUserViableCourses(user_id),
			userTrades: API.fetchUserTrades(user_id)
		}
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher
	static fetchPTList = async (): Promise<Person[]> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher")
			.then(({data}) => data.users.map((v: any) => ({...v, isChecked: true})))
			.catch(err => [{person_id: -2} as Person]);
	}

	static fetchEveryone = async (): Promise<Person[]> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users")
			.then(({data}) => data.users.map((v: any) => ({...v, isChecked: true})))
			.catch(err => [{person_id: -2} as Person]);
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/course-meetings
	private static fetchCourseBlocks = async (): Promise<CourseBlockWeek> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/course-meetings")
			.then(({data}) => {
				let dataStrict: raw_APICourseBlockWeek = data;
				const createDate = (datestring: string): Date => {
					let d = new Date(0);
					d.setHours(parseInt(datestring.substring(0, 2)) - timezone_offset); // First two digits are the hours
					d.setMinutes(parseInt(datestring.substring(3, 5))); // Next two digits are the minutes
					return d;
				}
				const convert = (input: raw_APICourseBlock[]): CourseBlock[] => (
					input? input.map((e: raw_APICourseBlock) => ({
						department: e.department,
						course_number: parseInt(e.course_number),
						section_number: e.section_number,
						section_id: e.section_id,
						start_time: createDate(e.start_time),
						end_time: createDate(e.end_time),
						weekday: e.weekday,
						place: e.place,
						scheduled: null,
						professor: e.placeholder_professor_name === null ? 'TBA' : e.placeholder_professor_name,
						capacity_peer_teachers: e.capacity_peer_teachers
					}))
					:
					[]
				);

				return ({
					Monday: convert(dataStrict.Monday),
					Tuesday: convert(dataStrict.Tuesday),
					Wednesday: convert(dataStrict.Wednesday),
					Thursday: convert(dataStrict.Thursday),
					Friday: convert(dataStrict.Friday)
				} as any)
			})
			.catch(err => {
				console.error(err);
				return ({
					Monday: [{course_number: -1} as CourseBlock],
					Tuesday: [{course_number: -1} as CourseBlock],
					Wednesday: [{course_number: -1} as CourseBlock],
					Thursday: [{course_number: -1} as CourseBlock],
					Friday: [{course_number: -1} as CourseBlock]
				} as any)
			});
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/{userId}/qualifications
	static fetchUserQualifications = async (user_id?: number): Promise<APIUserQualification[]> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve([] as APIUserQualification[]);});
		return axios.get(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}/qualifications`)
			.then(({data}) => data.qualifications)
			.catch(err => console.log(err));
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/{userId}/preferences
	static fetchUserPreferences = async (user_id?: number): Promise<APIUserPreferences> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve(new Map<number, APIUserPreferenceEnum>());});
		return axios.get(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}/preferences`)
			.then(({data}) => (
				new Map<number, APIUserPreferenceEnum>(
					data.preferences.map((pref: {section_id: number, preference: APIUserPreferenceEnum}) => ([pref.section_id, pref.preference]))
				) as any
			))
			.catch(err => console.log(err));
	}

	static fetchUserViableCourses = async (user_id?: number): Promise<CourseBlockWeek> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve({} as CourseBlockWeek);});
		return axios.get(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}/viable-courses`)
			.then(({data}) => {
				let dataStrict: raw_APICourseBlock[] = data.viableCourses;
				let ret = {
					Monday: [] as CourseBlock[],
					Tuesday: [] as CourseBlock[],
					Wednesday: [] as CourseBlock[],
					Thursday: [] as CourseBlock[],
					Friday: [] as CourseBlock[]
				} as CourseBlockWeek;

				const createDate = (datestring: string): Date => {
					let d = new Date(0);
					d.setHours(parseInt(datestring.substring(0, 2)) - timezone_offset); // First two digits are the hours
					d.setMinutes(parseInt(datestring.substring(3, 5))); // Next two digits are the minutes
					return d;
				}

				const convertOne = (e: raw_APICourseBlock): CourseBlock => ({
					department: e.department,
					course_number: parseInt(e.course_number),
					section_number: e.section_number,
					section_id: e.section_id,
					start_time: createDate(e.start_time),
					end_time: createDate(e.end_time),
					weekday: e.weekday,
					place: e.place,
					scheduled: null,
					professor: e.placeholder_professor_name === null ? 'TBA' : e.placeholder_professor_name,
					capacity_peer_teachers: e.capacity_peer_teachers
				})

				dataStrict.forEach((b: raw_APICourseBlock) => {
					switch (b.weekday) {
						case "Monday": ret.Monday!.push(convertOne(b)); break;
						case "Tuesday": ret.Tuesday!.push(convertOne(b)); break;
						case "Wednesday": ret.Wednesday!.push(convertOne(b)); break;
						case "Thursday": ret.Thursday!.push(convertOne(b)); break;
						case "Friday": ret.Friday!.push(convertOne(b)); break;
					}
				});

				return ret;
			})
			.catch(err => {
				return ({
					Monday: [{course_number: -1} as CourseBlock],
					Tuesday: [{course_number: -1} as CourseBlock],
					Wednesday: [{course_number: -1} as CourseBlock],
					Thursday: [{course_number: -1} as CourseBlock],
					Friday: [{course_number: -1} as CourseBlock]
				} as any)
			});
	}

	static fetchAllViableCourses = async (): Promise<Map<number, CourseBlockWeek>> => {
		return axios.get(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/viable-courses`)
			.then(({data}) => {
				let dataStrict: (raw_APICourseBlock & {person_id: number, preference: APIUserPreferenceEnum})[] = data.viability;
				let map = new Map<number, CourseBlockWeek>();

				const createDate = (datestring: string): Date => {
					let d = new Date(0);
					d.setHours(parseInt(datestring.substring(0, 2)) - timezone_offset); // First two digits are the hours
					d.setMinutes(parseInt(datestring.substring(3, 5))); // Next two digits are the minutes
					return d;
				}

				const convertOne = (e: (raw_APICourseBlock & {preference: APIUserPreferenceEnum})): (CourseBlock & {preference: APIUserPreferenceEnum}) => ({
					department: e.department,
					course_number: parseInt(e.course_number),
					section_number: e.section_number,
					section_id: e.section_id,
					start_time: createDate(e.start_time),
					end_time: createDate(e.end_time),
					weekday: e.weekday,
					place: e.place,
					scheduled: null,
					professor: e.placeholder_professor_name === null ? 'TBA' : e.placeholder_professor_name,
					capacity_peer_teachers: e.capacity_peer_teachers,
					preference: e.preference
				})

				dataStrict.forEach((b) => {
					if (!map.has(b.person_id)) map.set(b.person_id, {
						Monday: [] as (CourseBlock & {preference: APIUserPreferenceEnum})[],
						Tuesday: [] as (CourseBlock & {preference: APIUserPreferenceEnum})[],
						Wednesday: [] as (CourseBlock & {preference: APIUserPreferenceEnum})[],
						Thursday: [] as (CourseBlock & {preference: APIUserPreferenceEnum})[],
						Friday: [] as (CourseBlock & {preference: APIUserPreferenceEnum})[]
					} as CourseBlockWeek);

					switch (b.weekday) {
						case "Monday": map.get(b.person_id)!.Monday!.push(convertOne(b)); break;
						case "Tuesday": map.get(b.person_id)!.Tuesday!.push(convertOne(b)); break;
						case "Wednesday": map.get(b.person_id)!.Wednesday!.push(convertOne(b)); break;
						case "Thursday": map.get(b.person_id)!.Thursday!.push(convertOne(b)); break;
						case "Friday": map.get(b.person_id)!.Friday!.push(convertOne(b)); break;
					}
				});
				
				return map;
			})
			.catch(err => {
				return new Map<number, CourseBlockWeek>([[-1, {} as CourseBlockWeek]]);
			});
	}

	static fetchUserTrades = async (user_id?: number): Promise<TradeRequest[]> => {
		if (user_id === undefined) return new Promise((resolve) => resolve([] as TradeRequest[]));
		return axios.get(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}/trade-requests`)
			.then(({data}) => data.trade_requests as TradeRequest[]);
	}

	static fetchExportedSchedule = async (): Promise<ExportedSchedule> => {
		return axios.get('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/export-schedule')
			.then(response => response.data as ExportedSchedule)
	}

	static sendUserPreferences = async (user_id: number | undefined, prefs: Map<number, APIUserPreferenceEnum>, pref_num?: number): Promise<void> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve()});
		let rets: Promise<void>[] = [];
		if (pref_num !== undefined) {
			rets.push(
					fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}`, {
					method: "PUT",
					body: JSON.stringify({"desired_number_assignments": pref_num})
				}).then(() => {})
			)
		} 

		rets.push(
			fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}/preferences`, {
				method: "PUT",
				body: JSON.stringify({
					preferences: Array.from(prefs.entries()).map(arr => ({section_id: arr[0], preference: arr[1]}))
				}),
			}).then(() => {})
		)

		return Promise.all(rets).then(() => {});
	}

	static runScheduler = async (peer_teachers: number[]): Promise<APIAlgoResponse> => {
		return fetch('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/schedule-peer-teachers', {
			method: 'POST',
			body: JSON.stringify({"peerTeachers": peer_teachers})
		}).then(sessionResponse => sessionResponse.json())
		  .then(responseData => {
			let map = new Map<string, number[]>();
			Object.keys(responseData.scheduled).forEach(key => map.set(key, responseData.scheduled[key]));
			responseData.scheduled = map;
			return responseData;
		});
	}
	
	static submitTrade = async (data: Submission, userId: number | undefined): Promise<any> => {
		if (userId === undefined) return;
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${userId}/trade-requests`, {
			method: 'POST',
			body: JSON.stringify(data)
		}).then((APIresp) => APIresp.json())
	}

	static updateTrade = async (data: TradeRequest, userId: number | undefined): Promise<void> => {
		if (userId === undefined) return;
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${userId}/trade-requests`, {
			method: 'PUT',
			body: JSON.stringify(data)
		}).then(() => {});
	}

	static getSavedSchedule = async (): Promise<Map<string, number[]>> => {
		return fetch('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/saved-schedule', {
			method: 'GET'
		}).then(sessionResponse => sessionResponse.json())
		  .then(responseData => {
			let map = new Map<string, number[]>();
			Object.keys(responseData.scheduled).forEach(key => map.set(key, responseData.scheduled[key]));
			return map;
		});
	}

	static sendSavedSchedule = async (scheduled: Map<string, number[]>): Promise<void> => {
		return fetch('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/saved-schedule', {
			method: 'POST',
			body: JSON.stringify({"scheduled": Object.fromEntries(scheduled)})
		}).then(() => {});
	}

	static saveUserUnavailability = async (uid: number | undefined, user_unavailability_arr: APIStudentUnavailability[]) => {
		let currentDateObj = new Date();
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${uid}/unavailability`, {
			method: 'POST',
			body: JSON.stringify({"timezoneOffsetHours": (currentDateObj.getTimezoneOffset() / 60), "unavailability": user_unavailability_arr})
		}).then(() => {});
	}

	static sendNewMeetings = async (meetings: Meeting[]) => {
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/changeover`, {
			method: 'POST',
			body: JSON.stringify(meetings)
		});
	}

	static updateUser = async (user: Person) => {
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user.person_id}`, {
			method: 'PUT',
			body: JSON.stringify({
				"is_peer_teacher": user.peer_teacher,
				"is_teaching_assistant": user.teaching_assistant,
				"is_professor": user.professor,
				"is_administrator": user.administrator
			})
		}).then(() => {});
	}

	static registerNewUser = async (user_init: Person_INIT) => {
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users`, {
			method: 'POST',
			body: JSON.stringify(user_init)
		}).then(() => {});
	}

	static deleteUser = async (uid: number) => {
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${uid}`, {
			method: 'DELETE'
		}).then(() => {});
	}

	static getCourses = async (): Promise<Course[]> => {
		return fetch('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/courses', {
			method: 'GET'
		}).then(sessionResponse => sessionResponse.json())
		  .then(responseData => responseData as Course[]);
	}

	static addCourse = async (course: Course) => {
		return fetch('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/courses', {
			method: 'POST',
			body: JSON.stringify(course)
		}).then(() => {});
	}

	static deleteCourse = async (course_id: number) => {
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/courses/${course_id}`, {
			method: 'DELETE'
		}).then(() => {});
	}

	static updateSections = async (sections: EditableSection[]) => {
		return fetch('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/course-meetings', {
			method: 'PUT',
			body: JSON.stringify({updated_sections: sections})
		}).then(() => {});
	}
}

export default API;