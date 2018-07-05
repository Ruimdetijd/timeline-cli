"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const utils_1 = require("../utils");
exports.selectOne = (table, field, value) => __awaiter(this, void 0, void 0, function* () {
    const sql = `SELECT *
				FROM ${table}
				WHERE ${field}=$1`;
    const rows = yield exports.execSql(sql, [value]);
    return rows[0];
});
exports.execSql = (sql, values = []) => __awaiter(this, void 0, void 0, function* () {
    let rows = [];
    const pool = new pg_1.Pool();
    try {
        const result = yield pool.query(sql, values);
        rows = result.rows;
    }
    catch (err) {
        utils_1.logError('execSql', ['SQL execution failed', sql, values.map((v, i) => `${i}: ${v}\n`).join(''), err]);
    }
    yield pool.end();
    return rows;
});
