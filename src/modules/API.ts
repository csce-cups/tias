import axios from 'axios'
import BlockFormer from './BlockFormer'

const timezone_offset = 6;

export interface APIPerson {
	person_id: number
	first_name: string
	last_name: string
	profile_photo_url: string
	peer_teacher: boolean
	teaching_assistant: boolean
	administrator: boolean
	professor: boolean
}


export interface APIPTListResponse {
	users: APIPerson[]
}

export interface APICourseBlock {
	department: string
	course_number: number
	section_number: number
	start_time: Date
	end_time: Date
	weekday: string
	place: string
}

export interface APICourseBlockWeek {
	Monday: APICourseBlock[] | null
	Tuesday: APICourseBlock[] | null
	Wednesday: APICourseBlock[] | null
	Thursday: APICourseBlock[] | null
	Friday: APICourseBlock[] | null
}

interface raw_APICourseBlock {
	department: string
	course_number: string
	section_number: string
	start_time: string
	end_time: string
	weekday: string
	place: string
}

interface raw_APICourseBlockWeek {
	Monday: raw_APICourseBlock[]
	Tuesday: raw_APICourseBlock[]
	Wednesday: raw_APICourseBlock[]
	Thursday: raw_APICourseBlock[]
	Friday: raw_APICourseBlock[]
}


export interface APIContents {
	employees: APIPerson[]
	blocks: APICourseBlockWeek
}

export interface APIReturn {
	employees: Promise<APIPerson[]>
	blocks: Promise<APICourseBlockWeek>
}

class API {
	static fetchAll = (): APIReturn => {
		return {
			employees: API.fetchPTList(),
			blocks: API.fetchCourseBlocks()
		}
	}

	static fetchAllDummy = (args?: {employees?: APIPerson[]}): APIReturn => {
		return {
			employees: API.fetchPTListDummy(args?.employees),
			blocks: API.fetchCourseBlocksDummy()
		}
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher
	private static fetchPTList = async (): Promise<APIPerson[]> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher")
			.then(({data}) => data.users)
			.catch(err => console.log(err));
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/course-meetings
	private static fetchCourseBlocks = async (): Promise<APICourseBlockWeek> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/course-meetings")
			.then(({data}) => {
				let dataStrict: raw_APICourseBlockWeek = data;
				const createDate = (datestring: string): Date => {
					let d = new Date(0);
					d.setHours(timezone_offset + parseInt(datestring.substring(0, 2))); // First two digits are the hours
					d.setMinutes(parseInt(datestring.substring(3, 5))); // Next two digits are the minutes
					console.log({str: datestring, date: d});
					return d;
				}
				const convert = (input: raw_APICourseBlock[]): APICourseBlock[] => (input.map((e: raw_APICourseBlock) => ({
					department: e.department,
					course_number: parseInt(e.course_number),
					section_number: parseInt(e.section_number),
					start_time: createDate(e.start_time),
					end_time: createDate(e.end_time),
					weekday: e.weekday,
					place: e.place
				})))

				return ({
					Monday: convert(dataStrict.Monday),
					Tuesday: convert(dataStrict.Tuesday),
					Wednesday: convert(dataStrict.Wednesday),
					Thursday: convert(dataStrict.Thursday),
					Friday: convert(dataStrict.Friday)
				} as any)
			})
			.catch(err => console.log(err));
	}

	private static fetchPTListDummy = async (response?: APIPerson[]): Promise<APIPerson[]> => {
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve(response || [
						"Geralt of Rivia",
						"Gary Chess", 
						"Sandy Banks", 
						"King Gerold III",
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
						first_name: e.substring(0, e.indexOf(' ')), 
						last_name: e.substring(e.indexOf(' ')),
						profile_photo_url: "",
						peer_teacher: true,
						teaching_assistant: false,
						administrator: false,
						professor: false
					})
				))
			}, 1000)
		})
	}

	private static fetchCourseBlocksDummy = async (): Promise<APICourseBlockWeek> => {
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve({
					Monday: BlockFormer.samples.M_schedule,
					Tuesday: BlockFormer.samples.TH_schedule,
					Wednesday: BlockFormer.samples.W_schedule,
					Thursday: BlockFormer.samples.TH_schedule,
					Friday: BlockFormer.samples.F_schedule
				})
			}, 1500);
		})
	}
}

export default API;