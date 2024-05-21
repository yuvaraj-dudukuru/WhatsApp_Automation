const venom = require('venom-bot');
const path = require('path');
const utils = require('./utils');

const contactsBasedMessagesMap = new Map();
const jsonFilename = path.basename(__filename, path.extname(__filename));

async function start(client) {

    const contacts = utils.readJSONFileSync(`./data/${jsonFilename}.json`);
    const resultFilename = `${jsonFilename}-results.json`;

    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        const number = utils.parseWAChatId(contact.number);
        const contactNumber = utils.parseContactNumber(number);
        
        const result = {name: contact.name, messages: [], repliedBack: 'No', followUpSent: 'No'}

        let isValidNumber = null;
        try {
            isValidNumber = await client.checkNumberStatus(number);
        } catch (error) {}

        if (!isValidNumber) {
            result.validNumber = 'No';
            contactsBasedMessagesMap.set(contactNumber, result);

            // console.log(`${contact.name} (${element.name}) is not a valid number, skipping message send...`);
        console.log(`${contact.name}  is not a valid number, skipping message send...`);
        } else {
            const chat = await client.loadAndGetAllMessagesInChat(number, false, false);
            const receivedMessages = (chat || []).filter(message => message.type === 'chat' && message.body);

            const messages = receivedMessages.map(message => message.body);

            if (!messages.length) {
                await sendFollowUpMessage(number, contact.name, client);
                result.followUpSent = 'Yes';

            } else {
                console.log(`${contact.name} has replied back.`);
                result.messages = messages;
                result.repliedBack = 'Yes';
            }

            contactsBasedMessagesMap.set(contactNumber, result);
        }
    }

    const contactsBasedMessages = Array.from(contactsBasedMessagesMap, ([key, value]) => ({ number: key, ...value }));

    console.log('Writing the results to ', resultFilename);
    utils.writeJSONFileSync(contactsBasedMessages, resultFilename);

    exit();
}

async function sendFollowUpMessage (number, name, client) {
    const message = prepareMessage(name);

    await client.sendText(number, message);
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


/**
 * @description Main function
 */

(() => {
  console.log('Starting stage 2...');

  venom.create({ session: 'wa-broadcaster', logQR: true }).then(start).catch((erro) => {
    console.log(erro);
  });
})()
