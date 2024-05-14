const venom = require('venom-bot');
const path = require('path');
const utils = require('./utils');

const subsheetsTitleMap = new Map();

function prepareSubsheetsTitleMap(spreadsheet) {
    for (const key in spreadsheet.sheetsByTitle) {
        if (Object.hasOwnProperty.call(spreadsheet.sheetsByTitle, key)) {
            const element = spreadsheet.sheetsByTitle[key];
            subsheetsTitleMap.set(element.title, element);
        }
    }
}

async function 
readSubsheetToJSON(spreadsheet, subSheetName) {
    prepareSubsheetsTitleMap(spreadsheet);

    const subsheet = subsheetsTitleMap.get(subSheetName);
    
    let rows = null;

    try {
        rows = await subsheet.getRows();
    } catch (error) {
        console.error(error.message);
        process.exit(0);
    }

    return rows.map(row => row._rawData.reduce((acc, cell, index) => {
        acc[subsheet.headerValues[index]] = cell;
        return acc;
    }, {}));
}

function findAvailableSheetName(baseSheetName) {
    let suffix = 1;
    let sheetName = baseSheetName;

    while (true) {
        let exists = subsheetsTitleMap.get(sheetName);
        // Sheet exists, increment suffix and try again
        if (exists) {
            console.log(sheetName)
            suffix = (parseInt(suffix) + 1).toString();
            sheetName = `${baseSheetName}-${suffix}`;
        } else {
            break
        }
    }

    return sheetName;
}

function exit() {
    console.log('Process completed. Exiting...');
    process.exit(0);
}

function prepareMessage(name) {
return `Hello ${name}!
This is Shawan from DeepThought, 
This is a follow-up message to the bulk message sent in stage 1.`;
}

async function main(client, sheetId, subSheetName)  {
    console.log('Fetching data from Google Spreadsheet...');

    const spreadsheet = await utils.getSpreadSheetById(sheetId);
    const subsheetJSONArray = await readSubsheetToJSON(spreadsheet, subSheetName);

    if (!subsheetJSONArray.length) {
        console.log('No data to process');
        process.exit(0);
    }

    const stage2ReportMap = new Map();
    const headers = ['name', 'number', 'validNumber', 'repliedBack', 'messages', 'isFollowedUp'];
    const results = [];

    try {
        let jsonArray = await utils.readJSONFileSync('./outputs/stage2-results.json');
        if (jsonArray.length) {
            jsonArray.forEach(element => stage2ReportMap.set(element.number, element));
        }
    } catch (error) {}

    for (let index = 0; index < subsheetJSONArray.length; index++) {
        const row = subsheetJSONArray[index];
        let {name, number} = row;

        //guard clause 
        console.log(`Processing ${name} (${number})...`);   
        if (!number) {
            console.error(`Invalid number in row ${index + 1}: ${number}`);
            // Handle or skip this row as necessary
            continue;
        }

        number = utils.parseContactNumber(number);

        let isValidNumber = null;
        try {
            isValidNumber = await client.checkNumberStatus(utils.parseWAChatId(number));
        } catch (error) {}

        if (!isValidNumber) {
            row.isFollowedUp = 'No';
            row.repliedBack = 'No';
            row.validNumber = 'No';
            row.messages = '';

            console.log(`${row.name} (${row.name}) is not a valid number, skipping message send...`);

        } else {
            row.validNumber = 'Yes';

            let existingRow = stage2ReportMap.get(number),
            repliedBack = false,
            followUpSent = false;

            if (existingRow) {
                repliedBack = existingRow.repliedBack === 'Yes';
                followUpSent = existingRow.followUpSent  === 'Yes';
            } else {
                const chat = await client.loadAndGetAllMessagesInChat(utils.parseWAChatId(number), true, false);
                const receivedMessages = (chat || []).filter(message => !message.fromMe && message.type === 'chat' && message.body);
                const sentMessages = (chat || []).filter(message => message.fromMe && message.type === 'chat');

                const messages = receivedMessages.map(message => message.body);

                row.messages = messages.join(', ');

                repliedBack = Boolean(messages.length);
                followUpSent = sentMessages.length > 1;
            }

            if (!repliedBack && !followUpSent) {
                console.log(`Sending follow-up message to ${name} (${number})`);
                await client.sendText(number, prepareMessage(name));

                row.repliedBack = 'No';
                row.followUpSent = 'Yes';

            } else if (repliedBack) {
                row.repliedBack = 'Yes';
            }
        }

        results.push(row);
    }

    const sheetName = findAvailableSheetName('Results for ' + subSheetName);

    console.log('Writing the results to ', sheetName);

    const subsheet = await spreadsheet.addSheet({title: sheetName});

    await subsheet.setHeaderRow(headers);
    await subsheet.addRows(results);

    exit()
}

/**
 * Main function
 * 
 * @returns {Promise<void>}
 */

(() => {
    const sheetId = '1N6xxEPqYxXOE97ZhdrGJ-Boznpd8mKoQ67pTpbNKG3w';
    const subSheetName = 'Sheet1';

    console.log('Starting stage 2...');

    venom.create({ session: 'wa-broadcaster', logQR: true })
        .then(async(client) => await main(client, sheetId, subSheetName))
        .catch((erro) => {console.log(erro);});

})()