import * as readline from 'readline'
import chalk from 'chalk';

export const ask = (question: string) => new Promise<string>((resolve) => {
	question = chalk`{cyan.bold ${question}}`

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false,
	})

	rl.question(question, (anwser) => {
		resolve(anwser)
		rl.close()
	})
})

export const confirm = async (question: string, defaultAnwser: string = 'yes'): Promise<boolean> => { 
	let anwser = await ask(question)
	if (anwser === '') anwser = defaultAnwser
	return anwser.toLowerCase() === 'y' || anwser.toLowerCase() === 'yes'
}
