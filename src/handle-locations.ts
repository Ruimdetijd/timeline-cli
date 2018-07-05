import { getLocations, fetchClaimValue } from "./wd-request";
import { EventType } from "./event";
import { Ev3nt, WdLocation } from "./models";
import insertLocation from "./db/insert-location";
import insertEventLocationRelations from "./db/insert-event-location-relations";

export default async (eventType: EventType, event: Ev3nt) => {
	if (event == null) return

	let locations = []
	let endLocations = []

	if (eventType === 'human') {
		// Fetch and insert locations in to the database
		locations = await getLocations(event.wikidata_identifier, 'place of birth')
		endLocations = await getLocations(event.wikidata_identifier, 'place of death')
	} else if (eventType === 'battle') {
		const coordinates = await fetchClaimValue(event.wikidata_identifier, 'coordinate location')
		locations = coordinates
			.map(coor => {
				const location = new WdLocation()
				location.coordinates = coor
				return location
			})

		if (!locations.length) {
			locations = await getLocations(event.wikidata_identifier, 'location')
		}
	}

	// Insert locations in to the database
	locations = await Promise.all(locations.map(async (dl) => await insertLocation(event, dl)))
	endLocations = await Promise.all(endLocations.map(async (dl) => await insertLocation(event, dl)))

	// Link the event to the location in the database
	await insertEventLocationRelations(event, locations, endLocations)
}