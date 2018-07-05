import listEvents from './list-events'
import updateEvent from './update-event'

const where = `NOT EXISTS (SELECT * FROM event__location WHERE event__location.event_id = event.id)`

export default async () => {
	const event = await listEvents(where)
	return await updateEvent(event)
}