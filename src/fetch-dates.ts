import { WdDate } from "./models"
import { fetchClaimValue } from "./wd-request"
import { EventType } from "./event";
import chalk from "chalk";

const onDate = (a, b) => {
	if (a.timestamp > b.timestamp) return 1
	if (a.timestamp < b.timestamp) return -1
	return 0
}

const startDatePropertyByEventType: { [k in EventType]: string } = {
	'human': 'date of birth',
	'battle': 'start time',
}

const endDatePropertyByEventType: { [k in EventType]: string } = {
	'human': 'date of death', 
	'battle': 'end time',
}

export const setUTCDate = (year: number, month: number = 0, day: number = 1, hour: number = 0, minutes: number = 0, seconds: number = 0, milliseconds: number = 0) => {
	let date: number =  Date.UTC(year, month, day, hour, minutes, seconds, milliseconds)
	if (year > -1 && year < 100) {
		const tmpDate = new Date(date)
		tmpDate.setUTCFullYear(year)
		date = tmpDate.getTime()
	}
	return date
}

type DateRange = [WdDate, WdDate, WdDate, WdDate]
export default async (eventType: EventType, wdEntityID: string): Promise<DateRange> => {
	// Fetch and sort start dates
	let startDates: WdDate[] = await fetchClaimValue(wdEntityID, startDatePropertyByEventType[eventType])
	const pointInTime = await fetchClaimValue(wdEntityID, 'point in time')
	startDates = startDates.concat(pointInTime)
	startDates.sort(onDate)

	// Fetch and sort end dates
	let endDates: WdDate[] = await fetchClaimValue(wdEntityID, endDatePropertyByEventType[eventType])
	endDates = endDates.map(dd => {
		const date = new Date(dd.timestamp)
		let nextDate

		if (dd.granularity === 'DAY') nextDate = setUTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999)
		else if (dd.granularity === 'MONTH') nextDate = setUTCDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999)
		else if (dd.granularity === 'YEAR') nextDate = setUTCDate(date.getUTCFullYear(), 11, 31, 23, 59, 59, 999)
		else {
			console.error(chalk`{red Unhandled granularity "${dd.granularity}"}`)
		}

		if (nextDate != null) {
			dd.timestamp = nextDate
		}

		return dd
	})

	endDates.sort(onDate)

	// Arrange dates in an array: [date_min, date, end_date, end_date_max]
	const dates: DateRange = [new WdDate(), new WdDate(), new WdDate(), new WdDate()]
	if (startDates.length > 1) dates[0] = startDates[0]
	if (startDates.length) dates[1] = startDates[startDates.length - 1]
	if (endDates.length) dates[2] = endDates[0]
	if (endDates.length > 1) dates[3] = endDates[endDates.length - 1]

	return dates
}