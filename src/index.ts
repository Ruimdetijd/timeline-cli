import chalk from 'chalk'
import { ask } from './readline'
import insertEvent from './cli-human'
import insertTag from './cli-tag'

const menuOptions = [
	'Insert an event',
	'Insert a tag',
	'Quit'
]

const mainMenu = async () => {
	const opts = menuOptions.map((opt, i) => chalk`{cyan ${i.toString()}} ${opt}`).join('\n')
	console.log(chalk`{bold.yellow [Timeline] Main Menu}\n${opts}`)
	const option = await ask(`Choose an option: `)
	if (option === '0') await insertEvent()
	else if (option === '1') await insertTag()
	else if (option === '2') {
		console.log(chalk`\n{green.bold Good bye!}\n`)
		process.exit(1)
	}
	await mainMenu()
}

mainMenu()