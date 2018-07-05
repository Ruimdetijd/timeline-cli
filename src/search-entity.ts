import  { ask } from './readline'
import chalk from 'chalk';
import { WdEntity } from './models'
import { execFetch } from './utils'
import { EventType } from './event';

const logOption = (index: string, label: string, description: string = '', id: string = '') =>
	console.log(chalk`{cyan ${index}} {gray ${id}} ${label} {gray ${description}}`)

export default async (eventType?: EventType): Promise<WdEntity> => {
	const type = (eventType == null) ? '' : ` ${eventType}`
	const searchTerm = await ask(chalk`\n{yellow Search for${type}: }`)

	if (searchTerm === '') return
	const searchResult = await execFetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${searchTerm.trim()}&language=en&format=json`)
	const entities: WdEntity[] = searchResult.search

	if (entities.length) {
		entities.forEach((ent, i) => logOption(i.toString(), ent.label, ent.description, ent.id))
		console.log(logOption('Q', 'Quit', ''))
		const anwser = await ask('Enter a number: ')
		const anwserIndex = parseInt(anwser, 10)
		if (anwser.toUpperCase() === 'Q' || isNaN(anwserIndex)) return
		return entities[anwserIndex]
	}
}