#! /usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import chalk from 'chalk'
import { civslogServerURL } from '../constants';
import { execFetch } from '../utils';
const jsonPath = path.resolve(__dirname, '../../war-ids.json')
const IDs = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).slice(260)

let i = 0

// Fetches info from Wikidata and adds it to the db
const handleWikidataID = async () => {
  const id = IDs[i]

  // Check if the event is already inserted in the database
	const [existingEvent] = await execFetch(`${civslogServerURL}/events/${id}`)

  // Only fetch from wikidata if the battle is unkown
  if (existingEvent == null) {
	  await execFetch(`${civslogServerURL}/events/${id}`, { method: 'POST' })
  } else {
    console.log(chalk.yellow(`'${existingEvent.label}' (${existingEvent.wikidata_identifier}) already exists!`))
  }

  if (i < IDs.length - 1) {
    // Set the next index
    i++
    console.log(chalk.cyan(`Number: ${i}`))

    // If the battle is already known, we do not have to relieve the Wikidata server
    const wait = (existingEvent == null) ? 1000 : 0

    // After the `wait`, insert the next battle
    setTimeout(() => handleWikidataID(), wait)
  }
}

handleWikidataID()

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
