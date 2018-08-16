import { Pool } from "pg"
import { logError } from '../utils'
import * as fs from "fs";

const errorLogPath = `${process.cwd()}/error.log`
fs.openSync(errorLogPath, 'w')
const stream = fs.createWriteStream(errorLogPath, { flags: 'a' })

export const selectOne = async (table, field, value): Promise<any> => {
	const sql = `SELECT *
				FROM ${table}
				WHERE ${field}=$1`
	const rows = await execSql(sql, [value])
	return rows[0]
}

export const execSql = async (sql: string, values: (string | number)[] = []): Promise<any[]> => {
	let rows = []
	const pool = new Pool()
	try {
		const result = await pool.query(sql, values)
		rows = result.rows
	} catch (err) {
		logError('execSql', ['SQL execution failed', sql, values.map((v, i) => `${i}: ${v}\n`).join(''), err])		
		stream.write(JSON.stringify(values) + '\n')
	}
	await pool.end()
	return rows
}