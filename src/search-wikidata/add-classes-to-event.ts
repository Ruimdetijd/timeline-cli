import { ask, confirm } from "../readline"
import chalk from "chalk"
import { civslogServerURL } from "../constants";
import { execFetch, tagToRow, logMessage, execPost } from "../utils";
import * as Table from 'tty-table'
import { RawEv3nt } from "timeline";

const TABLE_HEADER = [
	{ value: 'no', color: 'cyan', width: 8 },
	{ value: 'label', align: 'left', width: 24 },
]

export default async function addClassesToEvent(event: RawEv3nt) {
	if (event == null) return

	const [classes] = await execFetch(`${civslogServerURL}/classes`)

	const currentTags = event.class != null && event.class.length ?
		event.class.join(', ') :
		''
	logMessage(`Current tags: ${currentTags}`)
	const table = Table(TABLE_HEADER, classes.map(tagToRow))
	console.log(table.render())

	let anwser = await ask(chalk`\n{yellow Choose classes: }`)

	if (anwser.trim() !== '') {
		const classIndices: number[] = anwser
			.split(',')
			.map((t) => parseInt(t.trim(), 10))
			.filter(id => !isNaN(id))

		if (classIndices.length) {
			const confirmed = await confirm(chalk`Are these classes correct?
Prev classes: ${currentTags}
Next classes: ${classIndices.map(i => classes[i]).join(', ')}
{cyan (yes)}`)
			console.log(confirmed)
			if (confirmed) await execPost(`${civslogServerURL}/events/${event.id}/classes`, classIndices.map((t) => classes[t]))
		}
	}
}
