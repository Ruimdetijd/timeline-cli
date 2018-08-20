// #! /usr/bin/env node

// import * as path from 'path'
// import * as dotenv from 'dotenv'
// dotenv.config({ path: path.resolve(__dirname, '../../.env') })
// import chalk from 'chalk'
// import { fetchEntities } from '../wd-request'
// import handleEvent from '../handle-event'
// import selectEvents from '../db/select-events';
// let events = []

// let i = 0
// const wait = 500

// // Fetches info from Wikidata and adds it to the db
// async function handleNextEvent(): Promise<void> {
//   const oldEvent = events[i]

//   let eventType
//   if (oldEvent.tags.indexOf('battle') > -1 || oldEvent.tags.indexOf('war') > -1) eventType = 'battle'
//   else if (oldEvent.tags.indexOf('human') > -1) eventType = 'human'

//   if (eventType == null) {
//     handleNextEvent()
//     return
//   }

//   const entity = await fetchEntities([oldEvent.wikidata_identifier])
//   const event = await handleEvent(eventType, entity[0])
//   event

//   if (i < events.length - 1) {
//     // Set the next index
//     i++
//     console.log(chalk.cyan(`Number: ${i}`))

//     // After the `wait`, insert the next battle
//     setTimeout(() => handleNextEvent(), wait)
//   }
// }

// async function go() {
//   const response = await selectEvents('label IS NULL', 2000)
//   events = response[0]
//   handleNextEvent()
// }
// go()



// /*
// # The battles array was downloaded from Wikidata:
// ```
// $ curl https://query.wikidata.org/sparql?format=json --data-urlencode query='SELECT ?instance_of WHERE { ?instance_of wdt:P31 wd:Q178561 }' | jq '.results.bindings' > battles.json
// ```

// # And the IDs extracted by:
// ```
// const battleIDs = battles.map(b => {
//   const v = b.instance_of.value
//   const lastIndex = v.lastIndexOf('/')
//   return v.slice(lastIndex + 1)
// })
// fs.writeFileSync('battles.json', JSON.stringify(battleIDs), 'utf8')
// ```
// */
