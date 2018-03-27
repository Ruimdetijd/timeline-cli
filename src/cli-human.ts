import insertEvent from './insert-event'
import { fetchClaimValue, getLocations } from './wd-request'
import insertLocation from './insert-location'
import searchEntity from './search-entity'
import addTags from './add-tags'
import { selectOne } from './utils'
import chalk from 'chalk'
import { confirm } from './readline'
import { WdDate, Ev3nt } from './models';
import insertEventLocationRelations from './insert-event-location-relations';

const onDate = (a, b) => {
	if (a.dateString > b.dateString) return 1
	if (a.dateString < b.dateString) return -1
	return 0
}

export default async function main() {
	const entity = await searchEntity()
	if (entity == null) return

	let event: Ev3nt = await selectOne('event', 'wikidata_identifier', entity.id)

	if (event != null) {
		console.log(chalk`{yellow "${event.label}" already exists.}`)
	} 
	
	if (event == null || await confirm(chalk`Edit birth date/place and death date/place? {cyan (no)} `, 'no')) {
		// Fetch and sort birth dates
		const birthDates: WdDate[] = await fetchClaimValue(entity.id, 'date of birth')
		birthDates.sort(onDate)

		// Fetch and sort death dates
		let deathDates: WdDate[] = await fetchClaimValue(entity.id, 'date of death')
		deathDates = deathDates.map(dd => {
			const date = new Date(dd.timestamp)
			let nextDate

			if (dd.granularity === 'MONTH') {
				nextDate = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
			} else if (dd.granularity === 'YEAR') {
				nextDate = new Date(date.getUTCFullYear(), 11, 31)
			}

			if (nextDate != null) {
				dd.timestamp = nextDate.getTime()
				dd.dateString = nextDate.toUTCString()
			}

			return dd
		})
		deathDates.sort(onDate)

		// Arrange dates in an array: [date_min, date, end_date, end_date_max]
		const dates: WdDate[] = [null, null, null, null]
		dates[0] = (birthDates.length > 1) ? birthDates[0] : new WdDate()
		dates[1] = birthDates[birthDates.length - 1]
		dates[2] = deathDates[0]
		dates[3] = (deathDates.length > 1) ? deathDates[deathDates.length - 1] : new WdDate()

		// Insert event in to the database
		event = await insertEvent(entity, dates)

		// Fetch and insert locations in to the database
		let birthLocations = await getLocations(event.wikidata_identifier, 'place of birth')
		birthLocations = await Promise.all(birthLocations.map(async (bl) => await insertLocation(event, bl)))

		let deathLocations = await getLocations(event.wikidata_identifier, 'place of death')
		deathLocations = await Promise.all(deathLocations.map(async (dl) => await insertLocation(event, dl)))

		// Link the event to the location in the database
		await insertEventLocationRelations(event, birthLocations, deathLocations)
	}

	await addTags(event)

	console.log(chalk.green(`\nAll done!\n`))
}
