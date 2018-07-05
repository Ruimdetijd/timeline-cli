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
const models_1 = require("./models");
const wd_request_1 = require("./wd-request");
const chalk_1 = require("chalk");
const onDate = (a, b) => {
    if (a.timestamp > b.timestamp)
        return 1;
    if (a.timestamp < b.timestamp)
        return -1;
    return 0;
};
const startDatePropertyByEventType = {
    'human': 'date of birth',
    'battle': 'start time',
};
const endDatePropertyByEventType = {
    'human': 'date of death',
    'battle': 'end time',
};
exports.setUTCDate = (year, month = 0, day = 1, hour = 0, minutes = 0, seconds = 0, milliseconds = 0) => {
    let date = Date.UTC(year, month, day, hour, minutes, seconds, milliseconds);
    if (year > -1 && year < 100) {
        const tmpDate = new Date(date);
        tmpDate.setUTCFullYear(year);
        date = tmpDate.getTime();
    }
    return date;
};
exports.default = (eventType, wdEntityID) => __awaiter(this, void 0, void 0, function* () {
    let startDates = yield wd_request_1.fetchClaimValue(wdEntityID, startDatePropertyByEventType[eventType]);
    const pointInTime = yield wd_request_1.fetchClaimValue(wdEntityID, 'point in time');
    startDates = startDates.concat(pointInTime);
    startDates.sort(onDate);
    let endDates = yield wd_request_1.fetchClaimValue(wdEntityID, endDatePropertyByEventType[eventType]);
    endDates = endDates.map(dd => {
        const date = new Date(dd.timestamp);
        let nextDate;
        if (dd.granularity === 'DAY')
            nextDate = exports.setUTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999);
        else if (dd.granularity === 'MONTH')
            nextDate = exports.setUTCDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999);
        else if (dd.granularity === 'YEAR')
            nextDate = exports.setUTCDate(date.getUTCFullYear(), 11, 31, 23, 59, 59, 999);
        else {
            console.error(chalk_1.default `{red Unhandled granularity "${dd.granularity}"}`);
        }
        if (nextDate != null) {
            dd.timestamp = nextDate;
        }
        return dd;
    });
    endDates.sort(onDate);
    const dates = [new models_1.WdDate(), new models_1.WdDate(), new models_1.WdDate(), new models_1.WdDate()];
    if (startDates.length > 1)
        dates[0] = startDates[0];
    if (startDates.length)
        dates[1] = startDates[startDates.length - 1];
    if (endDates.length)
        dates[2] = endDates[0];
    if (endDates.length > 1)
        dates[3] = endDates[endDates.length - 1];
    return dates;
});
