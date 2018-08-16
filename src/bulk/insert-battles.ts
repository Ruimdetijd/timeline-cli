#! /usr/bin/env node

// TODO list errors in file

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import chalk from 'chalk'
import { fetchEntities } from '../wd-request'
import handleEvent from '../handle-event'
import insertEventTagRelations from '../db/insert-event-tag-relations'
import { selectOne } from '../db/utils'
import { EventType } from '../event';
const jsonPath = path.resolve(__dirname, '../../war-ids.json')
const IDs = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).slice(260)

const EVENT_TYPE: EventType = 'war'

let i = 0

// Fetches info from Wikidata and adds it to the db
const handleWikidataID = async (eventTypeID: number) => {
  const id = IDs[i]

  // Check if the event is already inserted in the database
  const row = await selectOne('event', 'wikidata_identifier', id)

  // Only fetch from wikidata if the battle is unkown
  if (row == null) {
    const entity = await fetchEntities([id])
    const event = await handleEvent(EVENT_TYPE, entity[0])
    if (event != null) await insertEventTagRelations(event.id, [eventTypeID])
  } else {
    console.log(chalk.yellow(`'${row.label}' (${row.wikidata_identifier}) already exists!`))
  }

  if (i < IDs.length - 1) {
    // Set the next index
    i++
    console.log(chalk.cyan(`Number: ${i}`))

    // If the battle is already known, we do not have to relieve the Wikidata server
    const wait = (row == null) ? 1000 : 0

    // After the `wait`, insert the next battle
    setTimeout(() => handleWikidataID(eventTypeID), wait)
  }
}

// handleWikidataID()
selectOne('tag', 'label', EVENT_TYPE).then((row) => {
  if (row) {
    handleWikidataID(row.id)
  }
})




/*
# The battles array was downloaded from Wikidata:
```
$ curl https://query.wikidata.org/sparql?format=json --data-urlencode query='SELECT ?instance_of WHERE { ?instance_of wdt:P31 wd:Q178561 }' | jq '.results.bindings' > battles.json
```

# And the IDs extracted by:
```
const battleIDs = battles.map(b => {
  const v = b.instance_of.value
  const lastIndex = v.lastIndexOf('/')
  return v.slice(lastIndex + 1)
})
fs.writeFileSync('battles.json', JSON.stringify(battleIDs), 'utf8')
```
*/
