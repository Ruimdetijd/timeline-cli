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
const child_process_1 = require("child_process");
const readline_1 = require("./readline");
const insert_event_1 = require("./insert-event");
const wd_request_1 = require("./wd-request");
const handle_error_1 = require("./handle-error");
const insert_location_1 = require("./insert-location");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchTerm = yield readline_1.ask('Search for: ');
        const data = child_process_1.spawnSync('docker', ['run', '--rm', '-t', 'maxlath/wikidata-cli', 'f', searchTerm, '-j'], { encoding: 'utf8' });
        const [err, output] = data.output;
        handle_error_1.default(err);
        const searchList = JSON.parse(output);
        if (!searchList.length) {
            console.error('Nothing found');
            process.exit(1);
        }
        searchList.forEach((op, i) => console.log(i, op.label, op.description));
        const anwser = yield readline_1.ask('Enter a number: ');
        const entity = searchList[parseInt(anwser, 10)];
        const date = wd_request_1.getClaim(entity.id, 'P569').replace(/\\/g, '');
        const endDate = wd_request_1.getClaim(entity.id, 'P570').replace(/\\/g, '');
        yield insert_event_1.default(entity, date, endDate);
        const [placeOfBirthID, placeOfBirth, placeOfBirthLocation] = wd_request_1.getPlace(entity.id, 'P19');
        const [placeOfDeathID, placeOfDeath, placeOfDeathLocation] = wd_request_1.getPlace(entity.id, 'P20');
        if (placeOfBirthID != null)
            insert_location_1.default(placeOfBirthID, placeOfBirth, placeOfBirthLocation);
        if (placeOfDeathID != null)
            insert_location_1.default(placeOfDeathID, placeOfDeath, placeOfDeathLocation);
    });
}
main();
