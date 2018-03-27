import { confirm } from './readline'
import chalk from 'chalk'
import { execSql } from './utils'
import { Ev3nt, WdLocation } from './models'

export default async (event: Ev3nt, location: WdLocation): Promise<WdLocation> => {
	if (event.wikidata_identifier == null) return

	const sql = `INSERT INTO location
					(label, description, coordinates, wikidata_identifier)
				VALUES
					('${location.label}', '${location.description}', ST_GeogFromText('SRID=4326;POINT(${location.coordinates})'), '${location.wikidata_identifier}')
				ON CONFLICT (label)
				DO UPDATE SET
					description = '${location.description}',
					coordinates = ST_GeogFromText('SRID=4326;POINT(${location.coordinates})'),
					wikidata_identifier = '${location.wikidata_identifier}'
				RETURNING *`

	const confirmed = await confirm(chalk`\n{yellow About to insert location:}
{gray label}\t\t\t${location.label}
{gray description}\t\t${location.description}
{gray coordinates}\t\t${location.coordinates}
{gray wikidata entity ID}\t${location.wikidata_identifier}\n\nIs it correct? {cyan (yes)}`)

	if (confirmed) {
		const rows = await execSql(sql)


		if (rows.length) {
			console.log(chalk`{green Location "${location.label}" inserted into db!}`)
			location = rows[0]
		}
	}

	return location
}