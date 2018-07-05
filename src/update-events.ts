// This script updates ALL events. This was interesting when the database had ~100 entries,
// but with 10000+ this is not workable. Updating still needs to be done, but more fine grained.



// import { wait, logError } from "./utils"
// import { execSql } from "./db/utils";
// import handleEvent from './handle-event'
// import { fetchEntities } from "./wd-request";
// import { Ev3nt } from "./models";
// import { EventType } from "./event";

// export default async () => {
// 	const sql = `SELECT event.*, json_agg(tag.label) as tags
// 				FROM event, tag, event__tag
// 				WHERE event__tag.event_id = event.id
// 					AND event__tag.tag_id = tag.id
// 				GROUP BY event.id`
// 	const rows = await execSql(sql)

// 	let i = 0
// 	const updateEvent = async () => {
// 		if (i < rows.length) {
// 			const event: Ev3nt = rows[i]

// 			let eventType: EventType
// 			if (event.tags.indexOf('human') > -1) eventType = 'human'
// 			else if (event.tags.indexOf('battle') > -1) eventType = 'battle'
// 			else {
// 				logError('updateEvent', [`Unkonwn tags: ${JSON.stringify(event.tags)}`])
// 				return
// 			}

// 			const [ entity ] = await fetchEntities([event.wikidata_identifier])
// 			await handleEvent(eventType, entity)
// 			i++
// 			await wait(1000)
// 			await updateEvent()
			
// 		}
// 	}
// 	await updateEvent()
// }