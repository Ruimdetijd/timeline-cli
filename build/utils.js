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
const chalk_1 = require("chalk");
const node_fetch_1 = require("node-fetch");
exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms));
exports.clearLog = () => {
    if (process.env.NODE_ENV !== 'development')
        console.log('\x1Bc');
};
exports.logError = (title, lines) => console.error(chalk_1.default `{red [ERROR][${title}]}\n{gray ${lines.join('\n')}}\n{red [/ERROR]}`);
exports.logWarning = (title, lines) => console.log(chalk_1.default `{yellow [WARNING][${title}]}\n{gray ${lines.join('\n')}}\n{yellow [/WARNING]}`);
exports.logMessage = (message) => {
    if (message == null || !message.trim().length)
        return;
    console.log(chalk_1.default `{cyan.bold >>> ${message} <<<\n}`);
};
exports.logHeader = (header) => {
    if (header == null || !header.trim().length)
        return;
    console.log(chalk_1.default `{yellow.bold [Timeline CLI] ${header}\n}`);
};
function execFetch(url, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let body;
        let response;
        try {
            response = yield node_fetch_1.default(url, options);
            if (response.headers.get('content-length') > '0') {
                body = yield response.json();
            }
        }
        catch (err) {
            console.log(chalk_1.default `{red [execFetch] Fetch execution failed}\n`, chalk_1.default `{gray [ERROR]\n${err}\n\n[URL]\n${url}}`);
        }
        return [body, response];
    });
}
exports.execFetch = execFetch;
function execPost(url, jsObject) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: 'POST',
        };
        if (jsObject != null) {
            options.body = JSON.stringify(jsObject);
            options.headers = { 'Content-type': 'application/json' };
        }
        return yield execFetch(url, options);
    });
}
exports.execPost = execPost;
function entityToRow(entity, index) {
    return [index, entity.id, entity.label, entity.description];
}
exports.entityToRow = entityToRow;
function eventToRow(event, index) {
    const descr = event.description === null ? '' : event.description;
    return [index, event.wikidata_identifier, event.label, descr];
}
exports.eventToRow = eventToRow;
function tagToRow(tag, index) {
    return [index, tag.label];
}
exports.tagToRow = tagToRow;
