import  { ask } from './readline'
import chalk from 'chalk';
import { listEventLimit, TABLE_HEADER } from './constants';
import { MenuAction } from '.';
import { eventToRow } from './utils'
import * as Table from 'tty-table'
import bulkUpdate from './bulk/insert-events';
import { EventListType } from './list-events-without';
import { RawEv3nt } from 'timeline';

const logOption = (index: string, label: string, description: string = '', id: string = '') =>
	console.log(chalk` {cyan ${index}} {gray ${id}} ${label} {gray ${description}}`)

export default async (events: RawEv3nt[], count: number, type: EventListType): Promise<RawEv3nt | MenuAction> => {
	if (!events.length) {
		console.error(chalk.yellow('\nNothing found\n'))
		return MenuAction.BACK
	}

	const table = Table(TABLE_HEADER, events.map(eventToRow))
	console.log(table.render())
	logOption('', `... and ${count - listEventLimit} more\n`)
	logOption('U', 'Bulk update')
	logOption('B', 'Back')
	logOption('Q', 'Quit')
	const anwser = await ask('\nEnter a number: ')
	const anwserIndex = parseInt(anwser, 10)

	if (anwser.toUpperCase() === 'U') {
		if (type === 'image') await bulkUpdate(events.map(e => e.wid), 'image')
		else await bulkUpdate(events.map(e => e.wid), 'update')

		return MenuAction.RELOAD
	}

	if (anwser.toUpperCase() === 'B') return MenuAction.BACK
	if (anwser.toUpperCase() === 'Q') return MenuAction.QUIT
	if (isNaN(anwserIndex)) return MenuAction.RELOAD

	return events[anwserIndex]
}
