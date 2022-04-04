import { resolve } from 'path';
import {Person, CourseBlock, CourseBlockWeek, APIUserQualification, APIAlgoResponse, APIStudentUnavailability, APIReturn, APIUserPreferenceEnum, APIUserPreferences} from '../API'

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

const createDate = (datestring: string): Date => {
    let d = new Date(0);
    d.setHours(parseInt(datestring.substring(0, 2))); // First two digits are the hours
    d.setMinutes(parseInt(datestring.substring(3, 5))); // Next two digits are the minutes
    return d;
}

class API {
	static fetchAll = (): APIReturn => {
		console.log("MOCK API: fetchAll");
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
		console.log("MOCK API: fetchAllStatic");
		return {
			employees: API.fetchPTList(),
			blocks: API.fetchCourseBlocks()
		}
	}

	static fetchAllUser = (user_id: number | undefined) => {
		console.log("MOCK API: fetchAllUser");
		return {
			userQuals: API.fetchUserQualifications(user_id),
			userPrefs: API.fetchUserPreferences(user_id),
			userViableCourses: API.fetchUserViableCourses(user_id)
		}
	}

	static fetchUserViableCourses = async (user_id?: number): Promise<CourseBlockWeek> => {
		console.log("MOCK API: fetchUserViableCourses");
		if (user_id === undefined) return new Promise((resolve) => {resolve({} as CourseBlockWeek);});
		return API.fetchCourseBlocks().then(week => {
			return {
				Monday: week!.Monday!.filter(block => block.section_id === user_id),
				Tuesday: week!.Tuesday!.filter(block => block.section_id === user_id),
				Wednesday: week!.Wednesday!.filter(block => block.section_id === user_id),
				Thursday: week!.Thursday!.filter(block => block.section_id === user_id),
				Friday: week!.Friday!.filter(block => block.section_id === user_id)
			}
		});
	}

	static sendUserPreferences = async (user_id: number, prefs: Map<number, APIUserPreferenceEnum>, pref_num?: number): Promise<void> => {
		console.log("MOCK API: sendUserPreferences");
		let rets: Promise<void>[] = [];
		if (pref_num !== undefined) {
			rets.push(
				new Promise(resolve => {
					setTimeout(() => {
						console.log(JSON.stringify({"desired_number_assignments": pref_num}));
						resolve();
					}, 100);
				})
			)
		} 

		rets.push(
			new Promise(resolve => {
				setTimeout(() => {
					console.log(
						JSON.stringify({
							preferences: Array.from(prefs.entries()).map(arr => ({section_id: arr[0], preference: arr[1]}))
						}),
					)
					resolve();
				}, 100);
			})
		)

		return Promise.all(rets).then(() => {});
	}

	static getSavedSchedule = async (): Promise<Map<string, number[]>> => {
		console.log("MOCK API: getSavedSchedule");
		return API.runScheduler([]).then(resp => resp.scheduled);
	}

	static sendSavedSchedule = async (scheduled: Map<string, number[]>): Promise<void> => {
		console.log("MOCK API: sendSavedSchedule");
		return new Promise(resolve => {
			setTimeout(() => {
				console.log(JSON.stringify({scheduled: Array.from(scheduled.entries())}));
				resolve();
			}, 100);
		});
	}

	static saveUserUnavailability = async (user_unavailability_arr: APIStudentUnavailability[]): Promise<void> => {
		console.log("MOCK API: saveUserUnavailability");
		const currentDateObj = new Date();
		return new Promise(resolve => {
			setTimeout(() => {
				console.log(JSON.stringify({"timezoneOffsetHours": (currentDateObj.getTimezoneOffset() / 60), "unavailability": user_unavailability_arr}));
				resolve();
			}, 100);
		});
	}

	private static fetchPTList = async (): Promise<Person[]> => {
		console.log("MOCK API: static");
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve([
						"Test User 1",
						"Test User 2",
						"Test User 3"
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
			}, 100)
		})
	}

	private static fetchCourseBlocks = async (): Promise<CourseBlockWeek> => {
		console.log("MOCK API: static");
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve({
					Monday: [generateBlock(121, '101', createDate('09:00:00'), createDate('10:00:00'), "Monday", "BUILDING 1", 1)],
					Tuesday: [generateBlock(221, '102', createDate('09:00:00'), createDate('10:30:00'), "Tuesday", "BUILDING 2", 2)],
					Wednesday: [generateBlock(121, '101', createDate('09:00:00'), createDate('10:00:00'), "Wednesday", "BUILDING 1", 1)],
					Thursday: [generateBlock(221, '102', createDate('09:00:00'), createDate('10:30:00'), "Thursday", "BUILDING 2", 2)],
					Friday: [generateBlock(312, '103', createDate('09:00:00'), createDate('10:00:00'), "Friday", "BUILDING 3", 3)],
				})
			}, 100);
		})
	}

	private static fetchUserQualifications = async (user_id?: number): Promise<APIUserQualification[]> => {
		console.log("MOCK API: static");
		if (user_id === undefined) return new Promise((resolve) => {resolve([] as APIUserQualification[]);});
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve([
					{course_id: 1, course_number: "121", qualified: true},
					{course_id: 2, course_number: "221", qualified: true},
					{course_id: 3, course_number: "312", qualified: true}
				])
			}, 100);
		})
	}

	private static fetchUserPreferences = async (user_id?: number): Promise<APIUserPreferences> => {
		console.log("MOCK API: static");
		if (user_id === undefined) return new Promise((resolve) => {resolve(new Map<number, APIUserPreferenceEnum>());});
		return API.fetchCourseBlocks().then(blocks => {
			const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday];
			let resp = new Map<number, APIUserPreferenceEnum>();

			allBlocks.forEach(day => {
				day?.forEach(block => {
					resp.set(block.section_id, "Indifferent");
				});
			});

			return resp;
		})
	}

	static runScheduler = async (peer_teachers: number[]): Promise<APIAlgoResponse> => {
		console.log("MOCK API: runScheduler");
		return new Promise((resolve, _) => {
			setTimeout(() => {
				let resp = JSON.parse(`{"scheduled": {"1":[1],"2":[1, 2],"3":[2]}, "unscheduled": [3]}`)
				let map = new Map<string, number[]>();
				Object.keys(resp.scheduled).map(key => map.set(key, resp.scheduled[key]));
				resp.scheduled = map;
				resolve(resp);
			}, 100);
		})
	}
}

export default API;