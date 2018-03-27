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
const handle_error_1 = require("./handle-error");
const child_process_1 = require("child_process");
const readline_1 = require("./readline");
const pg_1 = require("pg");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = child_process_1.spawnSync('docker', ['run', '--rm', '-t', 'maxlath/wikidata-cli', 'data', process.argv[2]], { encoding: 'utf8' });
        const [err, output] = data.output;
        handle_error_1.default(err);
        if (output.slice(0, 9) === 'undefined') {
            console.error('Not found');
            process.exit(1);
        }
        const { id, labels, descriptions } = JSON.parse(output);
        const label = labels.en.value;
        const description = descriptions.en.value;
        const confirmed = yield readline_1.confirm(`Is this correct?\n${id}, ${label}, ${description}\n(yes)\n`);
        if (confirmed) {
            const sql = `INSERT INTO tag
						(label, description, wikidata_identifier)
					VALUES
						($1, $2, $3)`;
            const pool = new pg_1.Pool();
            const dbResponse = yield pool.query(sql, [label, description, id]);
            if (dbResponse.rowCount === 1)
                console.log('Tag inserted!');
            yield pool.end();
        }
    });
}
main();
