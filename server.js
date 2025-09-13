const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const wss = new WebSocket.Server({ port: 8080 });

let threats = {
    total: 0,
    network: 0,
    email: 0,
    lastUpdate: Date.now()
};

let persistentEvents = [];

wss.on('connection', ws => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'init', message: 'HackerWatch-Fortress Server Active' }));

    ws.on('message', message => {
        const data = JSON.parse(message);
        if (data.type === 'scan') {
            const scanResult = {
                type: 'scanResult',
                ports: '3 (Secure)',
                timestamp: new Date().toLocaleTimeString()
            };
            ws.send(JSON.stringify(scanResult));
            threats.network++;
            threats.total++;
            threats.lastUpdate = Date.now();
        } else if (data.type === 'threat') {
            const event = {
                id: persistentEvents.length + 1,
                type: data.threatType,
                details: data.details,
                timestamp: new Date().toLocaleTimeString()
            };
            persistentEvents.push(event);
            ws.send(JSON.stringify({ type: 'log', message: `[${event.timestamp}] [THREAT] ${event.details}` }));

            if (data.threatType === 'persistent') {
                reportToAgency(event);
            }
        }
    });
});

async function reportToAgency(event) {
    try {
        const response = await axios.post('https://api.cisa.gov/ais/submit', {
            eventId: event.id,
            type: event.type,
            details: event.details,
            timestamp: event.timestamp
        });
        console.log(`Reported to CISA: ${response.data}`);
        wss.clients.forEach(client => {
            client.send(JSON.stringify({
                type: 'log',
                message: `[${new Date().toLocaleTimeString()}] [AGENCY] Reported to CISA: ${event.details}`
            }));
        });
    } catch (error) {
        console.error('Agency referral failed:', error);
        wss.clients.forEach(client => {
            client.send(JSON.stringify({
                type: 'log',
                message: `[${new Date().toLocaleTimeString()}] [ERROR] Agency referral failed`
            }));
        });
    }
}

app.get('/stats', (req, res) => {
    res.json(threats);
});

app.get('/events', (req, res) => {
    res.json(persistentEvents);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
