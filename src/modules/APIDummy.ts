export interface APIPerson {
	person_id: number
	first_name: string
	last_name: string
}

export interface APIPTListResponse {
	users: APIPerson[]
}

class API {
	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?userType=peer-teacher
	static fetchPTList = async (): Promise<APIPTListResponse> => {
		console.log(new Error().stack);
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve({
					users: [
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
					].map((e, i) => ({person_id: i, first_name: e.substring(0, e.indexOf(' ')), last_name: e.substring(e.indexOf(' '))}))
				})
			}, 1000)
		})
	}
}

export default API;

