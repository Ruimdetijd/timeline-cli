import chalk from 'chalk'
import { ask } from './readline'
import searchWikidata from './search-wikidata'
import listEventsWithout from './list-events-without'
import { logHeader, logMessage, clearLog } from './utils'

const menuOptions = [
	'Insert or update a wikidata event',
	chalk`Events without a date {grey not updated in the last week}`,
	chalk`Events without a location {grey not updated in the last week}`,
	chalk`Events without a label {grey not updated in the last week}`,
	chalk`Events without an image {grey not updated in the last week}`,
]

export enum MenuAction {
	BACK = 'BACK',
	RELOAD = 'RELOAD',
	QUIT = 'QUIT',
}
type Message = string | MenuAction

const mainMenu = async (message: Message = '', option?: string) => {
	clearLog()
	logMessage(message)

	logHeader(menuOptions[option])

	if (option === '0') {
		message = await searchWikidata()
	} else if (option === '1') {
		message = await listEventsWithout('date')
	} else if (option === '2') {
		message = await listEventsWithout('location')
	} else if (option === '3') {
		message = await listEventsWithout('label')
	} else if (option === '4') {
		message = await listEventsWithout('image')
	} else if (option === 'q' || option === 'Q') {
		message = MenuAction.QUIT
	} else {
		const opts = menuOptions
			.map((opt, i) => chalk`{cyan ${i.toString()}} ${opt}`).join('\n')
			.concat(chalk`\n\n{cyan Q} Quit`)
		logHeader('Main Menu')
		console.log(opts)
		option = await ask(`\nChoose an option: `)
	}

	if (message === MenuAction.RELOAD) {
		message = null
	}

	if (message === MenuAction.BACK) {
		message = null
		option = null
	}

	if (message === MenuAction.QUIT) {
		console.log(chalk`\n{green.bold Good bye!}\n`)
		process.exit(1)
	}

	await mainMenu(message, option)
}

export default mainMenu














// const login = async () => {
// 	const wdEditor = await wdEdit({
// 		username: process.env.WDUSER,
// 		password: process.env.WDPASSWORD,
// 		userAgent: 'civslog-cli (https://github.com/ruimdetijd/civslog-cli'
// 	})

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
// }