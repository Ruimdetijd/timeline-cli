#! /usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.env') })
import chalk from 'chalk'
import { fetchEntities } from './wd-request'
import handleEvent from './handle-event'
import insertEventTagRelations from './db/insert-event-tag-relations'
import { selectOne } from './db/utils'
const jsonPath = path.resolve(__dirname, '../battles.json')
const battleIDs = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).slice(10900)

let i = 0

const insertBattle = async() => {
  const id = battleIDs[i]

  // Check if the battle is already inserted in the database
  const row = await selectOne('event', 'wikidata_identifier', id)

  // Only fetch from wikidata if the battle is unkown
  if (row == null) {
    const entity = await fetchEntities([id])
    const event = await handleEvent('battle', entity[0])
    if (event != null) await insertEventTagRelations(event.id, [11])
  } else {
    console.log(chalk.yellow(`'${row.label}' (${row.wikidata_identifier}) already exists!`))
  }

  if (i < battleIDs.length - 1) {
    // Set the next index
    i++
    console.log(chalk.cyan(`Number: ${i}`))

    // If the battle is already known, we do not have to relieve the Wikidata server
    const wait = (row == null) ? 1000 : 0

    // After the `wait`, insert the next battle
    setTimeout(() => insertBattle(), wait)
  }
}

insertBattle()




/*
# The battles array was downloaded from Wikidata:
```
$ curl https://query.wikidata.org/sparql?format=json --data-urlencode query='SELECT ?instance_of WHERE { ?instance_of wdt:P31 wd:Q178561 }
' | jq '.results.bindings' > battles.json
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
