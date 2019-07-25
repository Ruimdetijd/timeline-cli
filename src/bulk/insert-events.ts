import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import chalk from 'chalk'
import { civslogServerURL } from '../constants';
import { execFetch, logError } from '../utils';
import { RawEv3nt } from 'timeline';
import { Response } from 'node-fetch';

async function delay(ms) {
  return new Promise(response => setTimeout(response, ms))
}

export type Action = 'insert' | 'update' | 'image'

// Fetches info from Wikidata and adds it to the db
async function handleWikidataID(id: string, action: Action) {

  // Check if the event is already inserted in the database
  const [existingEvent] = await execFetch(`${civslogServerURL}/events/${id}`) as [RawEv3nt, Response]

  if (
    (action === 'insert' && existingEvent == null) ||
    (action === 'image' && existingEvent != null) ||
    action === 'update'
  ) {
    const [event] = await execFetch(`${civslogServerURL}/events/${id}`, { method: 'POST' }) as [RawEv3nt, Response]
    if (event == null) console.log(chalk.red(`Event not found...`))
    else console.log(chalk.yellow(`'${event.lbl}' (${event.wid}) updated!`))
    await delay(1000)
  }

  if (action === 'insert' && existingEvent == null) {
    console.log(chalk.yellow(`'${existingEvent.lbl}' (${existingEvent.wid}) already exists!`))
  }

  if (action === 'image' && existingEvent != null) {
    const [, response] = await execFetch(`${civslogServerURL}/events/${id}/image`)
    if (response == null)  {
      logError('handleWikidataID', ['Response is undefined'])
    } else if (response.status === 404) {
      console.log(chalk.red(`'${existingEvent.lbl}' (${existingEvent.wid}) has no image(s)!`))
    } else if (response.status === 204) {
      console.log(chalk.yellow(`Retrieved image for: '${existingEvent.lbl}' (${existingEvent.wid})!`))
    }
    await delay(1000)
  }
}

export default async function bulkUpdate(IDs: string[], action: Action = 'insert'): Promise<void> {
  let index = 0
  for (const id of IDs) {
    console.log(chalk.cyan(`${++index}`))
    await handleWikidataID(id, action)
  }
}

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
