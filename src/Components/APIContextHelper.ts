import { createContext, useState } from "react";
import { APIUserPreferenceEnum, APIUserPreferences, APIUserQualification, CourseBlock, CourseBlockWeek, CourseBlockWeekKey, Person, TradeRequest } from "../modules/API";

interface UserPerson {
	user: Person | null
	doShowProfile: boolean | null
	doShowScheduling: boolean | null
	doShowLabSwap: boolean | null
	doShowAdmin: boolean | null
}

export interface PersonPrefLink {
	person_id: number
	pref: APIUserPreferenceEnum
}

const defaultError = (what: string) => console.error(`ERR: Default context triggered for ${what}. Please rememeber to pass a state with a context provider`)
export const contexts = {
	googleData: createContext<[any, React.Dispatch<React.SetStateAction<any>>]>([
		{}, () => defaultError("googleData")
	]),

	employees: createContext<[Person[], React.Dispatch<React.SetStateAction<Person[]>>]>(
		[[] as Person[], () => defaultError("employees")]
	),

	blocks: createContext<[CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>]>([
		{ Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null } as CourseBlockWeek,
		() => defaultError("blocks"),
	]),

	blockUpdate: createContext<(actions: BlockUpdateAction[]) => void>(() => defaultError(".")),

	loadedSchedule: createContext<[Map<string, number[]>, React.Dispatch<React.SetStateAction<Map<string, number[]>>>]>([
		new Map<string, number[]>(),
		() => defaultError("loadedSchedule")
	]),

	allViableCourses: createContext<[
		Map<number, CourseBlockWeek>, React.Dispatch<React.SetStateAction<Map<number, CourseBlockWeek>>>,
		Map<number, PersonPrefLink[]>
	]>([
		new Map<number, CourseBlockWeek>(),
		() => defaultError("allViableCourses"),
		new Map<number, PersonPrefLink[]>()
	]),

	user: createContext<UserPerson>({
		user: null,
		doShowProfile: null,
		doShowScheduling: null,
		doShowLabSwap: null,
		doShowAdmin: null
	}),

	userQuals: createContext<[APIUserQualification[], React.Dispatch<React.SetStateAction<APIUserQualification[]>>]>(
		[
			[{ course_id: -1, course_number: "loading", qualified: false }] as APIUserQualification[],
			() => defaultError("userQuals"),
		]),

	userPrefs: createContext<[APIUserPreferences, React.Dispatch<React.SetStateAction<APIUserPreferences>>]>(
		[new Map<number, APIUserPreferenceEnum>(), () => defaultError("userPrefs")]
	),

	userViableCourses: createContext<[CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>]>([
		{ Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null } as CourseBlockWeek,
		() => defaultError("userViableCourses"),
	]),

	userTrades: createContext<[TradeRequest[], React.Dispatch<React.SetStateAction<TradeRequest[]>>]>([
		[] as TradeRequest[],
		() => defaultError("userTrades"),
	]),
};

export type BlockAction = "block" | "section";
export interface BlockUpdateAction {
	action: BlockAction;
	block: CourseBlock;
	splice: Object;
}

export const _initstates = () => {
	const googleDataState = useState({} as any);
	const employeeState = useState([] as Person[]);
	const blockState = useState({
		Monday: null,
		Tuesday: null,
		Wednesday: null,
		Thursday: null,
		Friday: null,
	} as CourseBlockWeek);

	// Essentially a custom reducer for the blocks
	const blockUpdate = (actions: BlockUpdateAction[]) => {
		const keys: (keyof CourseBlockWeek)[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
		actions.forEach(({ action, block, splice }) => {
			switch (action) {
				case "block":
					keys.forEach(k => blockState[0][k] = blockState[0][k]?.map(b => (b.section_id === block.section_id && b.weekday === block.weekday) ? { ...b, ...splice } : b) || null);
					break;
				case "section":
					keys.forEach(k => blockState[0][k] = blockState[0][k]?.map(b => (b.section_id === block.section_id) ? { ...b, ...splice } : b) || null);
					break;
			}
		})

		blockState[1]({
			Monday: blockState[0].Monday,
			Tuesday: blockState[0].Tuesday,
			Wednesday: blockState[0].Wednesday,
			Thursday: blockState[0].Thursday,
			Friday: blockState[0].Friday
		});
	}

	const loadedScheduleState = useState(new Map<string, number[]>());
	const allViableCoursesState = useState(new Map<number, CourseBlockWeek>());
	const allViableCoursesMap = useState(new Map<number, PersonPrefLink[]>());

	const [user, setUser] = useState<UserPerson>({
		user: null,
		doShowProfile: null,
		doShowScheduling: null,
		doShowLabSwap: null,
		doShowAdmin: null
	})

	const userQualState = useState([
		{ course_id: -1, course_number: "loading", qualified: false },
	] as APIUserQualification[]);

	const userPrefState = useState(new Map<number, APIUserPreferenceEnum>());
	const userViableCourses = useState({
		Monday: null,
		Tuesday: null,
		Wednesday: null,
		Thursday: null,
		Friday: null,
	} as CourseBlockWeek);

	const userTrades = useState([] as TradeRequest[]);

	return {
		googleDataState,
		employeeState,
		blockState,
		blockUpdate,
		loadedScheduleState,
		allViableCoursesState,
		allViableCoursesMap,
		user, setUser,
		userQualState,
		userPrefState,
		userViableCourses,
		userTrades,
	}
}

export const reverseViableCourses = (map: Map<number, CourseBlockWeek>) => {
	let newMap = new Map<number, PersonPrefLink[]>();
	const keys: CourseBlockWeekKey[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	map.forEach((week, id) => {
		keys.forEach(k => {
			week[k]?.forEach(course => {
				if (newMap.has(course.section_id)) {
					const get = newMap.get(course.section_id);
					if (!get?.find(e => e.person_id === id)) newMap.get(course.section_id)!.push({
						person_id: id, pref: (course as any).preference
					});
				} else {
					newMap.set(course.section_id, [{ person_id: id, pref: (course as any).preference }]);
				}
			})
		});
	});
	return newMap;
}