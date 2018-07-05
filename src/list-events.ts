import  { ask } from './readline'
import chalk from 'chalk';
import { Ev3nt } from './models'
import { execSql } from './db/utils'

const logOption = (index: string, label: string, description: string = '', id: string = '') =>
	console.log(chalk` {cyan ${index}} {gray ${id}} ${label} {gray ${description}}`)

export default async (where: string, limit: number = 10): Promise<Ev3nt> => {
	const events: Ev3nt[] = await execSql(`SELECT *,
											(
												SELECT json_agg(tag.label)
												FROM tag, event__tag
												WHERE tag.id = event__tag.tag_id
													AND event__tag.event_id = event.id
											) AS tags
											FROM event
											WHERE ${where}
											GROUP BY event.id
											LIMIT ${limit}`)
	const countResult = await execSql(`SELECT COUNT(*) FROM event WHERE ${where}`)
	const count = countResult[0].count

	if (!events.length) {
		console.error(chalk.yellow('\nNothing found\n'))
	} else {
		console.log(chalk`{yellow Showing ${limit.toString()} of ${count} events}\n`)
		events.forEach((e, i) => logOption(i.toString(), e.label, e.description, e.wikidata_identifier))
		logOption('Q', 'Quit')
		const anwser = await ask('\nEnter a number: ')
		const anwserIndex = parseInt(anwser, 10)
		if (anwser.toUpperCase() === 'Q' || isNaN(anwserIndex)) return
		const event = events[anwserIndex]
		return event
	}
}
