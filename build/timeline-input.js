var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
const readline = require('readline');
const readlinePromise = (title) => new Promise((resolve, reject) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question(title, (anwser) => {
        resolve(anwser);
        rl.close();
    });
});
const main = () => __awaiter(this, void 0, void 0, function* () {
    const event = {};
    let defaultFilename = 'explorers';
    let filename = yield readlinePromise(`Enter filename (${defaultFilename}): `);
    if (!filename.length)
        filename = defaultFilename;
    const data = JSON.parse(fs.readFileSync(`${filename}.json`, 'utf8'));
    const title = yield readlinePromise('Enter the title: ');
    if (title.length)
        event.title = title;
    else {
        console.error('No title');
        process.exit(1);
    }
    const date = yield readlinePromise('Enter the date (yyyy/mm/dd): ');
    if (date !== '' && !isNaN(Date.UTC(...date.split('/')))) {
        event.date = Date.UTC(...date.split('/'));
        console.log(new Date(event.date).toUTCString());
    }
    else {
        console.error('Invalid date');
        process.exit(1);
    }
    const endDate = yield readlinePromise('Enter the end date (yyyy/mm/dd): ');
    if (endDate !== '' && !isNaN(Date.UTC(...endDate.split('/')))) {
        event.endDate = Date.UTC(...endDate.split('/'));
        console.log(new Date(event.endDate).toUTCString());
        if (event.endDate < event.date) {
            console.error('End date should be greater than start date');
            process.exit(1);
        }
    }
    const OK = yield readlinePromise(`Is this OK?\n${JSON.stringify(event, null, 2)}\n(yes)`);
    if (OK.toLowerCase() === 'y' || OK === '') {
        data.push(event);
        fs.writeFileSync(`${filename}.json`, JSON.stringify(data), 'utf8');
    }
});
main();
