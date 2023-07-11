const axios = require('axios');
const readline = require('readline');
const fs = require('fs');


const sendEventToServer = async (event) => {
    try {
        const response = await axios.post('http://localhost:8000/liveEvent', event, {
            headers: {
                'Authorization': 'secret'
            }
        });
        console.log('Response from server:', response.status);
    } catch (error) {
        console.error('Error:', error.response.status);
    }
};

const readEventsFromFile = async () => {
    const fileStream = fs.createReadStream('events.jsonl');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const event = JSON.parse(line);
        await sendEventToServer(event);
    }
};

module.exports = {
    sendEventToServer,
    readEventsFromFile
}


readEventsFromFile().then()

