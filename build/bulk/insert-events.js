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
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const chalk_1 = require("chalk");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(response => setTimeout(response, ms));
    });
}
function handleWikidataID(id, action) {
    return __awaiter(this, void 0, void 0, function* () {
        const [existingEvent] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${id}`);
        if ((action === 'insert' && existingEvent == null) ||
            (action === 'image' && existingEvent != null) ||
            action === 'update') {
            const [event] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${id}`, { method: 'POST' });
            if (event == null)
                console.log(chalk_1.default.red(`Event not found...`));
            else
                console.log(chalk_1.default.yellow(`'${event.lbl}' (${event.wid}) updated!`));
            yield delay(1000);
        }
        if (action === 'insert' && existingEvent == null) {
            console.log(chalk_1.default.yellow(`'${existingEvent.lbl}' (${existingEvent.wid}) already exists!`));
        }
        if (action === 'image' && existingEvent != null) {
            const [, response] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${id}/image`);
            if (response == null) {
                utils_1.logError('handleWikidataID', ['Response is undefined']);
            }
            else if (response.status === 404) {
                console.log(chalk_1.default.red(`'${existingEvent.lbl}' (${existingEvent.wid}) has no image(s)!`));
            }
            else if (response.status === 204) {
                console.log(chalk_1.default.yellow(`Retrieved image for: '${existingEvent.lbl}' (${existingEvent.wid})!`));
            }
            yield delay(1000);
        }
    });
}
function bulkUpdate(IDs, action = 'insert') {
    return __awaiter(this, void 0, void 0, function* () {
        let index = 0;
        for (const id of IDs) {
            console.log(chalk_1.default.cyan(`${++index}`));
            yield handleWikidataID(id, action);
        }
    });
}
exports.default = bulkUpdate;
