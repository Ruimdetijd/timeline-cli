import listEvents from './list-events'
import { civslogServerURL, listEventLimit } from './constants'
import { execFetch } from './utils'
import { MenuAction } from './index'
import { Ev3nt } from './models';
import { Response } from 'node-fetch';

export default async function listEventsWithout(type: 'date' | 'label' | 'location'): Promise<MenuAction | string> {
	const [{ events, count }]: [{ events: Ev3nt[], count: number }, Response] = await execFetch(`${civslogServerURL}/events/by-missing/${type}?limit=${listEventLimit}`)
	let selection = await listEvents(events, count)
	if (selection in MenuAction) return selection as MenuAction

	const event = selection as Ev3nt
	await execFetch(`${civslogServerURL}/events/${event.wikidata_identifier}`, { method: 'POST' })
	return `'${event.label}' (${event.wikidata_identifier}) updated`
}
