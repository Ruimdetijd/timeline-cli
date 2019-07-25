import listEvents from './list-events'
import { civslogServerURL, listEventLimit } from './constants'
import { execFetch } from './utils'
import { MenuAction } from './index'
import { Response } from 'node-fetch';
import { RawEv3nt } from 'timeline';

export type EventListType = 'date' | 'label' | 'location' | 'image'
export default async function listEventsWithout(type: EventListType): Promise<MenuAction | string> {
	const [{ events, count }]: [{ events: RawEv3nt[], count: number }, Response] = await execFetch(`${civslogServerURL}/events/by-missing/${type}?limit=${listEventLimit}`)
	let selection = await listEvents(events, count, type)
	if (selection in MenuAction) return selection as MenuAction

	const event = selection as RawEv3nt
	const [updatedEvent] = await execFetch(`${civslogServerURL}/events/${event.wid}`, { method: 'POST' })
	return `'${updatedEvent.label}' (${event.wid}) updated`
}
