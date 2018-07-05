import { Ev3nt } from './models'
import { execFetch } from './utils'

export default async (event: Ev3nt) => {
	const response = await execFetch(`http://localhost:3333/api/sync-event/${event.wikidata_identifier}3`)
	// TODO fix if response fails
	return `'${event.label}' (${event.wikidata_identifier}) updated`
}