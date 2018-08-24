import  { ask } from './readline'
import chalk from 'chalk';
import { WdEntity } from './models'
import { execFetch, entityToRow } from './utils'
import { MenuAction } from '.'
import * as Table from 'tty-table'
import { TABLE_HEADER, wikiApiURL } from './constants';

function logOption(index: string, label: string, description: string = '', id: string = '') {
	console.log(chalk`{cyan ${index}} {gray ${id}} ${label} {gray ${description}}`)
}

export default async (): Promise<WdEntity | MenuAction> => {
	const searchTerm = await ask('Search for: ')

	if (searchTerm === '') return
	const [searchResult] = await execFetch(`${wikiApiURL}?action=wbsearchentities&search=${searchTerm.trim()}&language=en&format=json`)
	const entities: WdEntity[] = searchResult.search

	if (entities.length) {
		console.log('')
		const table = Table(TABLE_HEADER, entities.map(entityToRow))
		console.log(table.render())
		console.log('')
		logOption('B', 'Back')
		logOption('Q', 'Quit')
		console.log('')
		const anwser = await ask('Enter a number to insert/update event: ')
		const anwserIndex = parseInt(anwser, 10)
		console.log(anwserIndex)
		if (isNaN(anwserIndex)) return MenuAction.RELOAD
		if (anwser.toUpperCase() === 'B') return MenuAction.BACK
		if (anwser.toUpperCase() === 'Q') return MenuAction.QUIT
		return entities[anwserIndex]
	}
}