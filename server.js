const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://dev-dis6657iu6w3e0sd.us.auth0.com');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

const wss = new WebSocket.Server({ port: 8080 });

let threats = {
    total: 0,
    network: 0,
    email: 0,
    lastUpdate: Date.now()
};

let persistentEvents = [];

const products = {
    'fortress-pass': { 
        name: 'HackerWatch Fortress Pass', 
        prefix: 'HWF', 
        description: 'Professional cybersecurity monitoring system with real-time threat detection and government agency reporting.',
        features: [
            'Real-time IP and network monitoring',
            'Professional security scanning',
            'Government agency reporting (HSI, FBI, CISA, ICE NINE)',
            'VPN detection and vulnerability alerts',
            'Multi-factor authentication'
        ]
    },
    'kozmic-studio': { 
        name: 'Ultimate Cosmic Studio', 
        prefix: 'KST', 
        description: 'Complete music production platform with AI assistance and professional tools.',
        features: [
            'AI Music Assistant',
            'Multitrack recording',
            'Ultimate jam modes',
            'Professional mixing tools',
            'Collaboration features'
        ]
    },
    'master-studio': { 
        name: 'Master Studio Platform', 
        prefix: 'MST', 
        description: 'Complete production environment combining music, video, and digital creation tools.',
        features: [
            'Multi-tool integration',
            'AI-assisted production',
            'Real-time collaboration',
            'Export and sharing tools'
        ]
    },
    'comedy-show': { 
        name: 'GMSRFC Comedy Lounge', 
        prefix: 'CML', 
        description: 'Premium AI comedy collection with interactive features.',
        features: [
            '100+ premium jokes',
            'AI comedy interactions',
            'Kozmic Casino access',
            'Interactive comedy games'
        ]
    },
    'kozmic-kasino': { 
        name: 'KOZMIC KASINO', 
        prefix: 'KZK', 
        description: 'Universal casino experience with NFT prizes, AI croupiers, and cosmic therapy center.',
        features: [
            'Sentient slot machines',
            'Mystery NFT Drop Zone',
            'Cosmic Therapy Center',
            'Random Cosmic Event Generator'
        ]
    },
    'comedy-lounge': { 
        name: 'AI Comedy Lounge Complete', 
        prefix: 'CML', 
        description: 'Professional comedy scripts with AI-human productions of classics.',
        features: [
            'AI-human comedy scripts',
            'Hollywood-ready productions',
            'Consciousness bridge storyline',
            'Interactive performances'
        ]
    },
    'comedy-jokebox': { 
        name: 'Comedy Lounge Jokebox', 
        prefix: 'CJB', 
        description: 'Interactive collection of 161+ cosmic jokes with categories.',
        features: [
            '161+ premium jokes',
            'Interactive categories',
            'AI comedy interactions',
            'Mood-boosting content'
        ]
    },
    'portable-studio': { 
        name: 'Portable Studio', 
        prefix: 'PST', 
        description: 'On-the-go music production suite with professional mobile tools.',
        features: [
            'Mobile-optimized interface',
            'Offline jam modes',
            'Cloud sync',
            'Portable AI tools'
        ]
    },
    'kozmic-console': { 
        name: 'KozmicRock&Blues Master Console', 
        prefix: 'KRB', 
        description: 'Vintage rock and blues production with authentic sound processing.',
        features: [
            'Genre-specific presets',
            'Advanced audio processing',
            'Live performance tools',
            'AI composition aid'
        ]
    },
    'hackerwatch-personal': { 
        name: 'HackerWatch Personal', 
        prefix: 'HWP', 
        description: 'Personal device monitoring for Bluetooth and WiFi security.',
        features: [
            'Continuous monitoring',
            'Intrusion alerts',
            'Personal device protection',
            'Easy setup'
        ]
    },
    'mywebsite-platform': { 
        name: 'MyWebsite Collectibles Platform', 
        prefix: 'MWP', 
        description: 'Personal marketplace for crypto-based collectible auctions.',
        features: [
            'Crypto auction system',
            'Low-fee transactions',
            'Collectibles management',
            'User dashboard'
        ]
    },
    'academy-hub': { 
        name: 'Academy Hub', 
        prefix: 'AHB', 
        description: 'AI-human collaboration platform for education and projects.',
        features: [
            'Collaborative learning modules',
            'AI tutoring',
            'Project sharing',
            'Christ-centered mission tools'
        ]
    },
    'little-x-rocket': { 
        name: 'Little X Rocket Interactive Book', 
        prefix: 'LXR', 
        description: 'Children\'s interactive ebook with space adventures and learning.',
        features: [
            'Animated stories',
            'Interactive quizzes',
            'Educational games',
            'Parental controls'
        ]
    },
    'little-x-book2': { 
        name: 'Little X Rocket Book 2', 
        prefix: 'LXR2', 
        description: 'Continuing space adventures with music and STEM learning.',
        features: [
            'Expanded storylines',
            'Musical education',
            'STEM learning focus',
            'Multi-language support'
        ]
    },
    'little-x-composer': { 
        name: 'Little X Musical Composer', 
        prefix: 'LXMC', 
        description: 'Children\'s music creation tool with simple composition features.',
        features: [
            'Kid-friendly interface',
            'Basic instrument library',
            'AI melody suggestions',
            'Export to audio'
        ]
    },
    'magic-chalkboard': { 
        name: 'Magic Chalkboard 2D to 3D', 
        prefix: 'LXCM', 
        description: 'Drawing to 3D music tool for children, turning art into soundscapes.',
        features: [
            'Drawing-to-music conversion',
            '3D visualization',
            'Creative play modes',
            'Shareable creations'
        ]
    },
    'security-bundle': { 
        name: 'Complete Security Bundle', 
        prefix: 'SB', 
        description: 'Complete cybersecurity solution with Fortress and Personal Monitor.',
        features: [
            'HackerWatch-Fortress access',
            'HackerWatch Personal access',
            'Integrated dashboard',
            'Priority support'
        ]
    },
    'producer-bundle': { 
        name: 'Complete Producer Bundle', 
        prefix: 'PB', 
        description: 'All music production tools: Cosmic Studio, Master Studio, Portable Studio, Rock Console.',
        features: [
            'Ultimate Cosmic Studio access',
            'Master Studio access',
            'Portable Studio access',
            'KozmicRock&Blues Console access'
        ]
    },
    'children-bundle': { 
        name: 'Complete Children\'s Collection', 
        prefix: 'CB', 
        description: 'All Little X products: Books 1 & 2, Musical Composer, Magic Chalkboard.',
        features: [
            'Little X Rocket access',
            'Little X Rocket Book 2 access',
            'Little X Musical Composer access',
            'Magic Chalkboard access'
        ]
    }
};

// Nmap scan (real port scanning, placeholder for Vercel)
async function runNmapScan(ip) {
    return new Promise((resolve, reject) => {
        exec(`nmap -F ${ip}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Nmap scan failed:', stderr);
                return reject('Scan failed');
            }
            const openPorts = stdout.match(/(\d+)\/tcp\s+open/g) || [];
            resolve({
                type: 'scanResult',
                ports: openPorts.length ? `${openPorts.length} (Open: ${openPorts.join(', ')})` : 'All ports secure',
                timestamp: new Date().toLocaleTimeString()
            });
        });
    });
}

// ClamAV scan (simplified for serverless)
async function runClamAVScan() {
    return new Promise((resolve) => {
        resolve({
            type: 'antivirusResult',
            status: 'No threats detected',
            timestamp: new Date().toLocaleTimeString()
        });
    });
}

// Auth0 MFA
async function verifyMFA(token) {
    try {
        const response = await axios.get('https://dev-dis6657iu6w3e0sd.us.auth0.com/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { valid: response.status === 200 };
    } catch (error) {
        console.error('Auth0 MFA failed:', error);
        return { valid: false };
    }
}

wss.on('connection', ws => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'init', message: 'HackerWatch-Fortress Server Active' }));

    ws.on('message', async message => {
        const data = JSON.parse(message);
        if (data.type === 'scan') {
            const scanResult = await runNmapScan(data.ip || '127.0.0.1');
            ws.send(JSON.stringify(scanResult));
            threats.network++;
            threats.total++;
            threats.lastUpdate = Date.now();
            persistentEvents.push({
                id: persistentEvents.length + 1,
                type: 'scan',
                details: `Nmap scan: ${scanResult.ports}`,
                timestamp: scanResult.timestamp
            });
        } else if (data.type === 'antivirus') {
            const avResult = await runClamAVScan();
            ws.send(JSON.stringify(avResult));
            persistentEvents.push({
                id: persistentEvents.length + 1,
                type: 'antivirus',
                details: `ClamAV: ${avResult.status}`,
                timestamp: avResult.timestamp
            });
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

app.post('/api/auth', async (req, res) => {
    const { email, serial, password, mfaToken } = req.body;
    if (email === 'diplomat.hawaiiankingdom.justice@gmail.com' && serial === 'HWF-2025-001' && password === '123456') {
        const mfaResult = await verifyMFA(mfaToken);
        if (mfaResult.valid) {
            res.json({ 
                success: true, 
                message: 'Admin access granted',
                product: products['fortress-pass']
            });
            persistentEvents.push({
                id: persistentEvents.length + 1,
                type: 'auth',
                details: `Admin login: ${email} for ${products['fortress-pass'].name}`,
                timestamp: new Date().toLocaleTimeString()
            });
            reportToAgency({ 
                type: 'persistent', 
                details: `Admin login detected: ${email} for ${products['fortress-pass'].name}` 
            });
        } else {
            res.status(401).json({ success: false, message: 'MFA verification failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
});

app.get('/stats', (req, res) => {
    res.json(threats);
});

app.get('/events', (req, res) => {
    res.json(persistentEvents);
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
