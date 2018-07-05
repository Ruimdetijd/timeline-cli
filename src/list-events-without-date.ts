import listEvents from './list-events'
import updateEvent from './update-event'

const where = `event.label IS NOT NULL 
				AND event.date_min IS NULL
				AND event.date IS NULL
				AND event.end_date IS NULL
				AND event.end_date_max IS NULL`

export default async () => {
	let event = await listEvents(where)
	return await updateEvent(event)
}
