const venom = require('venom-bot');
const utils = require('./utils');

module.exports = () => {
    console.log('Starting stage 1...');

    venom.create({ session: 'wa-broadcaster', logQR: true }).then(start).catch((erro) => {
      console.log(erro);
    });
}

async function start(client) {
    const contacts = utils.readJSONFileSync('./data/stage1.json');

    for (let index = 0; index < contacts.length; index++) {
        const element = contacts[index];
        const number = utils.parseWAChatId(element.number);
        const message = prepareMessage(element.name);
        let isValidNumber = null, 
            islastSend = index === (contacts.length - 1);

        try {
            isValidNumber = await client.checkNumberStatus(number);
        } catch (error) {}

        if (!isValidNumber) {
            console.log(`${element.number} (${element.name}) is not a valid number, skipping message send...`);
            
        } else {
            console.log(`Sending message to ${element.name}`);
            await client.sendText(number, message);
        }

        if (islastSend) {
            exit()
        }
    }

    client.onMessage(async (message) => {
      
        
    });
}

function prepareMessage(name) {
    return `
        Hello ${name}!

        This is Yuvaraj  from DeepThought, 
        I was just playing around for POC on how to send a bulk message with Whatsapp Automation service.

        Nothing to worry about, sorry to spam you :D
    `;
}

function exit() {
    console.log('Process completed. Exiting...');
    process.exit(0);
}


/**
 * @description Main function
 */

(() => {
    console.log('Starting stage 1...');
  
    venom.create({ session: 'wa-broadcaster', logQR: true }).then(start).catch((erro) => {
      console.log(erro);
    });
  })()