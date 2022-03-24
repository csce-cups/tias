import axios from 'axios'

export interface APIPerson {
	person_id: number
	email: string
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

export interface APIContents {
	employees: APIPerson[]
}

class API {
	static fetchAll = () => {
		return {
			employees: API.fetchPTList()
		}
	}

	static fetchAllDummy = (args?: {employees?: APIPerson[]}) => {
		return {
			employees: API.fetchPTListDummy(args?.employees)
		}
	}

	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher
	private static fetchPTList = async (): Promise<APIPerson[]> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?usertype=peer-teacher")
			.then(({data}) => data.users)
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
						email: "",
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
}

export default API;