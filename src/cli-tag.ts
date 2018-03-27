import { confirm } from './readline'
import searchEntity from "./search-entity";
import { execSql } from './utils';

export default async function main() {
	const entity = await searchEntity()

	const confirmed = await confirm(`Is this correct?\n${entity.id}, ${entity.label}, ${entity.description}\n(yes)\n`)

	if (confirmed) {
		const sql = `INSERT INTO tag
						(label, description, wikidata_identifier)
					VALUES
						($1, $2, $3)`
		const rows = await execSql(sql, [entity.label, entity.description, entity.id])
		if (rows.length === 1) console.log('Tag inserted!')
	}
}
