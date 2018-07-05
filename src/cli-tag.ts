import { confirm } from './readline'
import searchEntity from "./search-entity";
import { execSql } from './db/utils';

export default async function main(): Promise<string> {
	const entity = await searchEntity()
	if (entity == null) return

	const confirmed = await confirm(`Is this correct?\n${entity.id}, ${entity.label}, ${entity.description}\n(yes)\n`)

	if (confirmed) {
		const sql = `INSERT INTO tag
						(label, description, wikidata_identifier)
					VALUES
						($1, $2, $3)`
		const rows = await execSql(sql, [entity.label, entity.description, entity.id])
		if (rows.length === 1) return 'Inserted tag'
	}
}
