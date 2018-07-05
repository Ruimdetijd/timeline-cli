import fetchDates from "./fetch-dates"
import insertEvent from "./db/insert-event"
import { Ev3nt, WdEntity } from "./models"
import handleLocations from './handle-locations'
import { EventType } from "./event"
import { ask } from "./readline";

export default async (eventType: EventType, entity: WdEntity): Promise<Ev3nt> => {
	if (eventType == null || entity == null) return null
	const dates = await fetchDates(eventType, entity.id)
	const event = await insertEvent(entity, dates)
	await handleLocations(eventType, event)
	await ask('Press enter key to continue')
	return event
}