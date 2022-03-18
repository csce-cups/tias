import axios from 'axios'

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

class API {
	// https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?userType=peer-teacher
	static fetchPTList = async (): Promise<APIPTListResponse> => {
		return axios.get("https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users?userType=peer-teacher")
			.then(({data}) => {
				return data;
			})
			.catch(err => {
				console.log(err);
			});
	}
}

export default API;