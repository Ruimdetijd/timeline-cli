import chalk from "chalk"
import fetch, { Response } from 'node-fetch'
import { WdEntity, Ev3nt } from "./models";

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export const clearLog = () => {
	if (process.env.NODE_ENV !== 'development') console.log('\x1Bc')
}

export const logError = (title, lines) =>
	console.error(chalk`{red [ERROR][${title}]}\n{gray ${lines.join('\n')}}\n{red [/ERROR]}`)

export const logWarning = (title, lines) =>
	console.log(chalk`{yellow [WARNING][${title}]}\n{gray ${lines.join('\n')}}\n{yellow [/WARNING]}`)

export const logMessage = (message) => {
	if (message == null || !message.trim().length) return
	console.log(chalk`{cyan.bold >>> ${message} <<<\n}`)
}

export const logHeader = (header) => {
	if (header == null || !header.trim().length) return
	console.log(chalk`{yellow.bold [Timeline CLI] ${header}\n}`)
}

export async function execFetch(url: string, options = {}): Promise<[any, Response]> {
	let body: any
	let response: Response

	try {
		response = await fetch(url, options)
		if (response.headers.get('content-length') > '0') {
			body = await response.json()
		}
	} catch (err) {
		console.log(chalk`{red [execFetch] Fetch execution failed}\n`, chalk`{gray [ERROR]\n${err}\n\n[URL]\n${url}}`)	
	}

	return [body, response]
}

export async function execPost(url: string, jsObject?: any): Promise<[any, Response]> {
	const options: RequestInit = {
		method: 'POST',
	}

	if (jsObject != null) {
		options.body = JSON.stringify(jsObject)
		options.headers = { 'Content-type': 'application/json' }
	}

	return await execFetch(url, options)
}

export function entityToRow(entity: WdEntity, index) {
	return [index, entity.id, entity.label, entity.description]
}

export function eventToRow(event: Ev3nt, index) {
	const descr = event.description === null ? '' : event.description
	return [index, event.wikidata_identifier, event.label, descr]
}

export function tagToRow(tag, index) {
	return [index, tag.label]
}