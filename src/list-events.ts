import  { ask } from './readline'
import chalk from 'chalk';
import { Ev3nt } from './models'
import { listEventLimit, TABLE_HEADER } from './constants';
import { MenuAction } from '.';
import { eventToRow } from './utils'
import * as Table from 'tty-table'

const logOption = (index: string, label: string, description: string = '', id: string = '') =>
	console.log(chalk` {cyan ${index}} {gray ${id}} ${label} {gray ${description}}`)

export default async (events: Ev3nt[], count: number): Promise<Ev3nt | MenuAction> => {
	if (!events.length) {
		console.error(chalk.yellow('\nNothing found\n'))
	} else {
		// console.log(chalk`{yellow Showing ${listEventLimit.toString()} of ${count.toString()} events}\n`)
		const table = Table(TABLE_HEADER, events.map(eventToRow))
		console.log(table.render())
		// events.forEach((e, i) => logOption(i.toString(), e.label, e.description, e.wikidata_identifier))
		logOption('', `... and ${count - listEventLimit} more\n`)
		logOption('B', 'Back')
		logOption('Q', 'Quit')
		const anwser = await ask('\nEnter a number: ')
		const anwserIndex = parseInt(anwser, 10)

		if (anwser.toUpperCase() === 'B') return MenuAction.BACK
		if (anwser.toUpperCase() === 'Q') return MenuAction.QUIT
		if (isNaN(anwserIndex)) return MenuAction.RELOAD

		return events[anwserIndex]
	}
}
