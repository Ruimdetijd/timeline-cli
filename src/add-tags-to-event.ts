import { ask, confirm } from "./readline"
import chalk from "chalk"
import { Ev3nt } from "./models"
import { civslogServerURL } from "./constants";
import { execFetch, execPost, tagToRow } from "./utils";
import * as Table from 'tty-table'

const TABLE_HEADER = [
	{ value: 'no', color: 'cyan', width: 8 },
	{ value: 'label', align: 'left', width: 24 },
]

export default async function addTagsToEvent(event: Ev3nt) {
	if (event == null) return

	const [tags] = await execFetch(`${civslogServerURL}/tags`)

	const table = Table(TABLE_HEADER, tags.map(tagToRow))
	console.log(table.render())

	let anwser = await ask(chalk`\n{yellow Choose tags: }`)

	if (anwser.trim() !== '') {
		const tagIndices: number[] = anwser
			.split(',')
			.map((t) => parseInt(t.trim(), 10))
			.filter(id => !isNaN(id))

		if (tagIndices.length) {
			const confirmed = await confirm(chalk`Are these tags correct? ${tagIndices.map(t => tags[t].label).join(', ')} {cyan (yes)}`)
			if (confirmed) await execPost(`${civslogServerURL}/events/${event.wikidata_identifier}/tags`, tagIndices.map((t, i) => tags[t].id))
		}
	}
}
