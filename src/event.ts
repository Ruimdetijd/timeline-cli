import searchEntity from './search-entity'
import addTags from './add-tags'
import chalk from 'chalk'
import { confirm } from './readline'
import { Ev3nt } from './models';
import handleEvent from './handle-event'
import { selectOne } from './db/utils';

export type EventType = 'human' | 'battle' | 'war'

export default async function main(eventType: EventType): Promise<string> {
	const entity = await searchEntity(eventType)
	if (entity == null) return

	// Check if event already exists in the database
	let event: Ev3nt = await selectOne('event', 'wikidata_identifier', entity.id)
	const label = event == null || event.label == null ? entity.label : event.label
	
	if (event == null || await confirm(chalk`{yellow "${label}" already exists.} Re-fetch? {cyan (no)} `, 'no')) {
		event = await handleEvent(eventType, entity)
	}

	await addTags(event)

	// console.log(chalk.green(`\nAll done!\n`))
	return 'Event inserted!'
}
