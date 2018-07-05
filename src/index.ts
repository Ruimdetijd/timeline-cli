import chalk from 'chalk'
import { ask } from './readline'
import insertEvent from './event'
import insertTag from './cli-tag'
import listEventsWithoutDates from './list-events-without-date'
import listEventsWithoutLocation from './list-events-without-location'
import { logHeader, logMessage, clearLog, execFetch } from './utils'
// import { wikiApiURL } from './constants';
import * as wdEdit from 'wikidata-edit'
// import { wikiApiURL } from './constants';

const menuOptions = [
	'Insert a human',
	'Insert a war, military campaign, military operation or battle',
	'Insert a tag',
	'List events without a date',
	'List events without a location'
]

const login = async () => {
	const wdEditor = await wdEdit({
		username: process.env.WDUSER,
		password: process.env.WDPASSWORD,
		userAgent: 'timeline-cli:1.0.0 (https://github.com/chronovis/timeline-cli'
	})

	// wdEditor.claim.add('Q4115189', 'P569', { time: '1802-01-05', precision: 11 })
	// wdEditor.claim.update('Q4115189', 'P570', null, { time: '1824-01-05', precision: 11 })
	// console.log(token.token)
	// const query = `?action=wbcreateclaim&entity=Q688308&property=P527&snaktype=value&value={"entity-type":"item","numeric-id":5162452}&token=${token.token}&format=json`
	// const createClaimResponse = await execFetch(`${wikiApiURL}${query}`, {
	// 	method: 'POST',
	// 	body: JSON.stringify({ token: token.token })
	// })
	// console.log(createClaimResponse)
	// const lgtoken = tokenResponse.query.tokens.logintoken
	// const loginResponse = await execFetch(
	// 	`${wikiApiURL}?action=login&&format=json`,
	// 	{
	// 		body: JSON.stringify({
	// 			lgname: process.env.WDUSER,
	// 			lgtoken,
	// 			lgpassword: process.env.WDPASSWORD,
	// 		}),
	// 		method: 'POST'
	// 	}
	// )
	// console.log(loginResponse)
}

const mainMenu = async (message: string = '') => {
	// await login()
	const opts = menuOptions
		.map((opt, i) => chalk`{cyan ${i.toString()}} ${opt}`).join('\n')
		.concat(chalk`\n{cyan Q} Quit`)
	clearLog()
	logMessage(message)
	logHeader('Main Menu')
	console.log(opts)
	const option = await ask(`\nChoose an option: `)

	if (option === '0') message = await insertEvent('human')
	if (option === '1') message = await insertEvent('battle')
	else if (option === '2') message = await insertTag()
	else if (option === '3') {
		clearLog()
		logHeader('Events without dates')
		message = await listEventsWithoutDates()
	} else if (option === '4') {
		clearLog()
		logHeader('Events without a location')
		message = await listEventsWithoutLocation()
	} else if (option.toUpperCase() === 'Q') {
		console.log(chalk`\n{green.bold Good bye!}\n`)
		process.exit(1)
	}
	await mainMenu(message)
}

export default mainMenu