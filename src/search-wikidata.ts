import searchEntity from './search-entity'
import addTagsToEvent from './add-tags-to-event'
import chalk from 'chalk'
import { confirm } from './readline'
import { execFetch } from './utils';
import { civslogServerURL } from './constants';
import { Ev3nt, WdEntity } from './models';
import { MenuAction } from '.';
import { Response } from 'node-fetch';

export type EventType = 'human' | 'battle' | 'war'

export default async function main(): Promise<string | MenuAction> {
	const selection = await searchEntity()
	if (selection == null) return
	if (selection in MenuAction) return selection as MenuAction

	const entity = selection as WdEntity
	const [existingEvent]: [Ev3nt, Response] = await execFetch(`${civslogServerURL}/events/${entity.id}`)
	const label = existingEvent == null || existingEvent.label == null ? entity.label : existingEvent.label
	
	if (existingEvent == null || await confirm(chalk`{yellow "${label}" already exists.} Sync? {cyan (no)} `, 'no')) {
		const [event]: [Ev3nt, Response] = await execFetch(`${civslogServerURL}/events/${entity.id}`, { method: 'POST' })
		await addTagsToEvent(event)
		return `Event '${event.label}' (${event.wikidata_identifier}) ${existingEvent == null ? 'inserted' : 'updated'}!`
	}
}
