import  { ask } from './readline'
import chalk from 'chalk';
import fetch from 'node-fetch'

export class Entity {
	description: string
	id: string
	label: string
}

export default async (): Promise<Entity> => {
	const searchTerm = await ask(chalk`\n{yellow Search for: }`)
	const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${searchTerm.trim()}&language=en&format=json`)
	const searchResult = await response.json()
	const entities: Entity[] = searchResult.search

	if (!entities.length) {
		console.error(chalk.yellow('\nNothing found\n'))
	} else {
		entities.forEach((ent, i) => console.log(chalk`{cyan ${i.toString()}} ${ent.label} {gray ${ent.description}}`))
		const anwser = await ask('Enter a number: ')
		return entities[parseInt(anwser, 10)]
	}
}