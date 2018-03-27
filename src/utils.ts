import { Pool } from "pg";

export const selectOne = async (table, field, value): Promise<any> => {
	const sql = `SELECT *
				FROM ${table}
				WHERE ${field}=$1`
	const rows = await execSql(sql, [value])
	return rows[0]
}

export const execSql = async (sql: string, values?: (string | number)[]): Promise<any[]> => {
	const pool = new Pool()
	const result = await pool.query(sql, values)
	await pool.end()
	return result.rows
}

export const handleError = (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
}