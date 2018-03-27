import { ask, confirm } from "./readline"
import insertEventTagRelations from './insert-event-tag-relations'
import chalk from "chalk"
import { execSql } from "./utils"
import { Ev3nt } from "./models"

export default async (event: Ev3nt) => {
	const rows = await execSql(`SELECT * FROM tag`)

	let anwser = await ask(chalk`\n{yellow Choose tags:}\n${rows.map((r, i) => chalk`{cyan ${i.toString()}}:${r.label}`).join(', ')}\n`)

	if (anwser.trim() !== '') {
		const tagIndices: number[] = anwser
			.split(',')
			.map((t, i) => parseInt(t.trim(), 10))
			.filter(id => !isNaN(id))

		if (tagIndices.length) {
			const confirmed = await confirm(chalk`Are these tags correct? ${tagIndices.map(t => rows[t].label).join(', ')} {cyan (yes)}`)
			if (confirmed) {
				insertEventTagRelations(event.id, tagIndices.map((t, i) => rows[t].id))
			}
		}
	}
}