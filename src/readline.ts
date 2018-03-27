import * as readline from 'readline'

export const ask = (question: string) => new Promise<string>((resolve, reject) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
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
