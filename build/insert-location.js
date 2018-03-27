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
const readline_1 = require("./readline");
const chalk_1 = require("chalk");
const utils_1 = require("./utils");
exports.default = (event, location) => __awaiter(this, void 0, void 0, function* () {
    if (event.wikidata_identifier == null)
        return;
    const sql = `INSERT INTO location
					(label, description, coordinates, wikidata_identifier)
				VALUES
					('${location.label}', '${location.description}', ST_GeogFromText('SRID=4326;POINT(${location.coordinates})'), '${location.wikidata_identifier}')
				ON CONFLICT (label)
				DO UPDATE SET
					description = '${location.description}',
					coordinates = ST_GeogFromText('SRID=4326;POINT(${location.coordinates})'),
					wikidata_identifier = '${location.wikidata_identifier}'
				RETURNING *`;
    const confirmed = yield readline_1.confirm(chalk_1.default `\n{yellow About to insert location:}
{gray label}\t\t\t${location.label}
{gray description}\t\t${location.description}
{gray coordinates}\t\t${location.coordinates}
{gray wikidata entity ID}\t${location.wikidata_identifier}\n\nIs it correct? {cyan (yes)}`);
    if (confirmed) {
        const rows = yield utils_1.execSql(sql);
        if (rows.length) {
            console.log(chalk_1.default `{green Location "${location.label}" inserted into db!}`);
            location = rows[0];
        }
    }
    return location;
});
