import axios from 'axios'
import BlockFormer from './BlockFormer'

const timezone_offset = 0;

export interface TradeRequest {
	person_id_sender: number
	section_id_sender: number
	person_id_receiver: number
	section_id_receiver: number
	status: string
}

interface GetTradeRequestHTTPRequest {
	person_id: number
}

interface PutTradeRequestHTTPRequest {
	person_id_sender: number
	section_id_sender: number
	person_id_receiver: number
	section_id_receiver: number
	updated_status: string
}

interface PostTradeRequestHTTPRequest {
	requester: number // person_id of sender

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

export interface CourseBlock {
	department: string
	course_number: number
	section_number: string
	section_id: number
	start_time: Date
	end_time: Date
	weekday: string
	place: string
	scheduled: number[] | null;
	professor: string
}

export interface CourseBlockWeek {
	Monday: CourseBlock[] | null
	Tuesday: CourseBlock[] | null
	Wednesday: CourseBlock[] | null
	Thursday: CourseBlock[] | null
	Friday: CourseBlock[] | null
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

export interface APIReturn {
	employees: Promise<Person[]>
	blocks: Promise<CourseBlockWeek>,
	userQuals: Promise<APIUserQualification[]>
	userPrefs: Promise<APIUserPreferences>
}


// https://www.geekstrick.com/snippets/how-to-parse-cookies-in-javascript/
export const parseCookie: any = () => {
	return (
		document.cookie
			.split(';')
			.map(v => v.split('='))
			.reduce((acc: any, v) => {
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			}, {})
	)
}

class API {
	static fetchAll = (): APIReturn => {
		let id = undefined;
		try {
			id = parseCookie().tias_user_id;
			if (id === -1) id = undefined;
		} catch (SyntaxError) {};

		return {
			employees: API.fetchPTList(),
			blocks: API.fetchCourseBlocks(),
			userQuals: API.fetchUserQualifications(id),
			userPrefs: API.fetchUserPreferences(id)
		}
	}

	static fetchAllStatic = () => {
		return {
			employees: API.fetchPTList(),
			blocks: API.fetchCourseBlocks()
		}
	}

	static fetchAllUser = (user_id: number | undefined) => {
		return {
			userQuals: API.fetchUserQualifications(user_id),
			userPrefs: API.fetchUserPreferences(user_id),
			userViableCourses: API.fetchUserViableCourses(user_id)
		}
	}

	static fetchAllStaticDummy = () => {
		return {
			employees: API.fetchPTListDummy(),
			blocks: API.fetchCourseBlocksDummy()
		}
	}

	static fetchAllUserDummy = (user_id: number | undefined) => {
		return {
			userQuals: API.fetchUserQualificationsDummy(user_id),
			userPrefs: API.fetchUserPreferencesDummy(user_id),
			userViableCourses: API.fetchUserViableCourses(undefined)
		}
	}

	static fetchAllDummy = (args?: {employees?: Person[]}): APIReturn => {
		let id = undefined;
		try {
			id = parseCookie(document.cookie).tias_user_id;
			if (id === -1) id = undefined;
		} catch (SyntaxError) {};

		return {
			employees: API.fetchPTListDummy(args?.employees),
			blocks: API.fetchCourseBlocksDummy(),
			userQuals: API.fetchUserQualificationsDummy(id),
			userPrefs: API.fetchUserPreferencesDummy(id)
		}
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher
	private static fetchPTList = async (): Promise<Person[]> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher")
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
				const convert = (input: raw_APICourseBlock[]): CourseBlock[] => (input.map((e: raw_APICourseBlock) => ({
					department: e.department,
					course_number: parseInt(e.course_number),
					section_number: e.section_number,
					section_id: e.section_id,
					start_time: createDate(e.start_time),
					end_time: createDate(e.end_time),
					weekday: e.weekday,
					place: e.place,
					scheduled: null,
					professor: e.placeholder_professor_name
				})))

				return ({
					Monday: convert(dataStrict.Monday),
					Tuesday: convert(dataStrict.Tuesday),
					Wednesday: convert(dataStrict.Wednesday),
					Thursday: convert(dataStrict.Thursday),
					Friday: convert(dataStrict.Friday)
				} as any)
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

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/{userId}/qualifications
	private static fetchUserQualifications = async (user_id?: number): Promise<APIUserQualification[]> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve([] as APIUserQualification[]);});
		return axios.get(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}/qualifications`)
			.then(({data}) => data.qualifications)
			.catch(err => console.log(err));
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/{userId}/preferences
	private static fetchUserPreferences = async (user_id?: number): Promise<APIUserPreferences> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve(new Map<number, APIUserPreferenceEnum>());});
		return axios.get(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${user_id}/preferences`)
			.then(({data}) => (
				new Map<number, APIUserPreferenceEnum>(
					data.preferences.map((pref: {section_id: number, preference: APIUserPreferenceEnum}) => ([pref.section_id, pref.preference]))
				) as any
			))
			.catch(err => console.log(err));
	}

	// We get a ton of data back from this, but I really only care about the section_id so I reduce the data here
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
					professor: e.placeholder_professor_name
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

	static sendUserPreferences = async (user_id: number, prefs: Map<number, APIUserPreferenceEnum>, pref_num?: number): Promise<void> => {
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

	static saveUserUnavailability = async (user_unavailability_arr: APIStudentUnavailability[]) => {
		let currentDateObj = new Date();
		return fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${parseCookie().tias_user_id}/unavailability`, {
			method: 'POST',
			body: JSON.stringify({"timezoneOffsetHours": (currentDateObj.getTimezoneOffset() / 60), "unavailability": user_unavailability_arr})
		}).then(() => {});
	}



	private static fetchPTListDummy = async (response?: Person[]): Promise<Person[]> => {
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve(response || [
						"Geralt of Rivia",
						"Gary Chess", 
						"Sandy Banks", 
						"King Gerold III",
						"Mayde Enless",
						"Sharpness IV", 
						"Zelda DeLegendof",
						"Star Fox", 
						"Luigi Smansion", 
						"John Doom", 
						"Spongebob Squarepants",
						"Crash Bandishoot",
						"Suzzie Sunshine",
						"Mr. Generic",
						"Honda Accord",
						"K.K. Slider",
						"Gee Wilikers",
						"Mario Galaxy",
						"Ms. Generic",
						"Bubble Bass",
						"Sandy Cheeks",
						"Patrick",
						"Samus Errands",
						"Timmy Twix",
						"Marvin M&M",
						"Bikeal Roads",
						"Spicy Peppers",
						"Quintin QWERTY",
						"Asmorald ASDF",
						"Timmothy Tingle",
						"Kimmothy Kartz",
						"Zimmothy Zions",
						"Phoenix Wright",
						"Mia Fey",
						"Miles Edgeworth",
						"Maya Fey",
						"Pearl Fey",
						"Dick Gumshoe",
						"Franziska von Karma",
						"Ema Skye",
						"The Judge",
						"Apollo Justice",
						"Trucy Wright",
						"Athena Cykes",
						"Ryunosuke Naruhodo",
						"Susato Mikotoba",
						"Herlock Sholmes",
						"Iris Wilson",
						"Barok van Zieks",
						"Tetsutetsu Tetsutetsu",
						"Bobaboba Bobaboba",
						"Spike the Cowboy",
						"Guard the Reserve",
						"Hero Sandwich"
					].map((e, i) => ({
						person_id: i, 
						email: "",
						first_name: e.substring(0, e.indexOf(' ')), 
						last_name: e.substring(e.indexOf(' ')),
						profile_photo_url: "",
						peer_teacher: true,
						teaching_assistant: false,
						administrator: false,
						professor: false,
						isScheduled: null,
						isChecked: false,
						desired_number_assignments: 2
					})
				))
			}, 1000)
		})
	}

	private static fetchCourseBlocksDummy = async (): Promise<CourseBlockWeek> => {
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve({
					Monday: BlockFormer.samples.Test_schedule2,
					Tuesday: BlockFormer.samples.Test_schedule,
					Wednesday: BlockFormer.samples.TH_schedule,
					Thursday: BlockFormer.samples.W_schedule,
					Friday: BlockFormer.samples.F_schedule
				})
			}, 1500);
		})
	}

	private static fetchUserQualificationsDummy = async (user_id?: number): Promise<APIUserQualification[]> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve([] as APIUserQualification[]);});
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve([
					{course_id: 1, course_number: "110", qualified: true},
					{course_id: 2, course_number: "111", qualified: true},
					{course_id: 3, course_number: "120", qualified: true},
					{course_id: 4, course_number: "121", qualified: true},
					{course_id: 5, course_number: "206", qualified: true},
					{course_id: 6, course_number: "221", qualified: true},
					{course_id: 7, course_number: "222", qualified: true},
					{course_id: 8, course_number: "312", qualified: true},
					{course_id: 9, course_number: "313", qualified: true},
					{course_id: 10, course_number: "314", qualified: true},
					{course_id: 11, course_number: "315", qualified: true},
					{course_id: 11, course_number: "331", qualified: true}
				])
			}, 800);
		})
	}

	private static fetchUserPreferencesDummy = async (user_id?: number): Promise<APIUserPreferences> => {
		if (user_id === undefined) return new Promise((resolve) => {resolve(new Map<number, APIUserPreferenceEnum>());});
		return API.fetchCourseBlocksDummy().then(blocks => {
			const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday];
			const choose = () => {
				const possiblePrefs: APIUserPreferenceEnum[] = ["Can't Do", "Prefer Not To Do", "Indifferent", "Prefer To Do"];
				return possiblePrefs[2];
			}

			let resp = new Map<number, APIUserPreferenceEnum>();

			allBlocks.forEach(day => {
				day?.forEach(block => {
					resp.set(block.section_id, choose());
				});
			});

			return resp;
		})
	}

	static runSchedulerDummy = async (peer_teachers: number[]): Promise<APIAlgoResponse> => {
		return new Promise((resolve, _) => {
			setTimeout(() => {
				let resp = JSON.parse(`{ "scheduled": {"1":[17],"129":[9, 10],"66":[9, 10],"3":[14,16],"4":[14],"71":[4],"72":[12],"78":[8],"79":[8,12],"80":[2,15],"16":[3],"81":[2,15],"88":[17],"32":[1,16],"96":[5],"97":[5],"43":[1],"109":[6],"110":[6],"112":[13,10],"48":[11],"113":[13,10],"50":[11],"127":[3],"63":[4]}, "unscheduled": [7] }`)
				let map = new Map<string, number[]>();
				Object.keys(resp.scheduled).map(key => map.set(key, resp.scheduled[key]));
				resp.scheduled = map;
				resolve(resp);
			}, 10000);
		})
	}
}

export default API;