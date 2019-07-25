import searchEntity from './search-entity'
import addClassesToEvent from './add-classes-to-event'
import chalk from 'chalk'
import { confirm } from '../readline'
import { execFetch } from '../utils';
import { civslogServerURL } from '../constants';
import { WdEntity } from '../models';
import { MenuAction } from '..';
import { Response } from 'node-fetch';
import { RawEv3nt } from 'timeline'

export type EventType = 'human' | 'battle' | 'war'

export default async function main(): Promise<string | MenuAction> {
	const selection = await searchEntity()
	if (selection == null) return
	if (selection in MenuAction) return selection as MenuAction

	const entity = selection as WdEntity
	const [existingEvent]: [RawEv3nt, Response] = await execFetch(`${civslogServerURL}/events/by-wikidata-id/${entity.id}`)
	const label = existingEvent == null || existingEvent.lbl == null ? entity.label : existingEvent.lbl
	
	if (existingEvent == null || await confirm(chalk`{yellow "${label}" already exists.} Sync? {cyan (no)} `, 'no')) {
		const [event]: [RawEv3nt, Response] = await execFetch(`${civslogServerURL}/events/by-wikidata-id/${entity.id}`, { method: 'POST' })
		await execFetch(`${civslogServerURL}/events/by-wikidata-id/${entity.id}/image`)
		await addClassesToEvent(event)
		return `Event '${event.lbl}' (${event.wid}) ${existingEvent == null ? 'inserted' : 'updated'}!`
	}
}
